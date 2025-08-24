'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { TrashIcon, PlusIcon, TagIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { Photo } from '../../../types/photo'

export default function PhotoManagementPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)

  const categories = ['all', 'sports', 'events', 'portraits', 'products', 'other']

  useEffect(() => {
    fetchPhotos()
  }, [selectedCategory])

  const fetchPhotos = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/photos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (formData: FormData) => {
    setUploading(true)
    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        fetchPhotos()
        setShowUploadModal(false)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const deletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo? It will be removed from all galleries and blog posts.')) return

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPhotos(photos.filter(photo => photo.id !== photoId))
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const updatePhotoMetadata = async (photo: Photo, updates: Partial<Photo>) => {
    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        setPhotos(photos.map(p => p.id === photo.id ? { ...p, ...updates } : p))
        setSelectedPhoto(null)
      }
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  const filteredPhotos = photos

  // Upload Modal Component
  const UploadModal = () => {
    const [files, setFiles] = useState<File[]>([])
    const [category, setCategory] = useState('other')
    const [tags, setTags] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [portfolioUse, setPortfolioUse] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (files.length === 0) return

      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('category', category)
      formData.append('tags', JSON.stringify(tags))
      formData.append('title', title)
      formData.append('description', description)
      formData.append('portfolio', portfolioUse.toString())

      handleFileUpload(formData)
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Upload Photos</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Files
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
              {files.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">{files.length} files selected</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="wedding, outdoor, portrait"
                  onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="portfolioUse"
                checked={portfolioUse}
                onChange={(e) => setPortfolioUse(e.target.checked)}
                className="rounded border-gray-300 mr-2"
              />
              <label htmlFor="portfolioUse" className="text-sm text-gray-700">
                Use in portfolio/marketing
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {uploading ? 'Uploading...' : 'Upload Photos'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Photo Details Modal
  const PhotoDetailsModal = ({ photo }: { photo: Photo }) => {
    const [editingPhoto, setEditingPhoto] = useState(photo)

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo Preview */}
            <div>
              <Image
                src={photo.originalUrl}
                alt={photo.title || 'Photo'}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Photo Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Photo Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingPhoto.title || ''}
                  onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingPhoto.description || ''}
                  onChange={(e) => setEditingPhoto({...editingPhoto, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingPhoto.category}
                  onChange={(e) => setEditingPhoto({...editingPhoto, category: e.target.value as Photo['category']})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {categories.filter(c => c !== 'all').map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={editingPhoto.tags.join(', ')}
                  onChange={(e) => setEditingPhoto({
                    ...editingPhoto, 
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="portfolioUseEdit"
                  checked={editingPhoto.usedIn.portfolio}
                  onChange={(e) => setEditingPhoto({
                    ...editingPhoto,
                    usedIn: { ...editingPhoto.usedIn, portfolio: e.target.checked }
                  })}
                  className="rounded border-gray-300 mr-2"
                />
                <label htmlFor="portfolioUseEdit" className="text-sm text-gray-700">
                  Use in portfolio/marketing
                </label>
              </div>

              {/* Usage Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Usage</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>In {photo.usedIn.galleries.length} galleries</p>
                  <p>In {photo.usedIn.blogs.length} blog posts</p>
                  <p>Portfolio use: {photo.usedIn.portfolio ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Metadata</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Dimensions: {photo.metadata.width} × {photo.metadata.height}</p>
                  <p>Format: {photo.metadata.format.toUpperCase()}</p>
                  <p>Size: {(photo.metadata.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p>Uploaded: {new Date(photo.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updatePhotoMetadata(photo, editingPhoto)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Photo Library</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Upload Photos</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{photos.length}</div>
          <div className="text-sm text-gray-500">Total Photos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {photos.filter(p => p.usedIn.portfolio).length}
          </div>
          <div className="text-sm text-gray-500">Portfolio Photos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {photos.filter(p => p.usedIn.galleries.length > 0).length}
          </div>
          <div className="text-sm text-gray-500">In Galleries</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {photos.filter(p => p.usedIn.blogs.length > 0).length}
          </div>
          <div className="text-sm text-gray-500">In Blog Posts</div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="aspect-square relative cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
              <Image
                src={photo.thumbnailUrl}
                alt={photo.title || 'Photo'}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
              
              {/* Overlay with usage indicators */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-2 left-2 flex gap-1">
                {photo.usedIn.portfolio && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Portfolio</span>
                )}
                {photo.usedIn.galleries.length > 0 && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    {photo.usedIn.galleries.length} Galleries
                  </span>
                )}
                {photo.usedIn.blogs.length > 0 && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Blog</span>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {photo.title || 'Untitled'}
                  </h3>
                  <p className="text-xs text-gray-500">{photo.category}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deletePhoto(photo.id)
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-xs text-gray-500 mb-2">
                {photo.metadata.width} × {photo.metadata.height}
              </div>
              
              {photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {photo.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {photo.tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{photo.tags.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No photos found in this category.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            Upload your first photos
          </button>
        </div>
      )}

      {/* Modals */}
      {showUploadModal && <UploadModal />}
      {selectedPhoto && <PhotoDetailsModal photo={selectedPhoto} />}
    </div>
  )
}