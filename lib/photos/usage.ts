// Photo-usage tracking for the central photo library.
//
// `types/photo.ts` promises that a Photo records where it is referenced
// ("for safe deletes / reuse tracking"), and the gallery route has always kept
// `usedIn.galleries` current. The blog half was never written: a post could
// carry a library photo as its hero for a year and the photo still claimed it
// was used nowhere, so deleting it destroyed Cloudinary's copy and left a
// broken hero on a live post with no warning. This module is that missing half.
//
// Values stored in `usedIn.blogs` are post SLUGS, not ids, so the admin UI can
// name the posts blocking a delete without a second lookup. Slugs are editable,
// so `renamePostInPhotoUsage` keeps them honest when a post is renamed.
//
// The pure half (which ids a post uses, what changed, how to describe it) is
// separated from the Mongo half so the back-compat rules are unit-tested
// without a database.

import { ObjectId } from 'mongodb'
import type { Db } from 'mongodb'
import { COLLECTIONS } from '@/lib/db/collections'

/** The parts of a blog post that can reference library photos. */
export interface PhotoReferencingPost {
  featuredImage?: unknown
  photoIds?: unknown
}

export interface PhotoUsage {
  galleries?: string[]
  blogs?: string[]
  portfolio?: boolean
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Every library photo id a post references, deduped, in first-seen order.
 *
 * Deliberately defensive about shape. Posts predate the library in three ways
 * that all still exist in the collection, and none of them may throw here:
 *   - no `featuredImage` at all (the majority of older posts),
 *   - a `featuredImage` that is a bare URL string from before it became an
 *     object, or an object holding only `url`/`alt` with no library `id`,
 *   - no `photoIds` array.
 * All three simply contribute nothing. Only a photo genuinely drawn from the
 * library — which is the only way an `id` gets written — is tracked.
 */
export function photoIdsForPost(post: PhotoReferencingPost | null | undefined): string[] {
  if (!post) return []

  const ids: string[] = []

  const featured = post.featuredImage
  if (featured && typeof featured === 'object' && 'id' in featured) {
    const id = (featured as { id?: unknown }).id
    if (isNonEmptyString(id)) ids.push(id.trim())
  }

  if (Array.isArray(post.photoIds)) {
    for (const id of post.photoIds) {
      if (isNonEmptyString(id)) ids.push(id.trim())
    }
  }

  return Array.from(new Set(ids))
}

/** What changed between two reference lists. Order-insensitive. */
export function diffPhotoUsage(
  previous: string[],
  next: string[],
): { added: string[]; removed: string[] } {
  const before = new Set(previous)
  const after = new Set(next)
  return {
    added: Array.from(after).filter(id => !before.has(id)),
    removed: Array.from(before).filter(id => !after.has(id)),
  }
}

/**
 * Human-readable answer to "is anything using this photo?", used by the delete
 * guard and the admin library card. Counts galleries and posts separately
 * because they break differently: a gallery is private to one client, a blog
 * post is public.
 */
export function describePhotoUsage(usedIn: PhotoUsage | null | undefined): {
  galleries: string[]
  blogs: string[]
  portfolio: boolean
  total: number
  summary: string
} {
  const galleries = Array.isArray(usedIn?.galleries) ? usedIn.galleries.filter(isNonEmptyString) : []
  const blogs = Array.isArray(usedIn?.blogs) ? usedIn.blogs.filter(isNonEmptyString) : []
  const portfolio = usedIn?.portfolio === true

  const parts: string[] = []
  if (blogs.length > 0) parts.push(`${blogs.length} blog post${blogs.length === 1 ? '' : 's'}`)
  if (galleries.length > 0) parts.push(`${galleries.length} galler${galleries.length === 1 ? 'y' : 'ies'}`)
  if (portfolio) parts.push('the public portfolio')

  return {
    galleries,
    blogs,
    portfolio,
    total: blogs.length + galleries.length,
    summary: parts.length === 0 ? 'Not used anywhere' : `Used in ${parts.join(', ')}`,
  }
}

/**
 * The photos collection as STORED, limited to the fields this module touches.
 * It is deliberately not `types/photo.ts`'s `Photo`: the stored document has
 * Mongo's `_id`, while `Photo.id` is the string the API projects for clients.
 *
 * Naming the schema is also what makes `$pull: { 'usedIn.blogs': slug }`
 * typecheck. On an untyped `Collection<Document>` the driver's `PullOperator`
 * treats every key as an array field and demands an array-or-operator value,
 * so passing a bare string fails — which is the exact spot the abandoned 2025
 * photo branch reached for `as any`. With a real schema, `usedIn` is a known
 * object, the dotted path falls through to the operator's index signature, and
 * the scalar is accepted on its own merits.
 */
export interface PhotoUsageDocument {
  _id: ObjectId
  usedIn: {
    galleries: string[]
    blogs: string[]
    portfolio: boolean
  }
  updatedAt: Date
}

/** Ids that can address a document in the photos collection. */
function toObjectIds(ids: string[]): ObjectId[] {
  return ids.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id))
}

/**
 * Bring `usedIn.blogs` in line with what the post now references.
 *
 * Additive and subtractive in one call so removing a hero image releases the
 * photo for deletion instead of leaving a phantom reference forever. Safe to
 * call when nothing changed — it issues no writes.
 */
export async function syncPostPhotoUsage(
  db: Db,
  slug: string,
  previousIds: string[],
  nextIds: string[],
): Promise<void> {
  if (!isNonEmptyString(slug)) return
  const { added, removed } = diffPhotoUsage(previousIds, nextIds)
  const photos = db.collection<PhotoUsageDocument>(COLLECTIONS.photos)
  const now = new Date()

  const addIds = toObjectIds(added)
  if (addIds.length > 0) {
    await photos.updateMany(
      { _id: { $in: addIds } },
      { $addToSet: { 'usedIn.blogs': slug }, $set: { updatedAt: now } },
    )
  }

  const removeIds = toObjectIds(removed)
  if (removeIds.length > 0) {
    await photos.updateMany(
      { _id: { $in: removeIds } },
      { $pull: { 'usedIn.blogs': slug }, $set: { updatedAt: now } },
    )
  }
}

/** Drop a post from every photo that lists it (post deleted). */
export async function releasePostPhotoUsage(db: Db, slug: string): Promise<void> {
  if (!isNonEmptyString(slug)) return
  await db.collection<PhotoUsageDocument>(COLLECTIONS.photos).updateMany(
    { 'usedIn.blogs': slug },
    { $pull: { 'usedIn.blogs': slug }, $set: { updatedAt: new Date() } },
  )
}

/**
 * Follow a slug change. Usage is keyed by slug for readability, so a rename
 * would otherwise strand every photo on the old name and make the delete guard
 * cite a post that no longer exists.
 */
export async function renamePostInPhotoUsage(
  db: Db,
  oldSlug: string,
  newSlug: string,
): Promise<void> {
  if (!isNonEmptyString(oldSlug) || !isNonEmptyString(newSlug) || oldSlug === newSlug) return
  const photos = db.collection<PhotoUsageDocument>(COLLECTIONS.photos)
  const now = new Date()
  await photos.updateMany(
    { 'usedIn.blogs': oldSlug },
    { $addToSet: { 'usedIn.blogs': newSlug }, $set: { updatedAt: now } },
  )
  await photos.updateMany(
    { 'usedIn.blogs': oldSlug },
    { $pull: { 'usedIn.blogs': oldSlug }, $set: { updatedAt: now } },
  )
}
