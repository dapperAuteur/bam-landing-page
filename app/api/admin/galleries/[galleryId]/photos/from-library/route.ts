import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'
import type { ClientMedia } from '@/types/client-gallery'

// POST — add photos from the central library to this gallery (admin).
// Body: { photoIds: string[] }. Each library Photo is copied into the gallery's
// embedded photos[] as a ClientMedia entry, and the gallery is tracked in the
// photo's usedIn.galleries.
export async function POST(request: NextRequest, props: { params: Promise<{ galleryId: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { photoIds } = await request.json()
    if (!Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json({ error: 'No photoIds provided' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    const objectIds = photoIds.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id))
    const photos = await db.collection('photos').find({ _id: { $in: objectIds } }).toArray()
    if (photos.length === 0) {
      return NextResponse.json({ error: 'No matching library photos' }, { status: 404 })
    }

    const now = new Date()
    const media: ClientMedia[] = photos.map(p => ({
      id: p._id.toString(),
      cloudinaryId: p.cloudinaryId,
      originalUrl: p.originalUrl,
      thumbnailUrl: p.thumbnailUrl,
      title: p.title,
      description: p.description,
      mediaType: 'image',
      metadata: {
        width: p.metadata?.width,
        height: p.metadata?.height,
        format: p.metadata?.format ?? 'jpg',
        size: p.metadata?.size ?? 0,
      },
      uploadedAt: now,
    }))

    // Append to the gallery (skip any already present by id).
    const gallery = await db.collection('client_galleries').findOne({ galleryId: params.galleryId })
    if (!gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    const existingIds = new Set((gallery.photos ?? []).map((m: ClientMedia) => m.id))
    const toAdd = media.filter(m => !existingIds.has(m.id))

    if (toAdd.length > 0) {
      await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId },
        { $push: { photos: { $each: toAdd } } as any, $set: { updatedAt: now } },
      )
      // Track usage on each library photo.
      await db.collection('photos').updateMany(
        { _id: { $in: toAdd.map(m => new ObjectId(m.id)) } },
        { $addToSet: { 'usedIn.galleries': params.galleryId }, $set: { updatedAt: now } },
      )
    }

    return NextResponse.json({ success: true, added: toAdd.length })
  } catch (error) {
    console.error('Add from library error:', error)
    return NextResponse.json({ error: 'Failed to add photos' }, { status: 500 })
  }
}
