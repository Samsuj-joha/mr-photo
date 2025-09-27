// File: src/app/api/blog-upload/route.ts
// Simple blog upload API using your existing uploadImage function

import { NextRequest, NextResponse } from "next/server"
import { uploadImage } from "@/lib/cloudinary"

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

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    // Upload using your existing function
    console.log('☁️ Starting Cloudinary upload...')
    const uploadResult = await uploadImage(file, "mr-photography/blog") as any

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