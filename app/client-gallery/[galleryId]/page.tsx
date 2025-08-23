// app/client-gallery/[galleryId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ClientPhoto {
  id: string
  cloudinaryId?: string
  originalUrl: string
  thumbnailUrl: string
  title?: string
  description?: string
  likes?: number
  isFavorite?: boolean
  comments?: Array<{
    id: string
    text: string
    timestamp: Date | string
  }>
  metadata?: {
    width: number
    height: number
    format: string
    size: number
  }
  uploadedAt: Date | string
}

interface GallerySettings {
  allowDownloads: boolean
  allowFullSize: boolean
  allowSocialSharing: boolean
  requirePassword: boolean
  showMetadata: boolean
  layout: 'grid' | 'masonry' | 'slideshow'
}

interface ClientGallery {
  galleryId: string
  clientName: string
  eventName: string
  eventDate: string
  description?: string
  photos: ClientPhoto[]
  settings: GallerySettings
}

interface ClientGalleryPageProps {
  params: { galleryId: string }
}

export default function ClientGalleryPage({ params }: ClientGalleryPageProps) {
  const [gallery, setGallery] = useState<ClientGallery | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accessCode, setAccessCode] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<ClientPhoto | null>(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [downloadingAll, setDownloadingAll] = useState(false)

  useEffect(() => {
    fetchGallery()
  }, [params.galleryId])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('[CLIENT-GALLERY] Fetching gallery:', params.galleryId)
      
      const response = await fetch(`/api/client-gallery/${params.galleryId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Gallery not found or expired')
        } else if (response.status === 410) {
          setError('Gallery has expired')
        } else {
          setError('Failed to load gallery')
        }
        return
      }
      
      const data = await response.json()
      console.log('[CLIENT-GALLERY] Gallery data received:', {
        galleryId: data.gallery.galleryId,
        requirePassword: data.gallery.settings?.requirePassword,
        photosCount: data.gallery.photos?.length || 0
      })
      
      setGallery(data.gallery)
      
      // If password not required, mark as authenticated
      if (!data.gallery.settings?.requirePassword) {
        setAuthenticated(true)
      }
    } catch (err) {
      console.error('[CLIENT-GALLERY] Fetch error:', err)
      setError('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!accessCode.trim()) return

    try {
      setAuthLoading(true)
      setError(null)
      
      console.log('[CLIENT-GALLERY] Attempting authentication for:', params.galleryId)
      
      const response = await fetch(`/api/client-gallery/${params.galleryId}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.trim() })
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('[CLIENT-GALLERY] Authentication response:', data)
        
        if (!data.gallery) {
          console.error('[CLIENT-GALLERY] Invalid response structure:', data)
          setError('Invalid server response. Please try again.')
          return
        }
        
        console.log('[CLIENT-GALLERY] Authentication successful, photos count:', data.gallery.photos?.length || 0)
        
        setGallery(data.gallery)
        setAuthenticated(true)
        setAccessCode('')
      } else {
        const errorData = await response.json()
        console.log('[CLIENT-GALLERY] Authentication failed:', errorData)
        setError(errorData.error || 'Invalid access code')
        setAccessCode('')
      }
    } catch (err) {
      console.error('[CLIENT-GALLERY] Authentication error:', err)
      setError('Authentication failed. Please try again.')
      setAccessCode('')
    } finally {
      setAuthLoading(false)
    }
  }

  // FIXED: Download single photo
  const handleDownload = async (photo: ClientPhoto) => {
    if (!gallery?.settings.allowDownloads) {
      console.log('[CLIENT-GALLERY] Downloads not allowed')
      return
    }
    
    try {
      console.log('[CLIENT-GALLERY] Downloading photo:', photo.id)
      
      const photoId = photo.cloudinaryId || photo.id
      const response = await fetch(`/api/client-gallery/${params.galleryId}/download/${encodeURIComponent(photoId)}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${gallery.eventName}-${photo.title || photo.id}.jpg`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        console.log('[CLIENT-GALLERY] Photo downloaded successfully')
      } else {
        console.error('[CLIENT-GALLERY] Download failed:', response.status)
        setError('Download failed. Please try again.')
      }
    } catch (err) {
      console.error('[CLIENT-GALLERY] Download error:', err)
      setError('Download failed. Please try again.')
    }
  }

  // NEW: Download all photos
  const downloadAll = async () => {
    if (!gallery?.settings.allowDownloads || !gallery.photos?.length) return
    
    setDownloadingAll(true)
    try {
      for (const photo of gallery.photos) {
        await handleDownload(photo)
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (err) {
      console.error('[CLIENT-GALLERY] Download all error:', err)
      setError('Failed to download all photos')
    } finally {
      setDownloadingAll(false)
    }
  }

  // NEW: Toggle favorite
  const toggleFavorite = async (photoId: string) => {
    try {
      const response = await fetch(`/api/admin/galleries/${params.galleryId}/photos/${photoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' })
      })
      
      if (response.ok) {
        // Update local state
        setGallery(prev => {
          if (!prev) return prev
          return {
            ...prev,
            photos: prev.photos.map(photo => 
              photo.id === photoId 
                ? { ...photo, likes: (photo.likes || 0) + 1, isFavorite: !photo.isFavorite }
                : photo
            )
          }
        })
      }
    } catch (err) {
      console.error('[CLIENT-GALLERY] Like error:', err)
    }
  }

  // NEW: Add comment
  const addComment = async (photoId: string) => {
    if (!newComment.trim()) return
    
    try {
      const response = await fetch(`/api/admin/galleries/${params.galleryId}/photos/${photoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'comment', comment: newComment.trim() })
      })
      
      if (response.ok) {
        // Update local state
        const newCommentObj = {
          id: Date.now().toString(),
          text: newComment.trim(),
          timestamp: new Date()
        }
        
        setGallery(prev => {
          if (!prev) return prev
          return {
            ...prev,
            photos: prev.photos.map(photo => 
              photo.id === photoId 
                ? { ...photo, comments: [...(photo.comments || []), newCommentObj] }
                : photo
            )
          }
        })
        
        setNewComment('')
        setShowComments(null)
      }
    } catch (err) {
      console.error('[CLIENT-GALLERY] Comment error:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your photos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => {
              setError(null)
              fetchGallery()
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!gallery) return null

  // Show password prompt if required and not authenticated
  if (gallery.settings.requirePassword && !authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Access Protected Gallery</h1>
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800">{gallery.eventName}</h2>
            <p className="text-gray-600">{gallery.clientName}</p>
          </div>
          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter access code"
                required
                disabled={authLoading}
              />
            </div>
            <button
              type="submit"
              disabled={authLoading || !accessCode.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {authLoading ? 'Verifying...' : 'Access Gallery'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{gallery.eventName}</h1>
          <p className="text-gray-600 mt-2">
            {new Date(gallery.eventDate).toLocaleDateString()} • {gallery.photos?.length || 0} photos
          </p>
          {gallery.description && (
            <p className="text-gray-700 mt-2">{gallery.description}</p>
          )}
          
          {/* Download Actions */}
          {gallery.settings.allowDownloads && (
            <div className="flex gap-4 mt-4">
              <p className="text-sm text-blue-600">
                📥 Downloads are enabled for this gallery
              </p>
              {gallery.photos?.length > 0 && (
                <button
                  onClick={downloadAll}
                  disabled={downloadingAll}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {downloadingAll ? 'Downloading...' : 'Download All Photos'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!gallery.photos || gallery.photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No photos have been uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={photo.thumbnailUrl}
                  alt={photo.title || 'Photo'}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(photo.id)
                    }}
                    className="bg-white/80 hover:bg-white p-2 rounded-full"
                    title={photo.isFavorite ? 'Unlike' : 'Like'}
                  >
                    {photo.isFavorite ? '❤️' : '🤍'}
                  </button>
                  
                  {gallery.settings.allowDownloads && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(photo)
                      }}
                      className="bg-white/80 hover:bg-white p-2 rounded-full"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Photo stats */}
                <div className="absolute bottom-2 left-2 flex gap-2 text-white text-sm">
                  {photo.likes && photo.likes > 0 && (
                    <span className="bg-black/50 px-2 py-1 rounded">❤️ {photo.likes}</span>
                  )}
                  {photo.comments && photo.comments.length > 0 && (
                    <span className="bg-black/50 px-2 py-1 rounded">💬 {photo.comments.length}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedPhoto.originalUrl}
              alt={selectedPhoto.title || 'Photo'}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Action buttons */}
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={() => toggleFavorite(selectedPhoto.id)}
                className="bg-black/50 text-white px-3 py-2 rounded-md hover:bg-black/70"
              >
                {selectedPhoto.isFavorite ? '❤️' : '🤍'} {selectedPhoto.likes || 0}
              </button>
              
              <button
                onClick={() => setShowComments(showComments === selectedPhoto.id ? null : selectedPhoto.id)}
                className="bg-black/50 text-white px-3 py-2 rounded-md hover:bg-black/70"
              >
                💬 {selectedPhoto.comments?.length || 0}
              </button>
            </div>

            {/* Download button */}
            {gallery.settings.allowDownloads && (
              <button
                onClick={() => handleDownload(selectedPhoto)}
                className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            )}

            {/* Photo title/description */}
            {selectedPhoto.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                <h3 className="text-lg font-bold">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="text-sm text-gray-200">{selectedPhoto.description}</p>
                )}
              </div>
            )}

            {/* Comments section */}
            {showComments === selectedPhoto.id && (
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-4 max-w-md max-h-60 overflow-y-auto">
                <h4 className="font-bold mb-2">Comments</h4>
                
                {selectedPhoto.comments?.map((comment) => (
                  <div key={comment.id} className="mb-2 p-2 bg-gray-100 rounded">
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 text-sm border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => addComment(selectedPhoto.id)}
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}