// src/types/photo.ts
export interface Photo {
  id: string
  cloudinaryId: string
  originalUrl: string
  thumbnailUrl: string
  title?: string
  description?: string
  tags: string[] // ['client', 'portfolio', 'blog', 'wedding', 'sports']
  category: 'sports' | 'events' | 'portraits' | 'products' | 'other'
  metadata: {
    width: number
    height: number
    format: string
    size: number
  }
  usedIn: {
    galleries: string[]
    blogs: string[]
    portfolio: boolean
  }
  // Client interaction data (only relevant for client galleries)
  clientData?: {
    likes: number
    isFavorite: boolean
    comments: Array<{
      id: string
      text: string
      timestamp: Date | string
    }>
  }
  uploadedAt: Date
  updatedAt: Date
}

// Updated Gallery interface (simplified)
export interface Gallery {
  galleryId: string
  clientName: string
  clientEmail: string
  eventName: string
  eventDate: string
  description?: string
  photoIds: string[] // References to photos collection
  settings: GallerySettings
  accessCode?: string
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface GallerySettings {
  allowDownloads: boolean
  allowFullSize: boolean
  allowSocialSharing: boolean
  requirePassword: boolean
  showMetadata: boolean
  layout: 'grid' | 'masonry' | 'slideshow'
}

// For populated gallery responses
export interface PopulatedGallery extends Omit<Gallery, 'photoIds'> {
  photos: Photo[]
}