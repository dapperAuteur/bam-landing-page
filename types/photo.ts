// Central photo library. Photos live in the `photos` collection and can be
// reused across client galleries, the blog (featuredImage / photoIds), and the
// public portfolio. (Client-delivery galleries currently embed their own media
// via types/client-gallery.ts; the central library is the reuse layer.)
export type PhotoCategory = 'sports' | 'events' | 'portraits' | 'products' | 'other'

export interface Photo {
  id: string
  cloudinaryId: string
  originalUrl: string
  thumbnailUrl: string
  title?: string
  description?: string
  alt?: string
  tags: string[]
  category: PhotoCategory
  metadata: {
    width: number
    height: number
    format: string
    size: number
  }
  // Where this photo is referenced (for safe deletes / reuse tracking)
  usedIn: {
    galleries: string[]
    blogs: string[]
    portfolio: boolean
  }
  uploadedAt: Date | string
  updatedAt: Date | string
}
