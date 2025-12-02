import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deleteImage } from "@/lib/cloudinary"
import { processImageForUpload } from "@/lib/imageProcessor"
import { v2 as cloudinary } from 'cloudinary'

// POST - Upload profile image
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    console.log(`🔄 Processing profile image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

    // Process image to ensure 10MB or less
    const processed = await processImageForUpload(file)
    console.log(`✅ Image processed: ${(processed.buffer.length / 1024 / 1024).toFixed(2)}MB`)

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    // Upload processed image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'mr-photography/about',
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

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      size: uploadResult.bytes
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}

// DELETE - Remove image
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "Public ID required" }, { status: 400 })
    }

    console.log(`🗑️ Deleting image: ${publicId}`)
    
    const result = await deleteImage(publicId)
    
    return NextResponse.json({ 
      success: true,
      result 
    })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}