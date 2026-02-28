import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import {
  uploadToCloudinary,
  getThumbnailUrl,
  getVideoThumbnailUrl,
  getDocumentPreviewUrl,
  getMediaTypeFromMime
} from '@/lib/cloudinary'
import clientPromise from '@/lib/db/mongodb'
import type { MediaType } from '@/types/client-gallery'

const SIZE_LIMITS: Record<MediaType, number> = {
  image: 20 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  document: 50 * 1024 * 1024
}

function getThumbnailForType(publicId: string, mediaType: MediaType): string {
  switch (mediaType) {
    case 'video': return getVideoThumbnailUrl(publicId)
    case 'document': return getDocumentPreviewUrl(publicId)
    default: return getThumbnailUrl(publicId)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = [...formData.getAll('media'), ...formData.getAll('photos')] as File[]

    for (const file of files) {
      const mediaType = getMediaTypeFromMime(file.type)
      const limit = SIZE_LIMITS[mediaType]
      if (file.size > limit) {
        const limitMB = Math.round(limit / (1024 * 1024))
        return NextResponse.json(
          { error: `File ${file.name} exceeds ${limitMB}MB limit for ${mediaType} files` },
          { status: 400 }
        )
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mediaType = getMediaTypeFromMime(file.type)

      const result = await uploadToCloudinary(
        buffer,
        `projects/${params.projectId}`,
        `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`
      )

      return {
        id: result.public_id.split('/').pop(),
        cloudinaryId: result.public_id,
        originalUrl: result.secure_url,
        thumbnailUrl: getThumbnailForType(result.public_id, mediaType),
        title: file.name,
        mediaType,
        resourceType: result.resource_type,
        mimeType: file.type,
        metadata: {
          width: result.width || undefined,
          height: result.height || undefined,
          format: result.format,
          size: result.bytes,
          duration: result.duration || undefined,
          pages: result.pages || undefined
        },
        uploadedAt: new Date()
      }
    })

    const media = await Promise.all(uploadPromises)

    await db.collection('client_projects').updateOne(
      { projectId: params.projectId },
      {
        $addToSet: { media: { $each: media } } as any,
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({ media })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
