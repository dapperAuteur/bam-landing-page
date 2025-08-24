'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Photo } from '../../types/photo'

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const categories = ['all', 'sports', 'events', 'portraits', 'products']

  useEffect(() => {
    fetchPortfolioPhotos()
  }, [selectedCategory])

  const fetchPortfolioPhotos = async () => {
    try {
      const params = new URLSearchParams({
        portfolio: 'true', // Only get photos marked for portfolio use
        limit: '100'
      })
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }

      const response = await fetch(`/api/photos?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos || [])
      }
    } catch (error) {
      console.error('Failed to fetch portfolio photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryPhotos = photos.filter(photo => 
    selectedCategory === 'all' || photo.category === selectedCategory
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Photography Portfolio
          </h1>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Capturing moments that matter. From sports action to intimate portraits, 
            explore a collection of professional photography showcasing diverse styles and expertise.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center space-x-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && (
                <span className="ml-2 text-xs opacity-75">
                  ({photos.filter(p => p.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : categoryPhotos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No portfolio photos available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={photo.thumbnailUrl}
                    alt={photo.title || 'Portfolio photo'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Photo overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-lg">
                      {photo.title || 'Untitled'}
                    </h3>
                    {photo.description && (
                      <p className="text-gray-200 text-sm mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag}
                          className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedPhoto.originalUrl}
              alt={selectedPhoto.title || 'Portfolio photo'}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Photo info */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedPhoto.title || 'Untitled'}
              </h2>
              {selectedPhoto.description && (
                <p className="text-gray-200 mb-3">
                  {selectedPhoto.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedPhoto.tags.map(tag => (
                    <span 
                      key={tag}
                      className="bg-white/20 text-white text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-300">
                  {selectedPhoto.metadata.width} × {selectedPhoto.metadata.height}
                </div>
              </div>
            </div>

            {/* Navigation arrows (if you want to implement prev/next) */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = categoryPhotos.findIndex(p => p.id === selectedPhoto.id)
                if (currentIndex > 0) {
                  setSelectedPhoto(categoryPhotos[currentIndex - 1])
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 rounded-full p-3 hover:bg-black/70 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                const currentIndex = categoryPhotos.findIndex(p => p.id === selectedPhoto.id)
                if (currentIndex < categoryPhotos.length - 1) {
                  setSelectedPhoto(categoryPhotos[currentIndex + 1])
                }
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Let's discuss your photography needs and bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get In Touch
            </a>
            <a
              href="/client-gallery"
              className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              View Client Galleries
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}