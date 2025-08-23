import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, getThumbnailUrl } from '../../../../../../lib/cloudinary'
import clientPromise from '../../../../../../lib/db/mongodb'

export async function POST(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  console.log('Upload request received for gallery:', params.galleryId)
  try {
    const formData = await request.formData()
    const files = formData.getAll('photos') as File[]
    console.log('Files received:', files.length)
    for (const file of files) {
      console.log('File:', file.name, 'Size:', file.size)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `File ${file.name} too large` }, { status: 400 })
      }
    }
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db()
    
    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      
      const result = await uploadToCloudinary(
        buffer,
        `galleries/${params.galleryId}`,
        `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`
      )
      
      return {
        id: result.public_id.split('/').pop(),
        cloudinaryId: result.public_id,
        originalUrl: result.secure_url,
        thumbnailUrl: getThumbnailUrl(result.public_id),
        title: file.name,
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        },
        uploadedAt: new Date()
      }
    })
    
    const photos = await Promise.all(uploadPromises)
    
    await db.collection('client_galleries').updateOne(
      { galleryId: params.galleryId },
      { $addToSet: { photos: { $each: photos } } } as any
    )
    
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Upload error details:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

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