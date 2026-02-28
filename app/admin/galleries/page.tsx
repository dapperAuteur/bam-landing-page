// src/app/admin/galleries/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ClientGallery, ClientMedia, GallerySettings } from '../../../types/client-gallery'

function getMediaSummary(photos: ClientMedia[]): string {
  if (!photos || photos.length === 0) return '0 items'
  const images = photos.filter(p => !p.mediaType || p.mediaType === 'image').length
  const videos = photos.filter(p => p.mediaType === 'video').length
  const docs = photos.filter(p => p.mediaType === 'document').length
  const parts: string[] = []
  if (images > 0) parts.push(`${images} photo${images !== 1 ? 's' : ''}`)
  if (videos > 0) parts.push(`${videos} video${videos !== 1 ? 's' : ''}`)
  if (docs > 0) parts.push(`${docs} doc${docs !== 1 ? 's' : ''}`)
  return parts.join(', ')
}

export default function AdminGalleriesPage() {
  const [galleries, setGalleries] = useState<ClientGallery[]>([])
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGallery, setEditingGallery] = useState<ClientGallery | null>(null)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const handlePhotoUpload = async (galleryId: string, files: FileList) => {
    setUploadingPhotos(true)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('photos', file))
    
    try {
      const response = await fetch(`/api/admin/galleries/${galleryId}/photos`, {
        method: 'POST',
        body: formData
      })
      if (response.ok) fetchGalleries()
    } finally {
      setUploadingPhotos(false)
    }
  }

  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/admin/galleries')
      const data = await response.json()
      setGalleries(data.galleries)
    } catch (error) {
      console.error('Failed to fetch galleries:', error)
    } finally {
      setLoading(false)
    }
  }

  // FIXED: handleDeletePhoto now properly receives both galleryId and photoId
  const handleDeletePhoto = async (galleryId: string, photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return
    
    try {
      const response = await fetch(`/api/admin/galleries/${galleryId}/photos/${photoId}`, { 
        method: 'DELETE' 
      })
      if (response.ok) {
        fetchGalleries()
      } else {
        console.error('Failed to delete photo')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  const GalleryForm = ({ gallery, onSave, onCancel }: {
    gallery?: ClientGallery
    onSave: (gallery: Partial<ClientGallery>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      clientName: gallery?.clientName || '',
      clientEmail: gallery?.clientEmail || '',
      eventName: gallery?.eventName || '',
      eventDate: gallery?.eventDate || '',
      description: gallery?.description || '',
      accessCode: gallery?.accessCode || '',
      expiresAt: gallery?.expiresAt ? new Date(gallery.expiresAt).toISOString().split('T')[0] : '',
      settings: gallery?.settings || {
        allowDownloads: true,
        allowFullSize: false,
        allowSocialSharing: false,
        requirePassword: false,
        showMetadata: false,
        layout: 'grid' as const
      }
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({
        ...formData,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData(prev => ({ ...prev, eventName: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
            <input
              type="date"
              value={formData.eventDate}
              onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Access Code (Optional)</label>
            <input
              type="text"
              value={formData.accessCode}
              onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Leave empty for no password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires On (Optional)</label>
            <input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {/* Gallery Settings */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Gallery Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.settings.allowDownloads}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, allowDownloads: e.target.checked }
                }))}
                className="rounded border-gray-300 mr-2"
              />
              Allow Downloads
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.settings.allowFullSize}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, allowFullSize: e.target.checked }
                }))}
                className="rounded border-gray-300 mr-2"
              />
              Allow Full Size Downloads
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.settings.requirePassword}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, requirePassword: e.target.checked }
                }))}
                className="rounded border-gray-300 mr-2"
              />
              Require Password
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.settings.showMetadata}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, showMetadata: e.target.checked }
                }))}
                className="rounded border-gray-300 mr-2"
              />
              Show Photo Metadata
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {gallery ? 'Update Gallery' : 'Create Gallery'}
          </button>
        </div>
      </form>
    )
  }

  const handleCreateGallery = async (galleryData: Partial<ClientGallery>) => {
    try {
      const response = await fetch('/api/admin/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData)
      })
      
      if (response.ok) {
        fetchGalleries()
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create gallery:', error)
    }
  }

  const handleUpdateGallery = async (galleryData: Partial<ClientGallery>) => {
    if (!editingGallery) return
    
    try {
      const response = await fetch(`/api/admin/galleries/${editingGallery.galleryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryData)
      })
      
      if (response.ok) {
        fetchGalleries()
        setEditingGallery(null)
      }
    } catch (error) {
      console.error('Failed to update gallery:', error)
    }
  }

  const handleDeleteGallery = async (galleryId: string) => {
    if (!confirm('Are you sure you want to delete this gallery?')) return
    
    try {
      const response = await fetch(`/api/admin/galleries/${galleryId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        fetchGalleries()
      }
    } catch (error) {
      console.error('Failed to delete gallery:', error)
    }
  }

  if (loading) {
    return <div className="p-6">Loading galleries...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Client Galleries</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Gallery
        </button>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingGallery) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingGallery ? 'Edit Gallery' : 'Create New Gallery'}
            </h2>
            <GalleryForm
              gallery={editingGallery || undefined}
              onSave={editingGallery ? handleUpdateGallery : handleCreateGallery}
              onCancel={() => {
                setShowCreateForm(false)
                setEditingGallery(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Galleries List */}
      <div className="grid gap-6">
        {galleries.map((gallery) => (
          <div key={gallery.galleryId} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{gallery.eventName}</h3>
                <p className="text-gray-600">{gallery.clientName} • {gallery.clientEmail}</p>
                <p className="text-sm text-gray-500">
                  {new Date(gallery.eventDate).toLocaleDateString()} &bull; {getMediaSummary(gallery.photos)}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf,.pptx,.docx,.doc,.xlsx,.xls"
                  onChange={(e) => e.target.files && handlePhotoUpload(gallery.galleryId, e.target.files)}
                  className="hidden"
                  id={`upload-${gallery.galleryId}`}
                />
                <label
                  htmlFor={`upload-${gallery.galleryId}`}
                  className="inline-block mt-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 cursor-pointer"
                >
                  Upload Media
                </label>
                <div className="mt-2 flex space-x-4 text-sm">
                  <span className={`px-2 py-1 rounded-full ${
                    gallery.settings.allowDownloads ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Downloads: {gallery.settings.allowDownloads ? 'Enabled' : 'Disabled'}
                  </span>
                  {gallery.settings.requirePassword && (
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                      Password Protected
                    </span>
                  )}
                  {gallery.expiresAt && new Date(gallery.expiresAt) < new Date() && (
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">
                      Expired
                    </span>
                  )}
                </div>

                {/* FIXED: Photo management section */}
                {gallery.photos && gallery.photos.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Manage Media</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {gallery.photos.slice(0, 6).map((photo) => (
                        <div key={photo.id} className="relative group">
                          {photo.mediaType === 'document' ? (
                            <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center">
                              <span className="text-xs text-gray-500 uppercase">{photo.metadata?.format || 'doc'}</span>
                            </div>
                          ) : (
                            <img
                              src={photo.thumbnailUrl}
                              alt={photo.title || 'Media'}
                              className="w-full h-16 object-cover rounded"
                            />
                          )}
                          {photo.mediaType === 'video' && (
                            <div className="absolute bottom-0 left-0 bg-black/60 text-white text-[10px] px-1 rounded-tr">
                              VID
                            </div>
                          )}
                          <button
                            onClick={() => handleDeletePhoto(gallery.galleryId, photo.id)}
                            className="absolute top-0 right-0 bg-red-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      {gallery.photos.length > 6 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500">
                          +{gallery.photos.length - 6} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`/client-gallery/${gallery.galleryId}`, '_blank')}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  View
                </button>
                <button
                  onClick={() => setEditingGallery(gallery)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGallery(gallery.galleryId)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {galleries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No galleries created yet.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Create your first gallery
          </button>
        </div>
      )}
    </div>
  )
}