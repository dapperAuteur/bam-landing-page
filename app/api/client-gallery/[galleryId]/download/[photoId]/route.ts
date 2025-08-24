import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../../../../../lib/db/mongodb'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(
  request: NextRequest,
  { params }: { params: { galleryId: string; photoId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('bam_portfolio')
    
    // Find the gallery and photo
    const gallery = await db.collection('client_galleries').findOne({
      galleryId: params.galleryId
    })
    
    if (!gallery || !gallery.settings?.allowDownloads) {
      return NextResponse.json({ error: 'Downloads not allowed' }, { status: 403 })
    }
    
    // Decode the photoId (it comes URL encoded)
    const decodedPhotoId = decodeURIComponent(params.photoId)
    
    // Find the specific photo
    const photo = gallery.photos?.find((p: any) => 
      p.id === decodedPhotoId || 
      p.cloudinaryId === decodedPhotoId ||
      p.cloudinaryId?.includes(decodedPhotoId)
    )
    
    if (!photo) {
      console.log(`Photo not found: ${decodedPhotoId}`)
      console.log('Available photos:', gallery.photos?.map((p: any) => ({ id: p.id, cloudinaryId: p.cloudinaryId })))
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }
    
    try {
      // Get the image from Cloudinary
      const cloudinaryId = photo.cloudinaryId || photo.id
      const imageUrl = cloudinary.url(cloudinaryId, {
        quality: 'auto:best',
        fetch_format: 'auto'
      })
      
      // Fetch the image
      const imageResponse = await fetch(imageUrl)
      
      if (!imageResponse.ok) {
        // If Cloudinary fetch fails, try the original URL
        const originalResponse = await fetch(photo.originalUrl || photo.thumbnailUrl)
        if (!originalResponse.ok) {
          throw new Error('Failed to fetch image from both Cloudinary and original URL')
        }
        
        const imageBuffer = await originalResponse.arrayBuffer()
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Content-Disposition': `attachment; filename="${gallery.eventName}-${photo.title || photo.id}.jpg"`
          }
        })
      }
      
      const imageBuffer = await imageResponse.arrayBuffer()
      
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${gallery.eventName}-${photo.title || photo.id}.jpg"`
        }
      })
      
    } catch (imageError) {
      console.error('Error fetching image:', imageError)
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}