// app/api/admin/galleries/[galleryId]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../../../../lib/db/mongodb'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // FIXED: Use type assertion for MongoDB operation
    const result = await db.collection('client_galleries').updateOne(
      { galleryId: params.galleryId },
      { 
        $pull: { 
          photos: { id: params.photoId }
        } as any,
        $set: { updatedAt: new Date() }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
    
    // TODO: Also delete from Cloudinary if using cloud storage
    // await cloudinary.uploader.destroy(params.photoId)
    
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