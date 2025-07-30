// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  console.log("🚀 Upload API called")
  
  try {
    // Step 1: Check environment variables first
    console.log("🔧 Checking environment variables...")
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    console.log("Environment check:", {
      cloudName: cloudName ? "✅ Set" : "❌ Missing",
      apiKey: apiKey ? "✅ Set" : "❌ Missing", 
      apiSecret: apiSecret ? "✅ Set" : "❌ Missing"
    })
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.log("❌ Missing Cloudinary environment variables")
      return NextResponse.json(
        { 
          error: "Server configuration error - missing Cloudinary credentials",
          details: {
            cloudName: !cloudName ? "missing" : "ok",
            apiKey: !apiKey ? "missing" : "ok",
            apiSecret: !apiSecret ? "missing" : "ok"
          }
        },
        { status: 500 }
      )
    }
    
    // Step 2: Check authentication
    console.log("🔐 Checking authentication...")
    let session
    try {
      session = await getServerSession(authOptions)
      console.log("Session:", session ? "✅ Valid" : "❌ None")
    } catch (authError) {
      console.log("❌ Auth error:", authError)
      return NextResponse.json(
        { error: "Authentication error", details: String(authError) },
        { status: 500 }
      )
    }
    
    if (!session || session.user.role !== "ADMIN") {
      console.log("❌ Unauthorized access")
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }
    
    // Step 3: Parse form data
    console.log("📋 Parsing form data...")
    let formData, file
    try {
      formData = await request.formData()
      file = formData.get("file") as File
      console.log("File received:", file ? `✅ ${file.name} (${file.size} bytes)` : "❌ No file")
    } catch (parseError) {
      console.log("❌ Form data parse error:", parseError)
      return NextResponse.json(
        { error: "Failed to parse form data", details: String(parseError) },
        { status: 400 }
      )
    }
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }
    
    // Step 4: Simple Cloudinary upload without external function
    console.log("☁️ Uploading to Cloudinary...")
    
    try {
      // Dynamic import to avoid module loading issues
      const { v2: cloudinary } = await import('cloudinary')
      
      // Configure here to ensure it's set
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      })
      
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'mr-photography/uploads',
            resource_type: 'auto',
            transformation: [
              { quality: 'auto:best' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.log('❌ Cloudinary error:', error)
              reject(error)
            } else {
              console.log('✅ Cloudinary success:', result?.public_id)
              resolve(result)
            }
          }
        ).end(buffer)
      }) as any
      
      console.log("📤 Upload completed successfully")
      
      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        uploadDetails: {
          size: file.size,
          sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
          dimensions: `${uploadResult.width}x${uploadResult.height}`,
          format: uploadResult.format
        },
        message: "Upload successful"
      })
      
    } catch (cloudinaryError) {
      console.log("❌ Cloudinary upload failed:", cloudinaryError)
      return NextResponse.json(
        { 
          error: "Cloudinary upload failed", 
          details: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.log("💥 Unexpected error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack?.slice(0, 500) : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  console.log("🚀 GET Upload API test")
  
  // Test environment variables
  const envCheck = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
    apiKey: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing",
    apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing"
  }
  
  return NextResponse.json({
    message: "Upload API is running",
    timestamp: new Date().toISOString(),
    environment: envCheck,
    status: "OK"
  })
}