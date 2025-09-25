// src/app/api/admin/blogs/[id]/route.ts - ENHANCED with TIFF Support & Compression
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { convertImageToJPEG, optimizeImage } from "@/lib/imageConverter"

// GET - Fetch single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const blog = await db.blog.findUnique({
      where: { id }
    })

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    )
  }
}

// PATCH - Update blog with ENHANCED image processing
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔄 Blog update API called with TIFF support")
  
  try {
    const { id } = await params
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    // Check if this is a simple toggle request (JSON) or full update (FormData)
    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      // Handle simple JSON updates (toggles)
      const body = await request.json()
      
      const updatedBlog = await db.blog.update({
        where: { id },
        data: body
      })

      return NextResponse.json(updatedBlog)
    }
    
    // Handle FormData updates with image processing
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Server configuration error - missing Cloudinary credentials" },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const excerpt = formData.get('excerpt') as string
    const content = formData.get('content') as string
    const coverImageFile = formData.get('coverImage') as File | null
    const tags = formData.get('tags') as string
    const featured = formData.get('featured') === 'true'
    const published = formData.get('published') === 'true'

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    let finalCoverImageUrl = existingBlog.coverImage
    let processingInfo: any = {}

    // Process new cover image if provided
    if (coverImageFile && coverImageFile.size > 0) {
      if (!coverImageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 })
      }

      console.log(`📁 Processing new cover image: ${coverImageFile.name}`)

      // Delete old image from Cloudinary if it exists
      if (existingBlog.coverImage && existingBlog.coverImage.includes('cloudinary.com')) {
        try {
          const { v2: cloudinary } = await import('cloudinary')
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
          })
          
          // Extract public_id from URL
          const urlParts = existingBlog.coverImage.split('/')
          const imageSegment = urlParts[urlParts.length - 1]
          const publicIdWithExtension = imageSegment.split('.')[0]
          const fullPublicId = `mr-photography/blog/${publicIdWithExtension}`
          
          console.log('🗑️ Deleting old blog image:', fullPublicId)
          await cloudinary.uploader.destroy(fullPublicId)
          console.log('✅ Old image deleted')
        } catch (error) {
          console.error('❌ Error deleting old image:', error)
          // Continue with update even if image deletion fails
        }
      }

      // ✨ SMART IMAGE PROCESSING
      let processedBuffer: Buffer
      let processedFileName: string
      
      try {
        const isTiff = coverImageFile.type === 'image/tiff' || 
                      coverImageFile.type === 'image/tif' || 
                      coverImageFile.name.toLowerCase().endsWith('.tif') || 
                      coverImageFile.name.toLowerCase().endsWith('.tiff')
        const isLarge = coverImageFile.size > 10 * 1024 * 1024
        
        if (isTiff) {
          console.log(`🔄 TIFF file detected, converting to JPEG...`)
          const conversionResult = await convertImageToJPEG(coverImageFile)
          
          if (conversionResult.convertedSize > 10 * 1024 * 1024) {
            console.log(`⚠️ Converted file still large, optimizing...`)
            const tempFile = new File([conversionResult.buffer], coverImageFile.name.replace(/\.tiff?$/i, '.jpg'), { type: 'image/jpeg' })
            const optimizationResult = await optimizeImage(tempFile, {
              maxWidth: 1600,
              maxHeight: 900,
              quality: 88
            })
            
            processedBuffer = optimizationResult.buffer
            processedFileName = coverImageFile.name.replace(/\.tiff?$/i, '.jpg')
            processingInfo = {
              originalFormat: 'TIFF',
              finalFormat: 'JPEG',
              originalSize: coverImageFile.size,
              convertedSize: conversionResult.convertedSize,
              finalSize: optimizationResult.convertedSize,
              wasConverted: true,
              wasOptimized: true
            }
          } else {
            processedBuffer = conversionResult.buffer
            processedFileName = coverImageFile.name.replace(/\.tiff?$/i, '.jpg')
            processingInfo = {
              originalFormat: 'TIFF',
              finalFormat: 'JPEG',
              originalSize: coverImageFile.size,
              finalSize: conversionResult.convertedSize,
              wasConverted: true,
              wasOptimized: false
            }
          }
          
        } else if (isLarge) {
          console.log(`📦 Large file detected, optimizing...`)
          const optimizationResult = await optimizeImage(coverImageFile, {
            maxWidth: 1600,
            maxHeight: 900,
            quality: 88
          })
          
          processedBuffer = optimizationResult.buffer
          processedFileName = coverImageFile.name.replace(/\.[^/.]+$/, '.jpg')
          processingInfo = {
            originalFormat: coverImageFile.type,
            finalFormat: 'JPEG',
            originalSize: coverImageFile.size,
            finalSize: optimizationResult.convertedSize,
            wasConverted: false,
            wasOptimized: true
          }
          
        } else {
          console.log(`✅ File size acceptable, processing as-is`)
          const arrayBuffer = await coverImageFile.arrayBuffer()
          processedBuffer = Buffer.from(arrayBuffer)
          processedFileName = coverImageFile.name
          processingInfo = {
            originalFormat: coverImageFile.type,
            finalFormat: coverImageFile.type,
            originalSize: coverImageFile.size,
            finalSize: coverImageFile.size,
            wasConverted: false,
            wasOptimized: false
          }
        }
        
      } catch (conversionError) {
        console.error('❌ Image processing failed:', conversionError)
        return NextResponse.json({
          error: "IMAGE_PROCESSING_FAILED",
          message: `Failed to process image: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`
        }, { status: 422 })
      }
      
      // Upload to Cloudinary
      console.log("☁️ Uploading processed blog image to Cloudinary...")
      
      try {
        const { v2: cloudinary } = await import('cloudinary')
        
        cloudinary.config({
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
          secure: true
        })
        
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'mr-photography/blog',
              resource_type: 'image',
              transformation: [
                { width: 1600, height: 900, crop: 'limit', quality: 'auto:good' },
                { fetch_format: 'auto' }
              ],
              timeout: 300000,
              public_id: processedFileName.replace(/\.[^/.]+$/, ''),
            },
            (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            }
          ).end(processedBuffer)
        }) as any
        
        finalCoverImageUrl = uploadResult.secure_url
        
        console.log("📤 Cloudinary upload completed successfully")
        
      } catch (cloudinaryError) {
        console.error("❌ Cloudinary upload failed:", cloudinaryError)
        return NextResponse.json({
          error: "Cloudinary upload failed",
          details: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
        }, { status: 500 })
      }
    }

    // Update slug if title changed
    let finalSlug = existingBlog.slug
    if (title !== existingBlog.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      // Check if new slug already exists
      const existingSlugBlog = await db.blog.findUnique({
        where: { slug: newSlug }
      })

      if (existingSlugBlog && existingSlugBlog.id !== id) {
        finalSlug = `${newSlug}-${Date.now()}`
      } else {
        finalSlug = newSlug
      }
    }

    // Update blog in database
    const updatedBlog = await db.blog.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        coverImage: finalCoverImageUrl,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        featured,
        published,
      }
    })

    console.log('✅ Blog updated successfully:', updatedBlog.id)

    const response = {
      ...updatedBlog,
      uploadDetails: processingInfo,
      message: processingInfo.wasConverted 
        ? "TIFF blog image converted to JPEG and updated successfully"
        : "Blog updated successfully"
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    // Delete cover image from Cloudinary if it exists
    if (existingBlog.coverImage && existingBlog.coverImage.includes('cloudinary.com')) {
      try {
        const { v2: cloudinary } = await import('cloudinary')
        
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
        })
        
        // Extract public_id from URL
        const urlParts = existingBlog.coverImage.split('/')
        const imageSegment = urlParts[urlParts.length - 1]
        const publicIdWithExtension = imageSegment.split('.')[0]
        const fullPublicId = `mr-photography/blog/${publicIdWithExtension}`
        
        await cloudinary.uploader.destroy(fullPublicId)
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error)
        // Continue with deletion even if image deletion fails
      }
    }

    await db.blog.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    )
  }
}