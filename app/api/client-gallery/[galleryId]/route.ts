import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/db/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const gallery = await db.collection('client_galleries')
      .findOne({ galleryId: params.galleryId })
    
    if (!gallery) {
      return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
    }
    
    // Check if expired
    if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Gallery expired' }, { status: 410 })
    }
    
    return NextResponse.json({
      gallery: {
        galleryId: gallery.galleryId,
        eventName: gallery.eventName,
        clientName: gallery.clientName,
        eventDate: gallery.eventDate,
        description: gallery.description,
        settings: gallery.settings,
        photos: gallery.settings.requirePassword ? [] : gallery.photos || []
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}