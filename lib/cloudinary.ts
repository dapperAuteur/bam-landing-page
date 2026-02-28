// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not set. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
};

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  resource_type: string // 'image' | 'video' | 'raw'
  duration?: number // Video duration in seconds
  pages?: number // Multi-page document page count
}

export async function uploadToCloudinary(
  file: Buffer,
  folder: string,
  publicId?: string
): Promise<CloudinaryUploadResult> {
  configureCloudinary();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `bam-photography/${folder}`,
        public_id: publicId,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        }
        else resolve(result as CloudinaryUploadResult)
      }
    ).end(file)
  })
}

export function getCloudinaryUrl(publicId: string, transformations?: string[]): string {
  configureCloudinary();
  return cloudinary.url(publicId, {
    transformations: transformations || ['q_auto', 'f_auto']
  })
}

export function getThumbnailUrl(publicId: string, width = 400, height = 400): string {
  configureCloudinary();
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
    ]
  })
}

export function getVideoThumbnailUrl(publicId: string, width = 400, height = 400): string {
  configureCloudinary();
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width, height, crop: 'fill', quality: 'auto', fetch_format: 'jpg', start_offset: '2' }
    ]
  })
}

export function getDocumentPreviewUrl(publicId: string, page = 1): string {
  configureCloudinary();
  return cloudinary.url(publicId, {
    transformation: [
      { page, width: 400, height: 400, crop: 'fill', quality: 'auto', fetch_format: 'jpg' }
    ]
  })
}

export function getVideoStreamUrl(publicId: string): string {
  configureCloudinary();
  return cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ]
  })
}

/** Determine MediaType from MIME type string */
export function getMediaTypeFromMime(mimeType: string): 'image' | 'video' | 'document' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  return 'document'
}

/** Map MediaType to Cloudinary resource_type */
export function getResourceType(mediaType: 'image' | 'video' | 'document'): string {
  if (mediaType === 'video') return 'video'
  if (mediaType === 'document') return 'raw'
  return 'image'
}