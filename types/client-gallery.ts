export type MediaType = 'image' | 'video' | 'document'

export interface ClientGallery {
  _id?: string
  galleryId: string // URL-safe unique identifier
  // 'client' = private delivery/approval gallery; 'marketing' = public showcase
  // for prospective clients (listed at /galleries, no access code).
  type?: 'client' | 'marketing'
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
  // Client approval workflow (when settings.allowApprovals is on)
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  approvedAt?: Date | string
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
  allowApprovals?: boolean // Let the client approve/reject each photo
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