import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import { uploadToCloudinary, getThumbnailUrl } from '@/lib/cloudinary'
import type { Photo, PhotoCategory } from '@/types/photo'

export const dynamic = 'force-dynamic'

const CATEGORIES: PhotoCategory[] = ['sports', 'events', 'portraits', 'products', 'other']

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return !!session && session.user?.role === 'admin'
}

// GET — list photos with optional filters (category, tags, portfolio).
// Public read (portfolio surfaces use it); only non-sensitive fields exist here.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const portfolio = searchParams.get('portfolio') === 'true'
    const limit = parseInt(searchParams.get('limit') || '100')

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const query: Record<string, unknown> = {}
    if (category && category !== 'all') query.category = category
    if (tags?.length) query.tags = { $in: tags }
    if (portfolio) query['usedIn.portfolio'] = true

    const photos = await db.collection('photos')
      .find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({
      photos: photos.map(p => ({ ...p, id: p._id?.toString() || p.id })),
    })
  } catch (error) {
    console.error('Photos fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST — upload one or more photos to the central library (admin only).
export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const categoryRaw = (formData.get('category') as string) || 'other'
    const category: PhotoCategory = CATEGORIES.includes(categoryRaw as PhotoCategory)
      ? (categoryRaw as PhotoCategory)
      : 'other'
    const tags = JSON.parse((formData.get('tags') as string) || '[]')
    const portfolioUse = formData.get('portfolio') === 'true'

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const uploaded = await Promise.all(files.map(async (file, index) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const publicId = `${Date.now()}-${index}-${file.name.replace(/\.[^/.]+$/, '')}`
      const result = await uploadToCloudinary(buffer, `library/${category}`, publicId)

      const photo: Omit<Photo, 'id'> = {
        cloudinaryId: result.public_id,
        originalUrl: result.secure_url,
        thumbnailUrl: getThumbnailUrl(result.public_id),
        title: file.name,
        tags: Array.isArray(tags) && tags.length > 0 ? tags : [category],
        category,
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        },
        usedIn: { galleries: [], blogs: [], portfolio: portfolioUse },
        uploadedAt: new Date(),
        updatedAt: new Date(),
      }

      const ins = await db.collection('photos').insertOne(photo)
      return { ...photo, id: ins.insertedId.toString() }
    }))

    return NextResponse.json({ photos: uploaded })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
