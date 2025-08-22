// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

export async function uploadToCloudinary(
  file: Buffer,
  folder: string,
  publicId?: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `bam-photography/${folder}`,
        public_id: publicId,
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result as CloudinaryUploadResult)
      }
    ).end(file)
  })
}

export function getCloudinaryUrl(publicId: string, transformations?: string[]): string {
  return cloudinary.url(publicId, {
    transformations: transformations || ['q_auto', 'f_auto']
  })
}

export function getThumbnailUrl(publicId: string, width = 400, height = 400): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
    ]
  })
}