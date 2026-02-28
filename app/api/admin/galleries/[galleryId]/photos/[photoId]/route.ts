// app/api/admin/galleries/[galleryId]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import { v2 as cloudinary } from 'cloudinary'
import clientPromise from '../../../../../../../lib/db/mongodb'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')

    // Look up the photo's cloudinaryId before removing it
    const gallery = await db.collection('client_galleries').findOne(
      { galleryId: params.galleryId }
    )

    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }

    const photo = gallery.photos?.find((p: any) => p.id === params.photoId)
    const cloudinaryId = photo?.cloudinaryId

    const result = await db.collection('client_galleries').updateOne(
      { galleryId: params.galleryId },
      {
        $pull: {
          photos: { id: params.photoId }
        } as any,
        $set: { updatedAt: new Date() }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Photo not found in gallery' }, { status: 404 })
    }

    // Clean up Cloudinary asset
    if (cloudinaryId) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      })
      try {
        await cloudinary.uploader.destroy(cloudinaryId)
      } catch (cloudinaryError) {
        // Log but don't fail — the DB record is already removed
        console.error('Cloudinary cleanup failed for', cloudinaryId, cloudinaryError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, comment } = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    if (action === 'like') {
      // Toggle like for photo
      const result = await db.collection('client_galleries').updateOne(
        { 
          galleryId: params.galleryId,
          'photos.id': params.photoId
        },
        { 
          $inc: { 'photos.$.likes': 1 } as any,
          $set: { updatedAt: new Date() }
        }
      )
      
      return NextResponse.json({ success: true })
    }
    
    if (action === 'comment' && comment) {
      // FIXED: Use type assertion for MongoDB operation
      const result = await db.collection('client_galleries').updateOne(
        { 
          galleryId: params.galleryId,
          'photos.id': params.photoId
        },
        { 
          $push: { 
            'photos.$.comments': { 
              text: comment, 
              timestamp: new Date(),
              id: Date.now().toString()
            }
          } as any,
          $set: { updatedAt: new Date() }
        }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}