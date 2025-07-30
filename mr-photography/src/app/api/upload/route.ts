// Now replace your src/app/api/upload/route.ts with this working version
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("🚀 POST Upload API Hit!")
  
  try {
    console.log("📨 Step 1: Request received")
    
    // Step 1: Check session
    console.log("🔐 Step 2: Checking session...")
    const session = await getServerSession(authOptions)
    console.log("Session result:", session ? "✅ Found" : "❌ Not found")
    
    if (!session) {
      console.log("❌ No session - returning 401")
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      )
    }
    
    if (session.user.role !== "ADMIN") {
      console.log("❌ Not admin - returning 401")
      return NextResponse.json(
        { error: "Not admin" },
        { status: 401 }
      )
    }
    
    // Step 2: Parse form data
    console.log("📋 Step 3: Parsing form data...")
    const formData = await request.formData()
    const file = formData.get("file") as File
    const galleryId = formData.get("galleryId") as string
    const alt = formData.get("alt") as string || ""
    const caption = formData.get("caption") as string || ""
    
    console.log("File info:", file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : "No file found")
    console.log("Gallery ID:", galleryId || "Not provided (slider upload)")
    
    if (!file) {
      console.log("❌ No file - returning 400")
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log("❌ Invalid file type:", file.type)
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      console.log("❌ File too large:", file.size)
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      )
    }
    
    console.log("✅ File validation passed")
    
    // Step 3: Determine upload type and folder
    let uploadFolder = 'mr-photography'
    
    if (galleryId) {
      console.log("🖼️ Gallery upload detected, checking gallery...")
      
      try {
        const gallery = await db.gallery.findUnique({
          where: { id: galleryId }
        })

        if (!gallery) {
          console.log("❌ Gallery not found:", galleryId)
          return NextResponse.json(
            { error: "Gallery not found" },
            { status: 404 }
          )
        }
        
        uploadFolder = `mr-photography/galleries/${galleryId}`
        console.log("✅ Gallery found, upload folder:", uploadFolder)
      } catch (dbError) {
        console.log("❌ Database error checking gallery:", dbError)
        return NextResponse.json(
          { error: "Database error" },
          { status: 500 }
        )
      }
    } else {
      uploadFolder = 'mr-photography/home-slider'
      console.log("🏠 Slider upload detected, upload folder:", uploadFolder)
    }
    
    // Step 4: Upload to Cloudinary
    console.log("☁️ Step 4: Starting Cloudinary upload...")
    
    let uploadResult
    try {
      uploadResult = await uploadImage(file, uploadFolder) as any
      console.log("✅ Cloudinary upload successful:", {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height
      })
    } catch (cloudinaryError) {
      console.log("❌ Cloudinary upload failed:", cloudinaryError)
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }
    
    if (!uploadResult) {
      console.log("❌ No upload result from Cloudinary")
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      )
    }
    
    // Step 5: Handle different upload types
    if (galleryId) {
      console.log("💾 Step 5: Saving gallery image to database...")
      
      try {
        // Get the current highest order in the gallery
        const lastImage = await db.galleryImage.findFirst({
          where: { galleryId },
          orderBy: { order: 'desc' }
        })

        const nextOrder = lastImage ? lastImage.order + 1 : 0

        // Save to database
        const galleryImage = await db.galleryImage.create({
          data: {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            alt,
            caption,
            order: nextOrder,
            galleryId,
          }
        })

        console.log("✅ Gallery image saved to database")
        
        return NextResponse.json({
          id: galleryImage.id,
          url: galleryImage.url,
          publicId: galleryImage.publicId,
          alt: galleryImage.alt,
          caption: galleryImage.caption,
          order: galleryImage.order,
          galleryId: galleryImage.galleryId,
          createdAt: galleryImage.createdAt,
        }, { status: 201 })
      } catch (dbError) {
        console.log("❌ Database error saving gallery image:", dbError)
        return NextResponse.json(
          { error: "Database error saving image" },
          { status: 500 }
        )
      }
    } else {
      console.log("🏠 Step 5: Returning slider upload result")
      
      return NextResponse.json({
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        message: "Image uploaded successfully to Cloudinary"
      })
    }
    
  } catch (error) {
    console.log("💥 Unexpected error in upload API:", error)
    console.log("Error details:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.slice(0, 500) : 'No stack'
    })
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  console.log("🚀 GET Upload API Hit!")
  return NextResponse.json({
    message: "Upload API is running",
    timestamp: new Date().toISOString()
  })
}