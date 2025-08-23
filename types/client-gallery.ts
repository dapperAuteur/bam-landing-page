export interface ClientGallery {
  _id?: string
  galleryId: string // URL-safe unique identifier
  clientName: string
  clientEmail: string
  eventName: string
  eventDate: string
  description?: string
  photos: ClientPhoto[]
  settings: GallerySettings
  accessCode?: string // Optional password protection
  expiresAt?: Date // Optional expiration
  createdAt: Date
  updatedAt: Date
}

export interface ClientPhoto {
  id: string
  cloudinaryId?: string
  originalUrl: string
  thumbnailUrl: string
  title?: string
  description?: string
  isFavorite?: boolean
  comments?: Array<{
    text: string;
    timestamp: Date;
    author?: string }>
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number }
  uploadedAt: Date | string
}

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