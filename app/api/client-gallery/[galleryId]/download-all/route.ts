import archiver from 'archiver'
import { NextRequest, NextResponse } from 'next/server'
import clientPromise from './../../../../../lib/db/mongodb'
import { checkDownloadRateLimit, recordDownload } from './../../../../../lib/utils/download-rate-limit'

export async function POST(request: NextRequest, { params }: { params: { galleryId: string } }) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    const gallery = await db.collection('client_galleries').findOne({ galleryId: params.galleryId })

    if (!gallery?.settings.allowDownloads) {
      return NextResponse.json({ error: 'Downloads not allowed' }, { status: 403 })
    }

    // Enforce download rate limiting (bulk download counts as number of photos)
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const photoCount = gallery.photos?.length || 0
    if (gallery.settings.downloadsPerSession) {
      const { allowed } = await checkDownloadRateLimit(
        db, params.galleryId, ipAddress, gallery.settings.downloadsPerSession
      )
      if (!allowed) {
        return NextResponse.json(
          { error: 'Download limit reached. Please try again later.' },
          { status: 429 }
        )
      }
    }

    const archive = archiver('zip')
    const chunks: Buffer[] = []

    archive.on('data', (chunk) => chunks.push(chunk))

    for (const photo of gallery.photos) {
      const response = await fetch(photo.originalUrl)
      const buffer = await response.arrayBuffer()
      const ext = photo.metadata?.format || photo.mimeType?.split('/').pop() || 'jpg'
      archive.append(Buffer.from(buffer), { name: `${photo.title || photo.id}.${ext}` })
    }

    await archive.finalize()

    // Record downloads for rate limiting (one per photo in the zip)
    for (let i = 0; i < photoCount; i++) {
      await recordDownload(db, params.galleryId, ipAddress)
    }

    return new NextResponse(Buffer.concat(chunks), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${gallery.eventName}.zip"`
      }
    })
  } catch (error) {
    console.error('Download-all error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}