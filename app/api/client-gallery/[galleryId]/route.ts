// src/app/api/client-gallery/[galleryId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/db/mongodb'
import { ClientGallery, GalleryAccess } from '../../../../types/client-gallery'

export async function GET(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const gallery = await db.collection<ClientGallery>('client_galleries')
      .findOne({ galleryId: params.galleryId })
    
    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
    
    // Check if expired
    if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Gallery expired' }, { status: 410 })
    }
    
    // Log access
    const accessLog: GalleryAccess = {
      galleryId: params.galleryId,
      clientEmail: gallery.clientEmail,
      accessedAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      downloadsCount: 0
    }
    
    const { _id, ...accessData } = accessLog
    await db.collection('gallery_access').insertOne(accessData)
    
    return NextResponse.json({ gallery })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}