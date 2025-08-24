// src/app/api/photos/[photoId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import clientPromise from '../../../../lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary'

// GET - Fetch single photo
export async function GET(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const photo = await db.collection('photos')
      .findOne({ _id: new ObjectId(params.photoId) })
    
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    
    return NextResponse.json({ 
      photo: {
        ...photo,
        id: photo._id.toString()
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photo' }, { status: 500 })
  }
}

// PUT - Update photo metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const updateData = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // Remove id and _id from update data
    const { id, _id, ...safeUpdateData } = updateData
    
    const result = await db.collection('photos').updateOne(
      { _id: new ObjectId(params.photoId) },
      { 
        $set: {
          ...safeUpdateData,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}

// DELETE - Delete photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { photoId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // Get photo details before deletion
    const photo = await db.collection('photos')
      .findOne({ _id: new ObjectId(params.photoId) })
    
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    
    // FIXED: Remove photo from all galleries that reference it with proper type assertion
    await db.collection('client_galleries').updateMany(
      { photoIds: params.photoId },
      { 
        $pull: { photoIds: params.photoId } as any,
        $set: { updatedAt: new Date() }
      }
    )
    
    // Delete from database
    await db.collection('photos').deleteOne({ _id: new ObjectId(params.photoId) })
    
    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(photo.cloudinaryId)
    } catch (cloudinaryError) {
      console.warn('Failed to delete from Cloudinary:', cloudinaryError)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 })
  }
}