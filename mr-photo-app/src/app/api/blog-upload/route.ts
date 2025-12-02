// File: src/app/api/blog-upload/route.ts
// Blog upload API with 10MB image processing

import { NextRequest, NextResponse } from "next/server"
import { processImageForUpload } from "@/lib/imageProcessor"
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  console.log('🚀 Blog upload API called')
  
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    console.log('📁 File received:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Process image to ensure 10MB or less
    console.log('🔄 Processing image...')
    const processed = await processImageForUpload(file)
    console.log(`✅ Image processed: ${(processed.buffer.length / 1024 / 1024).toFixed(2)}MB`)

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Upload processed image to Cloudinary
    console.log('☁️ Starting Cloudinary upload...')
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'mr-photography/blog',
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:best' },
            { fetch_format: 'auto' }
          ],
          public_id: processed.fileName.replace(/\.[^/.]+$/, ''),
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(processed.buffer)
    }) as any

    if (!uploadResult) {
      throw new Error('Cloudinary upload returned no result')
    }

    console.log('✅ Upload successful:', uploadResult.secure_url)

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    })

  } catch (error) {
    console.error("💥 Upload error:", error)
    
    return NextResponse.json(
      { 
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// GET for testing
export async function GET() {
  return NextResponse.json({
    message: "Blog upload API working",
    endpoint: "/api/blog-upload"
  })
}