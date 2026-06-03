'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface MarketingGalleryCard {
  galleryId: string
  eventName: string
  description: string
  eventDate: string
  coverUrl: string | null
  photoCount: number
}

export default function MarketingGalleriesPage() {
  const [galleries, setGalleries] = useState<MarketingGalleryCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/galleries/marketing')
        if (res.ok) {
          const data = await res.json()
          setGalleries(data.galleries ?? [])
        }
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Galleries</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A look at recent work. Browse a gallery to see the kind of coverage you can expect.
          </p>
        </header>

        {loading ? (
          <p className="text-center text-gray-500">Loading…</p>
        ) : galleries.length === 0 ? (
          <p className="text-center text-gray-400">No galleries to show yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((g) => (
              <Link
                key={g.galleryId}
                href={`/client-gallery/${g.galleryId}`}
                className="group block rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-[4/3] bg-gray-200">
                  {g.coverUrl ? (
                    <Image
                      src={g.coverUrl}
                      alt={g.eventName}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No cover</div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 truncate">{g.eventName}</h2>
                  {g.description && <p className="text-sm text-gray-500 line-clamp-2 mt-1">{g.description}</p>}
                  <p className="text-xs text-gray-400 mt-2">{g.photoCount} photos</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
