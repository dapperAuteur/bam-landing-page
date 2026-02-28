'use client'

import Image from 'next/image'
import type { ClientMedia } from '@/types/client-gallery'

interface MediaCardProps {
  item: ClientMedia
  allowDownloads: boolean
  onSelect: (item: ClientMedia) => void
  onDownload: (item: ClientMedia) => void
  onToggleFavorite: (id: string) => void
}

function MediaTypeIcon({ type }: { type: string }) {
  if (type === 'video') {
    return (
      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Video
      </div>
    )
  }
  if (type === 'document') {
    return (
      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Doc
      </div>
    )
  }
  return null
}

export default function MediaCard({ item, allowDownloads, onSelect, onDownload, onToggleFavorite }: MediaCardProps) {
  const mediaType = item.mediaType || 'image'

  return (
    <div
      className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`View ${item.title || mediaType}`}
      onClick={() => onSelect(item)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(item) } }}
    >
      {mediaType === 'document' ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-4">
          <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-600 text-center truncate w-full">{item.title || 'Document'}</p>
          {item.metadata?.format && (
            <p className="text-xs text-gray-400 uppercase mt-1">{item.metadata.format}</p>
          )}
        </div>
      ) : (
        <Image
          src={item.thumbnailUrl}
          alt={item.title || mediaType}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      )}

      <MediaTypeIcon type={mediaType} />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id) }}
          className="bg-white/80 hover:bg-white p-2 rounded-full min-w-[36px] min-h-[36px] flex items-center justify-center"
          aria-label={item.isFavorite ? 'Unlike' : 'Like'}
        >
          {item.isFavorite ? '❤️' : '🤍'}
        </button>

        {allowDownloads && (
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(item) }}
            className="bg-white/80 hover:bg-white p-2 rounded-full min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label={`Download ${item.title || mediaType}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="absolute bottom-2 left-2 flex gap-2 text-white text-sm">
        {item.likes && item.likes > 0 && (
          <span className="bg-black/50 px-2 py-1 rounded">❤️ {item.likes}</span>
        )}
        {item.comments && item.comments.length > 0 && (
          <span className="bg-black/50 px-2 py-1 rounded">💬 {item.comments.length}</span>
        )}
        {mediaType === 'video' && item.metadata?.duration && (
          <span className="bg-black/50 px-2 py-1 rounded">
            {Math.floor(item.metadata.duration / 60)}:{String(Math.floor(item.metadata.duration % 60)).padStart(2, '0')}
          </span>
        )}
      </div>
    </div>
  )
}
