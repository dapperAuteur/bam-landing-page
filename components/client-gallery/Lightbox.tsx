'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import type { ClientMedia } from '@/types/client-gallery'
import CommentSection from './CommentSection'

interface LightboxProps {
  item: ClientMedia
  allowDownloads: boolean
  onClose: () => void
  onDownload: (item: ClientMedia) => void
  onToggleFavorite: (id: string) => void
  onAddComment: (photoId: string, text: string) => void
}

export default function Lightbox({
  item,
  allowDownloads,
  onClose,
  onDownload,
  onToggleFavorite,
  onAddComment
}: LightboxProps) {
  const [showComments, setShowComments] = useState(false)
  const mediaType = item.mediaType || 'image'

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    // Prevent background scrolling
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing ${item.title || mediaType}`}
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-full w-full" onClick={(e) => e.stopPropagation()}>
        {/* Media content */}
        {mediaType === 'video' ? (
          <video
            src={item.originalUrl}
            controls
            autoPlay
            className="max-w-full max-h-[80vh] mx-auto rounded"
            aria-label={item.title || 'Video'}
          >
            Your browser does not support video playback.
          </video>
        ) : mediaType === 'document' ? (
          <div className="bg-white rounded-lg p-8 max-h-[80vh] overflow-auto">
            {item.mimeType === 'application/pdf' ? (
              <iframe
                src={item.originalUrl}
                className="w-full h-[70vh] rounded"
                title={item.title || 'Document'}
              />
            ) : (
              <div className="text-center py-12">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-700 mb-2">{item.title || 'Document'}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {item.metadata?.format?.toUpperCase()} {item.metadata?.size ? `(${(item.metadata.size / 1024 / 1024).toFixed(1)} MB)` : ''}
                </p>
                {allowDownloads && (
                  <button
                    onClick={() => onDownload(item)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Download Document
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <Image
            src={item.originalUrl}
            alt={item.title || 'Photo'}
            width={1200}
            height={800}
            className="max-w-full max-h-[80vh] object-contain mx-auto"
          />
        )}

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={onClose}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Action buttons */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className="bg-black/50 text-white px-3 py-2 rounded-md hover:bg-black/70 min-h-[44px]"
            aria-label={item.isFavorite ? 'Unlike' : 'Like'}
          >
            {item.isFavorite ? '❤️' : '🤍'} {item.likes || 0}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="bg-black/50 text-white px-3 py-2 rounded-md hover:bg-black/70 min-h-[44px]"
            aria-label={`${item.comments?.length || 0} comments`}
            aria-expanded={showComments}
          >
            💬 {item.comments?.length || 0}
          </button>
        </div>

        {/* Download button */}
        {allowDownloads && (
          <button
            onClick={() => onDownload(item)}
            className="absolute bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 min-h-[44px]"
            aria-label={`Download ${item.title || mediaType}`}
          >
            Download
          </button>
        )}

        {/* Title/description */}
        {item.title && mediaType !== 'document' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
            <h3 className="text-lg font-bold">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-gray-200">{item.description}</p>
            )}
          </div>
        )}

        {/* Comments section */}
        {showComments && (
          <CommentSection
            comments={item.comments || []}
            onAddComment={(text) => onAddComment(item.id, text)}
          />
        )}
      </div>
    </div>
  )
}
