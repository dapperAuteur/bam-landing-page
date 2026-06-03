import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth/authOptions'
import clientPromise from '../../../../lib/db/mongodb'
import { ClientGallery } from '../../../../types/client-gallery'
import { fireOutboxDrafts } from '@/lib/outbox-trigger'
import { buildGalleryCaption } from '@/lib/blog/caption'

// GET - Fetch all galleries
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
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
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    const galleryId = `${data.clientName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    
    const gallery: ClientGallery = {
      galleryId,
      type: data.type === 'marketing' ? 'marketing' : 'client',
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

    // Marketing galleries are public showcases → announce via the Outbox
    // (coming-soon draft for review). Private client-delivery galleries never
    // fire — they're not for broadcast.
    if (gallery.type === 'marketing' && session.user?.id) {
      fireOutboxDrafts({
        triggerUserId: session.user.id,
        externalRefBase: `bam-gallery-${galleryId}`,
        caption: buildGalleryCaption({
          galleryId,
          eventName: gallery.eventName,
          description: gallery.description,
        }),
        platforms: ['linkedin', 'twitter', 'bluesky'],
        asDraft: true,
      })
    }

    return NextResponse.json({ gallery })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 })
  }
}