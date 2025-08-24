'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Photo } from '../../types/photo'

interface BlogContentProps {
  content: string
  photoIds: string[]
  className?: string
}

export default function BlogContentRenderer({ content, photoIds, className = '' }: BlogContentProps) {
  const [photos, setPhotos] = useState<Record<string, Photo>>({})
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)

  // Fetch all photos used in this blog post
  useEffect(() => {
    if (photoIds.length === 0) return

    const fetchPhotos = async () => {
      try {
        const promises = photoIds.map(async (id) => {
          const response = await fetch(`/api/photos/${id}`)
          if (response.ok) {
            const data = await response.json()
            return { [id]: data.photo }
          }
          return null
        })

        const results = await Promise.all(promises)
        const photoMap = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})
        setPhotos(photoMap)
      } catch (error) {
        console.error('Failed to fetch blog photos:', error)
      }
    }

    fetchPhotos()
  }, [photoIds])

  // Process content and replace photo references with actual images
  const processedContent = content
    // Replace single markdown images
    .replace(
      /!\[(.*?)\]\((.*?)\s*"?(.*?)"?\)/g,
      (match, alt, src, title) => {
        const photo = Object.values(photos).find(p => p.originalUrl === src)
        if (photo) {
          return `<div class="blog-single-image my-6">
            <img src="${photo.thumbnailUrl}" alt="${alt}" title="${title}" class="w-full rounded-lg shadow-md cursor-pointer" onclick="openLightbox('${photo.originalUrl}', '${alt}')" />
            ${title ? `<p class="text-center text-sm text-gray-600 mt-2 italic">${title}</p>` : ''}
          </div>`
        }
        return match
      }
    )
    // Process photo galleries (basic version)
    .replace(
      /<!-- Photo Gallery Start -->(.*?)<!-- Photo Gallery End -->/gs,
      (match, galleryContent) => {
        return `<div class="blog-photo-gallery my-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${galleryContent}
          </div>
        </div>`
      }
    )

  return (
    <>
      <div 
        className={`prose prose-lg max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />

      {/* Simple Lightbox */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxPhoto}
              alt="Lightbox image"
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
              onClick={() => setLightboxPhoto(null)}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}