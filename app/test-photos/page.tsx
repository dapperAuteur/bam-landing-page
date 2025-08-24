'use client'

import { SetStateAction, useState } from 'react'
import PhotoPicker from './../../components/ui/PhotoPicker'

export default function TestPhotos() {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Photo Picker Test</h1>
      
      <button
        onClick={() => setShowPicker(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Open Photo Picker
      </button>

      {selectedPhoto && (
        <div className="mt-4">
          <h2>Selected Photo:</h2>
          <pre>{JSON.stringify(selectedPhoto, null, 2)}</pre>
        </div>
      )}

      <PhotoPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(photo) => {
          setSelectedPhoto(photo)
          console.log('Selected:', photo)
        }}
      />
    </div>
  )
}