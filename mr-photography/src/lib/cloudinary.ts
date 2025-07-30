// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImage(file: File, folder: string = 'mr-photography') {
  try {
    console.log(`🔄 Starting upload for ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`)
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          transformation: [
            // Auto-optimize for web delivery
            { quality: 'auto:best' },
            { fetch_format: 'auto' }
          ],
          // Extended timeout for large files
          timeout: 300000, // 5 minutes
          // Allow large files
          chunk_size: 6000000, // 6MB chunks for large file uploads
          eager: [
            // Generate optimized versions
            { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
            { width: 800, height: 600, crop: 'limit', quality: 'auto:good' }
          ],
          eager_async: true, // Process transformations in background
        },
        (error, result) => {
          if (error) {
            console.log('❌ Cloudinary upload error:', error)
            reject(error)
          } else {
            console.log('✅ Cloudinary upload success:', result?.public_id)
            resolve(result)
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    console.log('❌ Error in uploadImage function:', error)
    throw error
  }
}

export async function deleteImage(publicId: string) {
  try {
    console.log(`🗑️ Deleting image: ${publicId}`)
    const result = await cloudinary.uploader.destroy(publicId)
    console.log('✅ Image deleted:', result)
    return result
  } catch (error) {
    console.log('❌ Error deleting image:', error)
    throw error
  }
}

export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error) {
    console.log('❌ Error getting image info:', error)
    throw error
  }
}

export { cloudinary }