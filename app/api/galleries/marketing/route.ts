import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db/mongodb'

export const dynamic = 'force-dynamic'

// Public list of MARKETING galleries (showcases for prospective clients).
// No auth: only type:'marketing' galleries are exposed, and only the fields
// needed for the /galleries index (no client emails, access codes, comments).
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const galleries = await db
      .collection('client_galleries')
      .find({ type: 'marketing' })
      .sort({ eventDate: -1 })
      .toArray()

    const cards = galleries.map((g: any) => ({
      galleryId: g.galleryId,
      eventName: g.eventName,
      description: g.description ?? '',
      eventDate: g.eventDate,
      coverUrl: g.photos?.[0]?.thumbnailUrl ?? null,
      photoCount: Array.isArray(g.photos) ? g.photos.length : 0,
    }))

    return NextResponse.json({ galleries: cards })
  } catch (error) {
    console.error('Failed to list marketing galleries:', error)
    return NextResponse.json({ error: 'Failed to load galleries' }, { status: 500 })
  }
}
