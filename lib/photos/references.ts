// What uses a library photo: the live check the delete paths trust, and the
// `usedIn` cache the admin library card reads. Server-only (mongodb); the pure
// rules live in `lib/photos/usage.ts`.
//
// The cache is kept on every post save and rebuilt on demand, but the delete
// paths still check live: a photo added "from library" to a gallery shares the
// library's Cloudinary file, so destroying that file breaks every post, gallery
// and /photography card that shows it, and a stale count must never allow that.

import { ObjectId } from 'mongodb'
import type { AnyBulkWriteOperation, Db, Filter, Document } from 'mongodb'
import { COLLECTIONS } from '@/lib/db/collections'
import { computePhotoUsage, libraryPhotoIdsInPost } from '@/lib/photos/usage'
import type { LibraryPhotoRef, PhotoReferencingPost } from '@/lib/photos/usage'

/** The photos collection as stored, limited to the fields used here. */
//
// Naming the schema is also what makes `$pull: { 'usedIn.blogs': slug }`
// typecheck: on an untyped collection the driver demands an array value there,
// which is where the abandoned 2025 photo branch reached for `as any`.
interface StoredPhoto {
  cloudinaryId?: string
  originalUrl?: string
  usedIn: { galleries: string[]; blogs: string[]; portfolio: boolean }
  updatedAt: Date
}

export interface PhotoReferences {
  blogs: string[] // post slugs
  galleries: string[] // gallery event or client names, falling back to galleryId
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Every post and gallery that shows this photo. A post counts when the photo is
 * its hero (by library id, or by URL for the older id-less shape), is listed in
 * `photoIds`, or appears in the body: the editor inserts single photos and
 * carousels by `originalUrl`.
 */
export async function findPhotoReferences(
  db: Db,
  photo: { _id: { toString(): string }; cloudinaryId?: string; originalUrl?: string },
): Promise<PhotoReferences> {
  const id = photo._id.toString()

  const postMatch: Filter<Document>[] = [{ 'featuredImage.id': id }, { photoIds: id }]
  if (photo.originalUrl) {
    postMatch.push({ 'featuredImage.url': photo.originalUrl })
    postMatch.push({ content: { $regex: escapeRegex(photo.originalUrl) } })
  }
  const galleryMatch: Filter<Document>[] = [{ 'photos.id': id }]
  if (photo.cloudinaryId) galleryMatch.push({ 'photos.cloudinaryId': photo.cloudinaryId })

  const [posts, galleries] = await Promise.all([
    db.collection(COLLECTIONS.blogPosts).find({ $or: postMatch }, { projection: { slug: 1 } }).toArray(),
    db
      .collection(COLLECTIONS.clientGalleries)
      .find({ $or: galleryMatch }, { projection: { galleryId: 1, eventName: 1, clientName: 1 } })
      .toArray(),
  ])

  return {
    blogs: posts.map(p => String(p.slug)),
    galleries: galleries.map(g => String(g.eventName || g.clientName || g.galleryId)),
  }
}

/** One sentence for the admin when a delete is refused. */
export function describeReferences(refs: PhotoReferences): string {
  const parts: string[] = []
  if (refs.blogs.length > 0) {
    parts.push(`${refs.blogs.length} blog post${refs.blogs.length === 1 ? '' : 's'} (${refs.blogs.join(', ')})`)
  }
  if (refs.galleries.length > 0) {
    parts.push(
      `${refs.galleries.length} galler${refs.galleries.length === 1 ? 'y' : 'ies'} (${refs.galleries.join(', ')})`,
    )
  }
  return `This photo is still used in ${parts.join(' and ')}. Remove it there first.`
}

/** True when a library photo owns this Cloudinary file. */
export async function isLibraryAsset(db: Db, cloudinaryId: string): Promise<boolean> {
  const hit = await db
    .collection<StoredPhoto>(COLLECTIONS.photos)
    .findOne({ cloudinaryId }, { projection: { _id: 1 } })
  return hit !== null
}

/**
 * Library photos whose Cloudinary file sits under this prefix. Some were made
 * from gallery uploads and still live in that gallery's folder, so purging the
 * folder would destroy them. Matches the prefix exactly as the purge would.
 */
export async function libraryFilesUnder(db: Db, prefix: string): Promise<Set<string>> {
  const rows = await db
    .collection<StoredPhoto>(COLLECTIONS.photos)
    .find({ cloudinaryId: { $regex: `^${escapeRegex(prefix)}` } }, { projection: { cloudinaryId: 1 } })
    .toArray()
  return new Set(rows.map(r => r.cloudinaryId).filter((id): id is string => typeof id === 'string'))
}

/**
 * Drop a gallery from library photos' `usedIn.galleries`: one photo (by its
 * Cloudinary file) when it is removed from the gallery, or all of them when the
 * gallery is deleted.
 */
export async function releaseGalleryReference(db: Db, galleryId: string, cloudinaryId?: string): Promise<void> {
  await db.collection<StoredPhoto>(COLLECTIONS.photos).updateMany(
    cloudinaryId ? { cloudinaryId, 'usedIn.galleries': galleryId } : { 'usedIn.galleries': galleryId },
    { $pull: { 'usedIn.galleries': galleryId }, $set: { updatedAt: new Date() } },
  )
}

async function loadLibraryRefs(db: Db): Promise<LibraryPhotoRef[]> {
  const rows = await db
    .collection<StoredPhoto>(COLLECTIONS.photos)
    .find({}, { projection: { _id: 1, originalUrl: 1, cloudinaryId: 1 } })
    .toArray()
  return rows.map(r => ({ id: r._id.toString(), originalUrl: r.originalUrl, cloudinaryId: r.cloudinaryId }))
}

// The post is already saved and the delete guard checks live, so a failed
// cache write only leaves a library card's count stale until the next recount.
// Log the error class only: driver errors can echo the filter.
function logUsageFailure(err: unknown): void {
  console.error('photo usage update failed:', err instanceof Error ? err.name : 'unknown')
}

/**
 * Point `usedIn.blogs` at exactly the photos this post now shows: add its slug
 * to those, pull it from every other photo, and drop `previousSlug` after a
 * rename. Self-healing, so a stale entry is fixed by the post's next save.
 * Never throws.
 */
export async function recordPostPhotoUsage(
  db: Db,
  post: PhotoReferencingPost & { slug?: unknown },
  previousSlug?: string,
): Promise<void> {
  const slug = post.slug
  if (typeof slug !== 'string' || slug.length === 0) return
  try {
    const photos = db.collection<StoredPhoto>(COLLECTIONS.photos)
    const ids = libraryPhotoIdsInPost(post, await loadLibraryRefs(db))
    const objectIds = ids.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id))
    const now = new Date()

