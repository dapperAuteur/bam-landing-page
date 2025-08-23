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