// File: /src/lib/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary'

// Check if environment variables are set
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('CLOUDINARY_CLOUD_NAME is not set in environment variables')
}
if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error('CLOUDINARY_API_KEY is not set in environment variables')
}
if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error('CLOUDINARY_API_SECRET is not set in environment variables')
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

console.log('Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME)

// Upload image function
export async function uploadImage(file: File, folder?: string) {
  try {
    console.log('Starting upload process...')
    console.log('File details:', { name: file.name, size: file.size, type: file.type })

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    console.log('File converted to base64, length:', base64.length)

    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...')
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder || 'mr-photography',
      resource_type: 'auto',
      quality: 'auto:good',
      // Removed format: 'auto' - this causes "Invalid extension" error
    })

    console.log('Cloudinary upload successful:', result.secure_url)
    return result

  } catch (error) {
    console.error('Detailed Cloudinary upload error:', error)
    
    // Log more specific error details
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    throw new Error(`Cloudinary upload failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Delete image function
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw new Error('Failed to delete image')
  }
}

// Get optimized image URL
export function getOptimizedImageUrl(publicId: string, options?: {
  width?: number
  height?: number
  crop?: string
  quality?: string
}) {
  return cloudinary.url(publicId, {
    width: options?.width,
    height: options?.height,
    crop: options?.crop || 'fill',
    quality: options?.quality || 'auto:good',
    // Removed format: 'auto' - this causes issues
  })
}

export default cloudinary