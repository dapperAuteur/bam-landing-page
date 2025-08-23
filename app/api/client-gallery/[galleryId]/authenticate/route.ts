// src/app/api/client-gallery/[galleryId]/authenticate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from './../../../../../lib/db/mongodb'
import { ClientGallery } from './../../../../../types/client-gallery'

export async function POST(
  request: NextRequest,
  { params }: { params: { galleryId: string } }
) {
  try {
    const { accessCode } = await request.json()
    const client = await clientPromise
    const db = client.db()
    
    // const gallery = await db.collection<ClientGallery>('client_galleries')
    console.log('accessCode :>> ', accessCode);
    const gallery = await db.collection('client_galleries')
      .findOne({ galleryId: params.galleryId })
    
    if (!gallery || gallery.accessCode !== accessCode) {
      return NextResponse.json({ error: 'Invalid access code' }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true,
      gallery: {
        galleryId: gallery.galleryId,
        eventName: gallery.eventName,
        clientName: gallery.clientName,
        eventDate: gallery.eventDate,
        description: gallery.description,
        photos: gallery.photos || [],
        settings: gallery.settings
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}