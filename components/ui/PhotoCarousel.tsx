'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'

export interface CarouselImage {
  url: string
  alt?: string
  title?: string
}

interface PhotoCarouselProps {
  images: CarouselImage[]
  /** tailwind aspect ratio class for the frame; default 16/10 */
  aspect?: string
  className?: string
}

// Reusable photo carousel for blog posts (via the MDX <Carousel> component) and
// galleries (slideshow). Keyboard: ← / →. Serializable props only (works in MDX
// across the RSC boundary).
export default function PhotoCarousel({ images, aspect = 'aspect-[16/10]', className }: PhotoCarouselProps) {
  const [index, setIndex] = useState(0)
  const count = images?.length ?? 0
  const go = useCallback((delta: number) => setIndex(prev => (prev + delta + count) % count), [count])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  if (count === 0) return null
  const current = images[Math.min(index, count - 1)]

  return (
    <div className={`relative my-6 overflow-hidden rounded-xl bg-gray-100 ${className ?? ''}`}>
      <div className={`relative ${aspect}`}>
        <Image
          src={current.url}
          alt={current.alt || current.title || `Slide ${index + 1} of ${count}`}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      {(current.title || current.alt) && (
        <div className="absolute top-2 left-2 max-w-[70%] truncate rounded bg-black/55 px-2 py-1 text-xs text-white">
          {current.title || current.alt}
        </div>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl leading-none text-white hover:bg-black/70"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl leading-none text-white hover:bg-black/70"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-1.5">
            <span className="mr-2 rounded bg-black/50 px-2 py-0.5 text-xs text-white">{index + 1} / {count}</span>
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
