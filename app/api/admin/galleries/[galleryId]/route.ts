import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '../../../../../lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
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
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db('bam_portfolio')
  
  // Delete from database
  await db.collection('client_galleries').deleteOne({ galleryId: params.galleryId })
  
  // Delete from Cloudinary folder
  await cloudinary.api.delete_resources_by_prefix(`bam-photography/galleries/${params.galleryId}`)
  
  return NextResponse.json({ success: true })
}