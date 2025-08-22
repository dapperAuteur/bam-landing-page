import { NextRequest, NextResponse } from 'next/server'
import clientPromise from './../../../../../../lib/db/mongodb'
import { ClientGallery } from './../../../../../../types/client-gallery'

export async function POST(
  request: NextRequest,
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const gallery = await db.collection<ClientGallery>('client_galleries')
      .findOne({ galleryId: params.galleryId })
    
    if (!gallery || !gallery.settings.allowDownloads) {
      return NextResponse.json({ error: 'Downloads not allowed' }, { status: 403 })
    }
    
    const photo = gallery.photos.find(p => p.id === params.photoId)
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    
    // Log download
    await db.collection('gallery_access').updateOne(
      { 
        galleryId: params.galleryId,
        accessedAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
      },
      { 
        $inc: { downloadsCount: 1 },
        $set: { lastDownloadAt: new Date() }
      }
    )
    
    // Fetch from Cloudinary and return
    const imageResponse = await fetch(
      gallery.settings.allowFullSize ? photo.originalUrl : photo.thumbnailUrl
    )
    
    const imageBuffer = await imageResponse.arrayBuffer()
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="${gallery.eventName}-${photo.title || photo.id}.jpg"`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}