'use client'

import type { ClientGallery } from '@/types/client-gallery'

interface GalleryHeaderProps {
  gallery: ClientGallery
  downloadingAll: boolean
  onDownloadAll: () => void
}

function getMediaSummary(gallery: ClientGallery): string {
  const photos = gallery.photos || []
  const images = photos.filter(p => !p.mediaType || p.mediaType === 'image').length
  const videos = photos.filter(p => p.mediaType === 'video').length
  const docs = photos.filter(p => p.mediaType === 'document').length

  const parts: string[] = []
  if (images > 0) parts.push(`${images} photo${images !== 1 ? 's' : ''}`)
  if (videos > 0) parts.push(`${videos} video${videos !== 1 ? 's' : ''}`)
  if (docs > 0) parts.push(`${docs} document${docs !== 1 ? 's' : ''}`)

  return parts.join(', ') || '0 items'
}

export default function GalleryHeader({ gallery, downloadingAll, onDownloadAll }: GalleryHeaderProps) {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">{gallery.eventName}</h1>
        <p className="text-gray-600 mt-2">
          {new Date(gallery.eventDate).toLocaleDateString()} &bull; {getMediaSummary(gallery)}
        </p>
        {gallery.description && (
          <p className="text-gray-700 mt-2">{gallery.description}</p>
        )}

        {gallery.settings.allowDownloads && (
          <div className="flex gap-4 mt-4 items-center">
            <p className="text-sm text-blue-600">
              Downloads are enabled for this gallery
            </p>
            {gallery.photos?.length > 0 && (
              <button
                onClick={onDownloadAll}
                disabled={downloadingAll}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:bg-gray-400 min-h-[44px]"
                aria-label="Download all files"
              >
                {downloadingAll ? 'Downloading...' : 'Download All'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
