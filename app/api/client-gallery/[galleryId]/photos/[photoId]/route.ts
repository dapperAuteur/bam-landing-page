// app/api/client-gallery/[galleryId]/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from './../../../../../../lib/db/mongodb'

export async function POST(
  request: NextRequest, 
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const { action, comment, isFavorite } = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    if (action === 'comment' && comment) {
      // FIXED: Use type assertion for MongoDB operation
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        { 
          $push: { 
            'photos.$.comments': { 
              text: comment, 
              timestamp: new Date(),
              id: Date.now().toString()
            }
          } as any 
        }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }
    }
    
    if (action === 'favorite') {
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        { $set: { 'photos.$.isFavorite': isFavorite } as any }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }
    }
    
    if (action === 'like') {
      const result = await db.collection('client_galleries').updateOne(
        { galleryId: params.galleryId, 'photos.id': params.photoId },
        { $inc: { 'photos.$.likes': 1 } as any }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}