import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// POST - Upload PDF to local storage
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
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 50MB" }, { status: 400 })
    }

    console.log(`🔄 Uploading PDF: ${file.name}`)

    // Convert file to buffer
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

    console.log(`✅ PDF uploaded successfully: ${filename}`)

    return NextResponse.json({
      url: publicUrl,
      publicId: filename, // Use filename as publicId for deletion
      size: file.size,
      type: 'pdf',
      filename: filename
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    )
  }
}

// DELETE - Remove PDF file
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { publicId } = await request.json()

    if (!publicId) {
      return NextResponse.json({ error: "File ID required" }, { status: 400 })
    }

    console.log(`🗑️ Deleting PDF: ${publicId}`)
    
    // Delete the file from local storage
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'pdfs', publicId)
    
    try {
      const { unlink } = await import('fs/promises')
      await unlink(filepath)
      console.log('✅ PDF deleted successfully')
    } catch (error) {
      console.log('⚠️ File might not exist:', error)
    }
    
    return NextResponse.json({ 
      success: true
    })
  } catch (error) {
    console.error("Error deleting PDF:", error)
    return NextResponse.json(
      { error: "Failed to delete PDF" },
      { status: 500 }
    )
  }
}