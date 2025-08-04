import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// POST - Upload book files (cover image or PDF)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'cover' or 'pdf'

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type based on upload type
    if (type === 'cover') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: "Cover must be an image file" }, { status: 400 })
      }
    } else if (type === 'pdf') {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (max 50MB for PDFs, 10MB for images)
    const maxSize = type === 'pdf' ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      const maxSizeMB = type === 'pdf' ? '50MB' : '10MB'
      return NextResponse.json({ error: `File size must be less than ${maxSizeMB}` }, { status: 400 })
    }

    console.log(`🔄 Uploading ${type}: ${file.name}`)

    if (type === 'cover') {
      // Upload cover images to Cloudinary
      const folder = 'mr-photography/books/covers'
      const uploadResult = await uploadImage(file, folder)

      console.log(`✅ Cover image uploaded to Cloudinary:`, uploadResult.secure_url)

      return NextResponse.json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
        type: type
      })
    } else if (type === 'pdf') {
      // Store PDFs locally for better inline viewing control
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const filename = `${timestamp}-${randomId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      // Ensure the upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs')
      try {
        await mkdir(uploadDir, { recursive: true })
      } catch (error) {
        // Directory might already exist, that's fine
      }

      // Write the file
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)

      // Create the public URL
      const publicUrl = `/uploads/pdfs/${filename}`

      console.log(`✅ PDF uploaded locally: ${filename}`)

      return NextResponse.json({
        url: publicUrl,
        publicId: filename, // Use filename as publicId for deletion
        size: file.size,
        type: 'pdf',
        filename: filename
      })
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

// DELETE - Remove file
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

    console.log(`🗑️ Deleting file: ${publicId}`)
    
    // Check if it's a local file (PDF) or Cloudinary file (image)
    if (publicId.includes('.pdf')) {
      // Local PDF file
      const filepath = path.join(process.cwd(), 'public', 'uploads', 'pdfs', publicId)
      
      try {
        const { unlink } = await import('fs/promises')
        await unlink(filepath)
        console.log('✅ Local PDF deleted successfully')
      } catch (error) {
        console.log('⚠️ File might not exist:', error)
      }
    } else {
      // Cloudinary file
      const result = await deleteImage(publicId)
      console.log('✅ Cloudinary file deleted:', result)
    }
    
    return NextResponse.json({ 
      success: true
    })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    )
  }
}