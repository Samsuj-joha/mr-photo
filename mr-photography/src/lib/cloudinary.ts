// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(file: File, folder: string = "mr-photography") {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder,
          transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 1920, height: 1080, crop: "limit" }
          ]
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    console.error("Error processing file for upload:", error)
    throw error
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Error deleting image:", error)
    throw error
  }
}

export async function getImageInfo(publicId: string) {
  try {
    const result = await cloudinary.api.resource(publicId)
    return result
  } catch (error) {
    console.error("Error getting image info:", error)
    throw error
  }
}

export function getOptimizedImageUrl(publicId: string, transformations?: string) {
  return cloudinary.url(publicId, {
    transformation: transformations || "c_fill,w_800,h_600,q_auto,f_auto"
  })
}