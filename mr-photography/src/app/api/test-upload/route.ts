// File: /src/app/api/test-upload/route.ts

import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary directly in this file for testing
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== Test Upload API Called ===")
    console.log("Environment check:", {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
      apiSecret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing"
    })
    
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("❌ No file provided")
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    console.log("📁 File received:", {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log("❌ Invalid file type:", file.type)
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.log("❌ File too large:", file.size)
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }

    console.log("🔄 Converting file to base64...")

    try {
      // Convert file to base64
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const dataURI = `data:${file.type};base64,${base64}`

      console.log("✅ File converted to base64, length:", base64.length)
      console.log("🚀 Starting Cloudinary upload...")

      // Upload directly with cloudinary
      const uploadResult = await cloudinary.uploader.upload(dataURI, {
        folder: "mr-photography/test",
        resource_type: 'auto',
        quality: 'auto:good',
        // Removed format: 'auto' - this was causing the error
      })

      console.log("🎉 Upload successful!")
      console.log("URL:", uploadResult.secure_url)
      console.log("Public ID:", uploadResult.public_id)

      return NextResponse.json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        message: "Upload successful!"
      }, { status: 201 })

    } catch (cloudinaryError) {
      console.error("💥 Cloudinary upload error:")
      console.error("Error object:", cloudinaryError)
      
      // Try to extract meaningful error info
      let errorMessage = "Unknown Cloudinary error"
      let errorDetails = {}
      
      if (cloudinaryError && typeof cloudinaryError === 'object') {
        console.error("Error keys:", Object.keys(cloudinaryError))
        
        if ('message' in cloudinaryError) {
          errorMessage = String(cloudinaryError.message)
        }
        if ('error' in cloudinaryError) {
          errorDetails = cloudinaryError.error
          console.error("Cloudinary error details:", errorDetails)
        }
        if ('http_code' in cloudinaryError) {
          console.error("HTTP code:", cloudinaryError.http_code)
        }
      }
      
      return NextResponse.json(
        { 
          error: "Cloudinary upload failed", 
          details: errorMessage,
          cloudinaryError: errorDetails
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("💥 General API error:")
    console.error("Error type:", typeof error)
    console.error("Error:", error)
    
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    
    return NextResponse.json(
      { 
        error: "API failed", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}