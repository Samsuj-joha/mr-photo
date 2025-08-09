
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
    
    // Check if this is a PDF
    const isPDF = file.type === 'application/pdf'
    
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: folder,
        resource_type: isPDF ? 'raw' : 'auto', // Use 'raw' for PDFs
        timeout: 300000, // 5 minutes
        chunk_size: 6000000, // 6MB chunks for large file uploads
      }

      // Only add transformations for images, not PDFs
      if (!isPDF) {
        uploadOptions.transformation = [
          { quality: 'auto:best' },
          { fetch_format: 'auto' }
        ]
        uploadOptions.eager = [
          { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
          { width: 800, height: 600, crop: 'limit', quality: 'auto:good' }
        ]
        uploadOptions.eager_async = true
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.log('❌ Cloudinary upload error:', error)
            reject(error)
          } else {
            console.log('✅ Cloudinary upload success:', result?.public_id)
            console.log('📄 Resource type:', result?.resource_type)
            console.log('🔗 URL:', result?.secure_url)
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
    console.log(`🗑️ Deleting file: ${publicId}`)
    
    // Try deleting as image first, then as raw file
    let result
    try {
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
      if (result.result === 'not found') {
        throw new Error('Not found as image')
      }
    } catch (imageError) {
      console.log('📄 Trying to delete as raw file...')
      result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
    }
    
    console.log('✅ File deleted:', result)
    return result
  } catch (error) {
    console.log('❌ Error deleting file:', error)
    throw error
  }
}

export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error) {
    console.log('❌ Error getting file info:', error)
    throw error
  }
}

export { cloudinary }