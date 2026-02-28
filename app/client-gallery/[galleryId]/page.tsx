// app/client-gallery/[galleryId]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import type { ClientGallery, ClientMedia, MediaType } from '@/types/client-gallery'
import AccessCodeForm from '@/components/client-gallery/AccessCodeForm'
import GalleryHeader from '@/components/client-gallery/GalleryHeader'
import MediaFilter from '@/components/client-gallery/MediaFilter'
import MediaCard from '@/components/client-gallery/MediaCard'
import Lightbox from '@/components/client-gallery/Lightbox'

interface ClientGalleryPageProps {
  params: { galleryId: string }
}

export default function ClientGalleryPage({ params }: ClientGalleryPageProps) {
  const [gallery, setGallery] = useState<ClientGallery | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ClientMedia | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all'>('all')

  useEffect(() => {
    fetchGallery()
  }, [params.galleryId])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/client-gallery/${params.galleryId}`)

      if (!response.ok) {
        if (response.status === 404) setError('Gallery not found or expired')
        else if (response.status === 410) setError('Gallery has expired')
        else setError('Failed to load gallery')
        return
      }

      const data = await response.json()
      setGallery(data.gallery)

      if (!data.gallery.settings?.requirePassword) {
        setAuthenticated(true)
      }
    } catch {
      setError('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleAuthenticate = async (code: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/client-gallery/${params.galleryId}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code })
      })

      if (response.ok) {
        const data = await response.json()
        if (!data.gallery) return false
        setGallery(data.gallery)
        setAuthenticated(true)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const handleDownload = async (item: ClientMedia) => {
    if (!gallery?.settings.allowDownloads) return

    try {
      const mediaId = item.cloudinaryId || item.id
      const response = await fetch(`/api/client-gallery/${params.galleryId}/download/${encodeURIComponent(mediaId)}`, {
        method: 'POST'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const ext = item.metadata?.format || item.mimeType?.split('/').pop() || 'jpg'
        a.download = `${gallery.eventName}-${item.title || item.id}.${ext}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError('Download failed. Please try again.')
      }
    } catch {
      setError('Download failed. Please try again.')
    }
  }

  const downloadAll = async () => {
    if (!gallery?.settings.allowDownloads || !gallery.photos?.length) return

    setDownloadingAll(true)
    try {
      for (const item of gallery.photos) {
        await handleDownload(item)
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch {
      setError('Failed to download all files')
    } finally {
      setDownloadingAll(false)
    }
  }

  const toggleFavorite = async (itemId: string) => {
    try {
      const response = await fetch(`/api/admin/galleries/${params.galleryId}/photos/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' })
      })

      if (response.ok) {
        setGallery(prev => {
          if (!prev) return prev
          const updatedPhotos = prev.photos.map(p =>
            p.id === itemId
              ? { ...p, likes: (p.likes || 0) + 1, isFavorite: !p.isFavorite }
              : p
          )
          return { ...prev, photos: updatedPhotos }
        })
        // Also update selected item if it's the one being liked
        setSelectedItem(prev => {
          if (!prev || prev.id !== itemId) return prev
          return { ...prev, likes: (prev.likes || 0) + 1, isFavorite: !prev.isFavorite }
        })
      }
    } catch {
      // Silently fail for likes
    }
  }

  const addComment = async (itemId: string, text: string) => {
    try {
      const response = await fetch(`/api/admin/galleries/${params.galleryId}/photos/${itemId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'comment', comment: text })
      })

      if (response.ok) {
        const newComment = { id: Date.now().toString(), text, timestamp: new Date() }
        setGallery(prev => {
          if (!prev) return prev
          return {
            ...prev,
            photos: prev.photos.map(p =>
              p.id === itemId
                ? { ...p, comments: [...(p.comments || []), newComment] }
                : p
            )
          }
        })
        setSelectedItem(prev => {
          if (!prev || prev.id !== itemId) return prev
          return { ...prev, comments: [...(prev.comments || []), newComment] }
        })
      }
    } catch {
      // Silently fail for comments
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" role="status">
            <span className="sr-only">Loading</span>
          </div>
          <p className="mt-4 text-gray-600">Loading your gallery...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4" role="alert">{error}</p>
          <button
            onClick={() => { setError(null); fetchGallery() }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!gallery) return null

  // Password protection
  if (gallery.settings.requirePassword && !authenticated) {
    return (
      <AccessCodeForm
        eventName={gallery.eventName}
        clientName={gallery.clientName}
        onAuthenticate={handleAuthenticate}
      />
    )
  }

  // Filter media
  const filteredMedia = activeFilter === 'all'
    ? gallery.photos
    : gallery.photos.filter(p => (p.mediaType || 'image') === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50">
      <GalleryHeader
        gallery={gallery}
        downloadingAll={downloadingAll}
        onDownloadAll={downloadAll}
      />

      {/* Error toast */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex justify-between items-center" role="alert">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700" aria-label="Dismiss">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MediaFilter
          media={gallery.photos}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {!filteredMedia || filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No content has been uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                allowDownloads={gallery.settings.allowDownloads}
                onSelect={setSelectedItem}
                onDownload={handleDownload}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          allowDownloads={gallery.settings.allowDownloads}
          onClose={() => setSelectedItem(null)}
          onDownload={handleDownload}
          onToggleFavorite={toggleFavorite}
          onAddComment={addComment}
        />
      )}
    </div>
  )
}
