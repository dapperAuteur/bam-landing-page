'use client'

import type { MediaType, ClientMedia } from '@/types/client-gallery'

interface MediaFilterProps {
  media: ClientMedia[]
  activeFilter: MediaType | 'all'
  onFilterChange: (filter: MediaType | 'all') => void
}

function countByType(media: ClientMedia[], type: MediaType): number {
  return media.filter(m => (m.mediaType || 'image') === type).length
}

export default function MediaFilter({ media, activeFilter, onFilterChange }: MediaFilterProps) {
  const imageCount = countByType(media, 'image')
  const videoCount = countByType(media, 'video')
  const docCount = countByType(media, 'document')

  // Don't show filter if everything is the same type
  const hasMultipleTypes = [imageCount, videoCount, docCount].filter(c => c > 0).length > 1
  if (!hasMultipleTypes) return null

  const filters: { key: MediaType | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: media.length },
    ...(imageCount > 0 ? [{ key: 'image' as const, label: 'Photos', count: imageCount }] : []),
    ...(videoCount > 0 ? [{ key: 'video' as const, label: 'Videos', count: videoCount }] : []),
    ...(docCount > 0 ? [{ key: 'document' as const, label: 'Documents', count: docCount }] : []),
  ]

  return (
    <div className="flex gap-2 mb-6" role="tablist" aria-label="Filter by media type">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          role="tab"
          aria-selected={activeFilter === key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === key
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {label} ({count})
        </button>
      ))}
    </div>
  )
}
