// What still uses a library photo, read from the posts and galleries themselves.
//
// The photo's own `usedIn` field is a cache, and its blog half was never
// written, so the delete paths must not trust it. A photo added "from library"
// to a gallery shares the library's Cloudinary file, so destroying that file
// breaks every post, gallery and /photography card that shows it.

import type { Db, Filter, Document } from 'mongodb'
import { COLLECTIONS } from '@/lib/db/collections'

/** The photos collection as stored, limited to the fields used here. */
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
