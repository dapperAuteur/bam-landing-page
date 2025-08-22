'use client'

import { useState, useEffect } from 'react'
import { ClientGallery, ClientPhoto, GalleryAccess } from '../../../types/client-gallery'
import Image from 'next/image'

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
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchGallery()
  }, [params.galleryId])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/client-gallery/${params.galleryId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Gallery not found or expired')
        } else if (response.status === 401) {
          setError('Access code required')
        } else {
          setError('Failed to load gallery')
        }
        return
      }
      
      const data = await response.json()
      setGallery(data.gallery)
      setAuthenticated(!data.gallery.settings.requirePassword)
    } catch (err) {
      setError('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/client-gallery/${params.galleryId}/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode })
      })
      
      if (response.ok) {
        setAuthenticated(true)
        fetchGallery()
      } else {
        setError('Invalid access code')
      }
    } catch (err) {
      setError('Authentication failed')
    }
  }

  const handleDownload = async (photo: ClientPhoto) => {
    if (!gallery?.settings.allowDownloads) return
    
    try {
      const response = await fetch(`/api/client-gallery/${params.galleryId}/download/${photo.id}`, {
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
        
        // Update download count
        setDownloadCounts(prev => ({
          ...prev,
          [photo.id]: (prev[photo.id] || 0) + 1
        }))
      } else {
        setError('Download failed')
      }
    } catch (err) {
      setError('Download failed')
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
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!authenticated && gallery?.settings.requirePassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Access Protected Gallery</h1>
          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter access code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Access Gallery
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (!gallery) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{gallery.eventName}</h1>
          <p className="text-gray-600 mt-2">
            {new Date(gallery.eventDate).toLocaleDateString()} • {gallery.photos.length} photos
          </p>
          {gallery.description && (
            <p className="text-gray-700 mt-2">{gallery.description}</p>
          )}
          {gallery.settings.allowDownloads && (
            <p className="text-sm text-blue-600 mt-2">
              📥 Downloads are enabled for this gallery
            </p>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.title || 'Photo'}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              {gallery.settings.allowDownloads && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(photo)
                  }}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
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
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {gallery.settings.allowDownloads && (
              <button
                onClick={() => handleDownload(selectedPhoto)}
                className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download
              </button>
            )}
            {selectedPhoto.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                <h3 className="text-lg font-bold">{selectedPhoto.title}</h3>
                {selectedPhoto.description && (
                  <p className="text-sm text-gray-200">{selectedPhoto.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}