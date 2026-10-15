// Photo-usage rules for the central photo library. Pure and import-safe (no
// mongodb import), so the admin library page can use `describePhotoUsage` in
// the browser; the database half lives in `lib/photos/references.ts`.
//
// `types/photo.ts` promises that a Photo records where it is referenced, and
// the gallery route has always kept `usedIn.galleries` current. The blog half
// was never written. These rules decide which library photos a post shows, so
// `usedIn.blogs` can be kept and rebuilt.
//
// Values stored in `usedIn.blogs` are post SLUGS, not ids, so the admin UI can
// name the posts without a second lookup.

/**
 * The parts of a blog post that can show library photos. The index signature
 * lets a raw Mongo document be passed as-is (an all-optional interface would
 * otherwise reject it as sharing no properties).
 */
export interface PhotoReferencingPost {
  featuredImage?: unknown
  photoIds?: unknown
  content?: unknown
  [field: string]: unknown
}

/** A library photo, reduced to what identifies it inside a post or gallery. */
export interface LibraryPhotoRef {
  id: string
  originalUrl?: string
  cloudinaryId?: string
}

/** A gallery, reduced to the embedded media that can point at the library. */
export interface GalleryRef {
  galleryId: string
  photos?: unknown
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
 * Every library photo id a post names directly, deduped, in first-seen order.
 *
 * Deliberately defensive about shape. Posts predate the library in three ways
 * that all still exist in the collection, and none of them may throw here:
 *   - no `featuredImage` at all (the majority of older posts),
 *   - a `featuredImage` that is a bare URL string from before it became an
 *     object, or an object holding only `url`/`alt` with no library `id`,
 *   - no `photoIds` array.
 * All three simply contribute nothing here; `libraryPhotoIdsInPost` catches
 * the URL-only shapes.
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

function featuredUrl(featured: unknown): string | null {
  if (isNonEmptyString(featured)) return featured
  if (featured && typeof featured === 'object' && 'url' in featured) {
    const url = (featured as { url?: unknown }).url
    if (isNonEmptyString(url)) return url
  }
  return null
}

/**
 * Every library photo a post shows: the ids it names, plus any library photo
 * whose `originalUrl` is its hero URL or appears in its body. The editor
 * inserts single photos and carousels by `originalUrl` and never fills
 * `photoIds`, so the body match is what finds inline photos.
 *
 * Same rules as the live check in `findPhotoReferences`, so the cached count
 * and the delete guard agree.
 */
export function libraryPhotoIdsInPost(
  post: PhotoReferencingPost | null | undefined,
  library: LibraryPhotoRef[],
): string[] {
  if (!post) return []
  const ids = photoIdsForPost(post)
  const hero = featuredUrl(post.featuredImage)
  const content = typeof post.content === 'string' ? post.content : ''

  for (const photo of library) {
    if (!isNonEmptyString(photo.originalUrl)) continue
    if (photo.originalUrl === hero || content.includes(photo.originalUrl)) ids.push(photo.id)
  }

  return Array.from(new Set(ids))
}

/** True when a gallery's embedded media includes this library photo. */
function galleryHasPhoto(gallery: GalleryRef, photo: LibraryPhotoRef): boolean {
  if (!Array.isArray(gallery.photos)) return false
  return gallery.photos.some(item => {
    if (!item || typeof item !== 'object') return false
    const { id, cloudinaryId } = item as { id?: unknown; cloudinaryId?: unknown }
    return id === photo.id || (isNonEmptyString(photo.cloudinaryId) && cloudinaryId === photo.cloudinaryId)
  })
}

/**
 * Recompute `usedIn.blogs` and `usedIn.galleries` for every library photo from
 * the posts and galleries themselves. Keyed by photo id; every photo gets an
 * entry, so a photo nothing uses comes back with two empty lists.
 */
export function computePhotoUsage(
  library: LibraryPhotoRef[],
  posts: (PhotoReferencingPost & { slug?: unknown })[],
  galleries: GalleryRef[],
): Map<string, { blogs: string[]; galleries: string[] }> {
  const usage = new Map<string, { blogs: string[]; galleries: string[] }>()
  for (const photo of library) usage.set(photo.id, { blogs: [], galleries: [] })

  for (const post of posts) {
    if (!isNonEmptyString(post.slug)) continue
    for (const id of libraryPhotoIdsInPost(post, library)) usage.get(id)?.blogs.push(post.slug)
  }

  for (const photo of library) {
    const entry = usage.get(photo.id)!
    for (const gallery of galleries) {
      if (galleryHasPhoto(gallery, photo)) entry.galleries.push(gallery.galleryId)
    }
  }

  return usage
}

/**
 * Human-readable answer to "is anything using this photo?", for the admin
 * library card. Counts galleries and posts separately because they break
 * differently: a gallery is private to one client, a blog post is public.
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
 * A photo as the public API returns it. `usedIn` names draft post slugs (some
 * held back on purpose) and private client gallery ids, so only the portfolio
 * flag survives for anyone who is not an admin.
 */
export function redactPhotoUsage<T extends object>(photo: T): Omit<T, 'usedIn'> & { usedIn: { portfolio: boolean } } {
  const usedIn = (photo as { usedIn?: PhotoUsage | null }).usedIn
  return { ...photo, usedIn: { portfolio: usedIn?.portfolio === true } }
}

/**
 * The Cloudinary files a gallery delete may destroy: its media under its own
 * folder, minus any a library photo owns. Library photos made from a gallery
 * upload keep their file in that gallery's folder, and media added "from
 * library" points outside it; neither may be deleted with the gallery.
 */
export function galleryFilesToDelete(photos: unknown, folder: string, libraryOwned: Set<string>): string[] {
  if (!Array.isArray(photos)) return []
  const files = photos
    .map(item => (item && typeof item === 'object' ? (item as { cloudinaryId?: unknown }).cloudinaryId : undefined))
    .filter(isNonEmptyString)
    .filter(id => id.startsWith(`${folder}/`) && !libraryOwned.has(id))
  return Array.from(new Set(files))
}
