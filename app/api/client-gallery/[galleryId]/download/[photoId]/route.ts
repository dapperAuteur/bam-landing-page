import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../../../lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary'
import { checkDownloadRateLimit, recordDownload } from '../../../../../../lib/utils/download-rate-limit'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/** Determine content type and file extension for download */
function getDownloadInfo(photo: any): { contentType: string; extension: string } {
  if (photo.mimeType) {
    const ext = photo.metadata?.format || photo.mimeType.split('/').pop() || 'bin'
    return { contentType: photo.mimeType, extension: ext }
  }
  // Fallback for legacy image-only photos
  const format = photo.metadata?.format || 'jpg'
  return { contentType: `image/${format}`, extension: format }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const gallery = await db.collection('client_galleries').findOne({
      galleryId: params.galleryId
    })

    if (!gallery || !gallery.settings?.allowDownloads) {
      return NextResponse.json({ error: 'Downloads not allowed' }, { status: 403 })
    }

    // Enforce download rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = await checkDownloadRateLimit(
      db, params.galleryId, ipAddress, gallery.settings.downloadsPerSession
    )
    if (!allowed) {
      return NextResponse.json(
        { error: 'Download limit reached. Please try again later.' },
        { status: 429 }
      )
    }

    const decodedPhotoId = decodeURIComponent(params.photoId)

    const photo = gallery.photos?.find((p: any) =>
      p.id === decodedPhotoId ||
      p.cloudinaryId === decodedPhotoId ||
      p.cloudinaryId?.includes(decodedPhotoId)
    )

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    const { contentType, extension } = getDownloadInfo(photo)
    const fileName = `${gallery.eventName}-${photo.title || photo.id}.${extension}`

    try {
      const cloudinaryId = photo.cloudinaryId || photo.id
      const resourceType = photo.resourceType || 'image'

      // For documents (raw), use the original URL directly
      const mediaUrl = resourceType === 'raw'
        ? photo.originalUrl
        : cloudinary.url(cloudinaryId, {
            resource_type: resourceType,
            quality: 'auto:best',
            fetch_format: 'auto'
          })

      const mediaResponse = await fetch(mediaUrl)

      if (!mediaResponse.ok) {
        // Fallback to original URL
        const originalResponse = await fetch(photo.originalUrl || photo.thumbnailUrl)
        if (!originalResponse.ok) {
          throw new Error('Failed to fetch media from both Cloudinary and original URL')
        }

        const buffer = await originalResponse.arrayBuffer()
        await recordDownload(db, params.galleryId, ipAddress)

        return new NextResponse(buffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${fileName}"`
          }
        })
      }

      const buffer = await mediaResponse.arrayBuffer()
      await recordDownload(db, params.galleryId, ipAddress)

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`
        }
      })

    } catch (fetchError) {
      console.error('Error fetching media:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
    }

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
