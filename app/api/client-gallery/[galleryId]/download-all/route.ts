import archiver from 'archiver'
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from './../../../../../lib/db/mongodb'

export async function POST(request: NextRequest, { params }: { params: { galleryId: string } }) {
  const client = await clientPromise
  const db = client.db('bam_portfolio')
  const gallery = await db.collection('client_galleries').findOne({ galleryId: params.galleryId })
  
  if (!gallery?.settings.allowDownloads) {
    return NextResponse.json({ error: 'Downloads not allowed' }, { status: 403 })
  }
  
  const archive = archiver('zip')
  const chunks: Buffer[] = []
  
  archive.on('data', (chunk) => chunks.push(chunk))
  
  for (const photo of gallery.photos) {
    const response = await fetch(photo.originalUrl)
    const buffer = await response.arrayBuffer()
    archive.append(Buffer.from(buffer), { name: `${photo.title || photo.id}.jpg` })
  }
  
  await archive.finalize()
  
  return new NextResponse(Buffer.concat(chunks), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${gallery.eventName}.zip"`
    }
  })
}