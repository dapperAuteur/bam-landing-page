// src/app/api/photos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../lib/db/mongodb'
import { uploadToCloudinary, getThumbnailUrl } from '../../../lib/cloudinary'
import { Photo } from '../../../types/photo'

// GET - Fetch photos with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tags = searchParams.get('tags')?.split(',')
    const portfolio = searchParams.get('portfolio') === 'true'
    const galleryId = searchParams.get('galleryId')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // Build query
    const query: any = {}
    if (category && category !== 'all') {
      query.category = category
    }
    if (tags?.length) {
      query.tags = { $in: tags }
    }
    if (portfolio) {
      query['usedIn.portfolio'] = true
    }
    if (galleryId) {
      query['usedIn.galleries'] = galleryId
    }
    
    const photos = await db.collection<Photo>('photos')
      .find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .toArray()
    
    return NextResponse.json({ 
      photos: photos.map(photo => ({
        ...photo,
        id: photo._id?.toString() || photo.id
      }))
    })
  } catch (error) {
    console.error('Photos fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST - Upload new photos
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const category = (formData.get('category') as string) || 'other'
    const tags = JSON.parse((formData.get('tags') as string) || '[]')
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const portfolioUse = formData.get('portfolio') === 'true'
    const galleryId = formData.get('galleryId') as string
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const uploadPromises = files.map(async (file, index) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      
      // Upload to cloudinary with organized folder structure
      const folder = `bam-photography/${category}`
      const publicId = `${Date.now()}-${index}-${file.name.replace(/\.[^/.]+$/, '')}`
      
      const result = await uploadToCloudinary(buffer, folder, publicId)
      
      const photo: Omit<Photo, 'id'> = {
        cloudinaryId: result.public_id,
        originalUrl: result.secure_url,
        thumbnailUrl: getThumbnailUrl(result.public_id),
        title: title || file.name,
        description: description || undefined,
        tags: tags.length > 0 ? tags : [category],
        category: category as Photo['category'],
        metadata: {
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes
        },
        usedIn: {
          galleries: galleryId ? [galleryId] : [],
          blogs: [],
          portfolio: portfolioUse
        },
        uploadedAt: new Date(),
        updatedAt: new Date()
      }
      
      const insertResult = await db.collection('photos').insertOne(photo)
      return {
        ...photo,
        id: insertResult.insertedId.toString()
      }
    })
    
    const photos = await Promise.all(uploadPromises)
    
    // If uploading to a gallery, add photo IDs to gallery
    if (galleryId) {
      await db.collection('client_galleries').updateOne(
        { galleryId },
        { 
          $addToSet: { 
            photoIds: { $each: photos.map(p => p.id) }
          },
          $set: { updatedAt: new Date() }
        }
      )
    }
    
    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}