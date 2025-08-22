import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../lib/db/mongodb'
import { ClientGallery } from '../../../../types/client-gallery'

// GET - Fetch all galleries
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    
    const galleries = await db.collection<ClientGallery>('client_galleries')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    return NextResponse.json({ galleries })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 })
  }
}

// POST - Create new gallery
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const client = await clientPromise
    const db = client.db()
    
    const galleryId = `${data.clientName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    
    const gallery: ClientGallery = {
      galleryId,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      eventName: data.eventName,
      eventDate: data.eventDate,
      description: data.description,
      photos: [],
      settings: data.settings,
      accessCode: data.accessCode,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const { _id, ...galleryData } = gallery
    await db.collection('client_galleries').insertOne(galleryData)
    return NextResponse.json({ gallery })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 })
  }
}