'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import PhotoCarousel from '@/components/ui/PhotoCarousel'
import type { Photo, PhotoCategory } from '@/types/photo'

const CATEGORIES: (PhotoCategory | 'all')[] = ['all', 'sports', 'events', 'portraits', 'products', 'other']

export default function PhotographyPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<PhotoCategory | 'all'>('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/photos?portfolio=true&limit=200')
        if (res.ok) setPhotos((await res.json()).photos ?? [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const shown = filter === 'all' ? photos : photos.filter(p => p.category === filter)
  const carouselImages = shown.map(p => ({ url: p.originalUrl, alt: p.title, title: p.title }))

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Photography</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A selection of favorite shots. Looking for full event coverage? See the{' '}
            <a href="/galleries" className="text-blue-600 hover:underline">galleries</a>.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1 rounded-full text-sm capitalize ${filter === c ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : shown.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No photos to show yet.</p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
            {shown.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setLightboxIndex(i)}
                className="block w-full overflow-hidden rounded-lg bg-gray-200 break-inside-avoid"
                aria-label={`Open ${p.title || 'photo'}`}
              >
                <Image
                  src={p.thumbnailUrl}
                  alt={p.alt || p.title || 'photo'}
                  width={p.metadata?.width || 400}
                  height={p.metadata?.height || 400}
                  className="w-full h-auto hover:opacity-90 transition-opacity"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-11 h-11 flex items-center justify-center"
          >
            ✕
          </button>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <PhotoCarousel images={carouselImages} initialIndex={lightboxIndex} />
          </div>
        </div>
      )}
    </main>
  )
}
