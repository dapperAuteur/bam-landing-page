'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'
import { Photo, PhotoCategory } from './../../types/photo'

interface PhotoPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect?: (photo: Photo) => void
  onSelectMultiple?: (photos: Photo[]) => void
  allowMultiple?: boolean
  filterTags?: string[]
  excludeGalleries?: boolean
  title?: string
  description?: string
}

export default function PhotoPicker({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  allowMultiple = false,
  filterTags,
  excludeGalleries = false,
  title = 'Select Photos',
  description = 'Choose from your library, or upload a new photo'
}: PhotoPickerProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Counts nested dragenter/dragleave so moving over a child element does not
  // flicker the drop highlight off.
  const dragDepth = useRef(0)

  const categories = ['all', 'sports', 'events', 'portraits', 'products', 'other']

  useEffect(() => {
    if (isOpen) {
      fetchPhotos()
      setSelectedPhotos([])
    }
  }, [isOpen, selectedCategory, filterTags, excludeGalleries])

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (filterTags?.length) {
        params.append('tags', filterTags.join(','))
      }
      
      if (excludeGalleries) {
        params.append('portfolio', 'true')
      }

      params.append('limit', '50')

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

  const filteredPhotos = photos.filter(photo => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      photo.title?.toLowerCase().includes(searchLower) ||
      photo.description?.toLowerCase().includes(searchLower) ||
      photo.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    )
  })

  const handlePhotoClick = (photo: Photo) => {
    if (allowMultiple) {
      const isSelected = selectedPhotos.some(p => p.id === photo.id)
      if (isSelected) {
        setSelectedPhotos(selectedPhotos.filter(p => p.id !== photo.id))
      } else {
        setSelectedPhotos([...selectedPhotos, photo])
      }
    } else {
      onSelect?.(photo)
      onClose()
    }
  }

  /**
   * Upload straight into the library from wherever the picker was opened, so
   * "use a photo I haven't uploaded yet" doesn't mean leaving the post you're
   * editing, going to /admin/photos, uploading, and coming back.
   *
   * Files are filed under the category currently filtered to, falling back to
   * 'other' when the filter is "all" — matching where the user is already
   * looking, so the new photo doesn't upload into a category they then have to
   * go find.
   */
  const uploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) {
      setUploadError('Those files are not images.')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      const category: PhotoCategory =
        selectedCategory !== 'all' ? (selectedCategory as PhotoCategory) : 'other'

      const body = new FormData()
      // Single-select callers only need one; sending just the first keeps the
      // "upload then immediately use it" flow unambiguous.
      const toSend = allowMultiple ? files : files.slice(0, 1)
      toSend.forEach(f => body.append('files', f))
      body.append('category', category)
      body.append('tags', JSON.stringify(filterTags?.length ? filterTags : []))
      body.append('portfolio', 'false')

      const res = await fetch('/api/photos', { method: 'POST', body })
      if (!res.ok) {
        const detail = await res.json().catch(() => null)
        throw new Error(detail?.error || `Upload failed (${res.status})`)
      }

      const data = await res.json()
      const uploaded: Photo[] = data.photos || []
      if (uploaded.length === 0) throw new Error('Upload returned no photos.')

      // Show them at the top immediately rather than refetching, so the new
      // photo is visible even if it would sort below the fold.
      setPhotos(prev => [...uploaded, ...prev])

      if (allowMultiple) {
        setSelectedPhotos(prev => [...prev, ...uploaded])
      } else {
        // Uploading in single-select mode means "I want this one".
        onSelect?.(uploaded[0])
        onClose()
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    if (uploading) return
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  const handleConfirmSelection = () => {
    if (allowMultiple && onSelectMultiple && selectedPhotos.length > 0) {
      onSelectMultiple(selectedPhotos)
      setSelectedPhotos([])
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <label
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-white whitespace-nowrap ${
                uploading ? 'bg-gray-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              <ArrowUpTrayIcon className="h-5 w-5" aria-hidden="true" />
              {uploading ? 'Uploading…' : 'Upload new'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={allowMultiple}
                className="hidden"
                disabled={uploading}
                onChange={e => e.target.files?.length && uploadFiles(e.target.files)}
              />
            </label>
          </div>

          {uploadError && (
            <p role="alert" className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}

          {allowMultiple && (
            <div className="mt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
              </span>
              {selectedPhotos.length > 0 && (
                <button
                  onClick={handleConfirmSelection}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Use Selected Photos
                </button>
              )}
            </div>
          )}
        </div>

        {/* Photo Grid — doubles as a drop target for uploads */}
        <div
          className={`relative flex-1 overflow-y-auto p-4 ${isDragging ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/50' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); dragDepth.current += 1; setIsDragging(true) }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => {
            e.preventDefault()
            dragDepth.current -= 1
            if (dragDepth.current <= 0) { dragDepth.current = 0; setIsDragging(false) }
          }}
          onDrop={onDrop}
        >
          {isDragging && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <p className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
                Drop to upload
              </p>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No photos found</p>
              <p className="mt-1 text-sm text-gray-400">
                Drag an image here, or use &ldquo;Upload new&rdquo; above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPhotos.map((photo) => {
                const isSelected = allowMultiple && selectedPhotos.some(p => p.id === photo.id)
                
                return (
                  <div
                    key={photo.id}
                    className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group ${
                      isSelected ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <Image
                      src={photo.thumbnailUrl}
                      alt={photo.title || 'Photo'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    
                    {/* Selection indicator */}
                    {allowMultiple && (
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
                        isSelected 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-white/70 border-white group-hover:bg-white'
                      } flex items-center justify-center`}>
                        {isSelected && <CheckIcon className="w-4 h-4 text-white" />}
                      </div>
                    )}

                    {/* Photo info overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <h3 className="text-sm font-medium truncate">
                          {photo.title || 'Untitled'}
                        </h3>
                        <p className="text-xs text-gray-300">{photo.category}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}