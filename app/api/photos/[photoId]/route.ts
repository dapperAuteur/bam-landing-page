import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return !!session && session.user?.role === 'admin'
}

function byId(id: string) {
  return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { cloudinaryId: id }
}

// GET — single photo (public).
export async function GET(_req: NextRequest, props: { params: Promise<{ photoId: string }> }) {
  const params = await props.params;
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const photo = await db.collection('photos').findOne(byId(params.photoId))
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ photo: { ...photo, id: photo._id.toString() } })
  } catch (error) {
    console.error('Photo fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 })
  }
}

// PUT — update metadata (admin).
export async function PUT(request: NextRequest, props: { params: Promise<{ photoId: string }> }) {
  const params = await props.params;
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const { id, _id, cloudinaryId, createdAt, ...updates } = body
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const result = await db.collection('photos').updateOne(
      byId(params.photoId),
      { $set: { ...updates, updatedAt: new Date() } },
    )
    if (result.matchedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Photo update error:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}

// DELETE — remove photo from the library + Cloudinary (admin).
export async function DELETE(_req: NextRequest, props: { params: Promise<{ photoId: string }> }) {
  const params = await props.params;
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const photo = await db.collection('photos').findOne(byId(params.photoId))
    if (!photo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.collection('photos').deleteOne({ _id: photo._id })

    if (photo.cloudinaryId) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      try {
        await cloudinary.uploader.destroy(photo.cloudinaryId)
      } catch (e) {
        console.error('Cloudinary cleanup failed for', photo.cloudinaryId, e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Photo delete error:', error)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}
