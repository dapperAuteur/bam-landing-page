import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../../lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    const data = await request.json()
    const client = await clientPromise
    const db = client.db()
    
    const { _id, ...updateData } = data
    await db.collection('client_galleries').updateOne(
      { galleryId: params.galleryId },
      { $set: { ...updateData, updatedAt: new Date() } }
    )
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { galleryId: string } }) {
  const client = await clientPromise
  const db = client.db()
  
  // Delete from database
  await db.collection('client_galleries').deleteOne({ galleryId: params.galleryId })
  
  // Delete from Cloudinary folder
  await cloudinary.api.delete_resources_by_prefix(`bam-photography/galleries/${params.galleryId}`)
  
  return NextResponse.json({ success: true })
}