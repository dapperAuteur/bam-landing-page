export type MediaType = 'image' | 'video' | 'document'

export interface ClientGallery {
  _id?: string
  galleryId: string // URL-safe unique identifier
  clientName: string
  clientEmail: string
  eventName: string
  eventDate: string
  description?: string
  photos: ClientMedia[] // Backward-compatible field name
  settings: GallerySettings
  accessCode?: string // Optional password protection
  expiresAt?: Date // Optional expiration
  createdAt: Date
  updatedAt: Date
}

export interface ClientMedia {
  id: string
  cloudinaryId?: string
  originalUrl: string
  thumbnailUrl: string
  title?: string
  description?: string
  mediaType?: MediaType // Defaults to 'image' for backward compat
  resourceType?: string // Cloudinary resource_type: 'image' | 'video' | 'raw'
  mimeType?: string // e.g. 'application/pdf', 'video/mp4'
  isFavorite?: boolean
  likes?: number
  comments?: Array<{
    id?: string
    text: string
    timestamp: Date
    author?: string
  }>
  metadata?: {
    width?: number
    height?: number
    format: string
    size: number
    duration?: number // Video duration in seconds
    pages?: number // Document page count
  }
  uploadedAt: Date | string
}

/** @deprecated Use ClientMedia instead */
export type ClientPhoto = ClientMedia

export interface GallerySettings {
  allowDownloads: boolean
  allowFullSize: boolean // vs watermarked/smaller versions
  allowSocialSharing: boolean
  requirePassword: boolean
  showMetadata: boolean
  layout: 'grid' | 'masonry' | 'slideshow'
  downloadsPerSession?: number // Rate limiting
}

export interface GalleryAccess {
  _id?: string
  galleryId: string
  clientEmail: string
  accessedAt: Date
  ipAddress: string
  userAgent: string
  downloadsCount: number
  lastDownloadAt?: Date
}

// For admin management
export interface GalleryStats {
  totalViews: number
  totalDownloads: number
  lastAccessed?: Date
  photosCount: number
  isExpired: boolean
}