    if (objectIds.length > 0) {
      await photos.updateMany(
        { _id: { $in: objectIds } },
        { $addToSet: { 'usedIn.blogs': slug }, $set: { updatedAt: now } },
      )
    }
    await photos.updateMany(
      { 'usedIn.blogs': slug, _id: { $nin: objectIds } },
      { $pull: { 'usedIn.blogs': slug }, $set: { updatedAt: now } },
    )
    if (previousSlug && previousSlug !== slug) {
      await photos.updateMany(
        { 'usedIn.blogs': previousSlug },
        { $pull: { 'usedIn.blogs': previousSlug }, $set: { updatedAt: now } },
      )
    }
  } catch (err) {
    logUsageFailure(err)
  }
}

/** Drop a deleted post from every photo that lists it. Never throws. */
export async function releasePostPhotoUsage(db: Db, slug: string): Promise<void> {
  if (!slug) return
  try {
    await db.collection<StoredPhoto>(COLLECTIONS.photos).updateMany(
      { 'usedIn.blogs': slug },
      { $pull: { 'usedIn.blogs': slug }, $set: { updatedAt: new Date() } },
    )
  } catch (err) {
    logUsageFailure(err)
  }
}

export interface UsageRecount {
  photos: number // library photos checked
  changed: number // photos whose cached usage was wrong (and, unless dry, was rewritten)
  blogLinks: number // photo-to-post links found
  galleryLinks: number // photo-to-gallery links found
}

function sameMembers(stored: unknown, next: string[]): boolean {
  return Array.isArray(stored) && stored.length === next.length && next.every(v => stored.includes(v))
}

/**
 * Rebuild every library photo's `usedIn.blogs` and `usedIn.galleries` from the
 * posts and galleries themselves; `usedIn.portfolio` is left alone. Writes only
 * the photos whose cache is wrong, and none at all when `dry`. Safe to rerun.
 */
export async function rebuildPhotoUsage(db: Db, { dry = false }: { dry?: boolean } = {}): Promise<UsageRecount> {
  const photos = db.collection<StoredPhoto>(COLLECTIONS.photos)
  const [stored, posts, galleries] = await Promise.all([
    photos.find({}, { projection: { _id: 1, originalUrl: 1, cloudinaryId: 1, usedIn: 1 } }).toArray(),
    db
      .collection<PhotoReferencingPost & { slug?: unknown }>(COLLECTIONS.blogPosts)
      .find({}, { projection: { slug: 1, featuredImage: 1, photoIds: 1, content: 1 } })
      .toArray(),
    db
      .collection(COLLECTIONS.clientGalleries)
      .find({}, { projection: { galleryId: 1, 'photos.id': 1, 'photos.cloudinaryId': 1 } })
      .toArray(),
  ])

  const library = stored.map(p => ({ id: p._id.toString(), originalUrl: p.originalUrl, cloudinaryId: p.cloudinaryId }))
  const usage = computePhotoUsage(
    library,
    posts,
    galleries.map(g => ({ galleryId: String(g.galleryId), photos: g.photos })),
  )

  const now = new Date()
  const writes: AnyBulkWriteOperation<StoredPhoto>[] = []
  let blogLinks = 0
  let galleryLinks = 0
  for (const photo of stored) {
    const next = usage.get(photo._id.toString()) ?? { blogs: [], galleries: [] }
    blogLinks += next.blogs.length
    galleryLinks += next.galleries.length
    if (sameMembers(photo.usedIn?.blogs, next.blogs) && sameMembers(photo.usedIn?.galleries, next.galleries)) continue
    // A photo saved before usedIn existed (or with it null) gets the whole object.
    const update =
      photo.usedIn && typeof photo.usedIn === 'object'
        ? { 'usedIn.blogs': next.blogs, 'usedIn.galleries': next.galleries, updatedAt: now }
        : { usedIn: { blogs: next.blogs, galleries: next.galleries, portfolio: false }, updatedAt: now }
    writes.push({ updateOne: { filter: { _id: photo._id }, update: { $set: update } } })
  }

  if (!dry && writes.length > 0) await photos.bulkWrite(writes)
  return { photos: stored.length, changed: writes.length, blogLinks, galleryLinks }
}
