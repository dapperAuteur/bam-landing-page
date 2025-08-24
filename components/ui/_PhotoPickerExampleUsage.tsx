// Example usage in blog editor:
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { MagnifyingGlassIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import PhotoPicker from './PhotoPicker'
import { Photo } from '../../types/photo'
export function BlogPhotoPickerExample() {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])

  const handlePhotoSelect = (photo: Photo) => {
    // Insert photo into blog editor
    console.log('Selected photo for blog:', photo)
    // You would integrate this with your blog editor (TinyMCE, Tiptap, etc.)
  }

  const handleMultipleSelect = (photos: Photo[]) => {
    setSelectedPhotos(photos)
    // Process multiple photos for gallery insertion
  }

  return (
    <div>
      <button
        onClick={() => setShowPicker(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Photos from Library
      </button>

      <PhotoPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handlePhotoSelect}
        onSelectMultiple={handleMultipleSelect}
        allowMultiple={true}
        excludeGalleries={true} // Don't show client-only photos in blog
        filterTags={['portfolio', 'blog']} // Only show photos suitable for content
      />
    </div>
  )
}