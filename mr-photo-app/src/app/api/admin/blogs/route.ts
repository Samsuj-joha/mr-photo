// src/app/api/admin/blogs/route.ts - ENHANCED with TIFF Support & Compression
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { convertImageToJPEG, optimizeImage } from "@/lib/imageConverter"

// GET - Fetch all blogs
export async function GET() {
  try {
    console.log('📋 Fetching blogs from database...')
    
    const blogs = await db.blog.findMany({
      orderBy: { createdAt: "desc" }
    })

    console.log(`✅ Found ${blogs.length} blogs`)
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("❌ Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// POST - Create new blog with ENHANCED image processing
export async function POST(request: NextRequest) {
  console.log("🚀 Blog creation API called with TIFF support")
  
  try {
    // Step 1: Check environment variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Server configuration error - missing Cloudinary credentials" },
        { status: 500 }
      )
    }
    
    // Step 2: Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Step 3: Parse form data
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

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if slug already exists
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    })

    let finalSlug = slug
    if (existingBlog) {
      finalSlug = `${slug}-${Date.now()}`
    }

    let finalCoverImageUrl = null
    let processingInfo: any = {}

    // Process cover image if provided
    if (coverImageFile && coverImageFile.size > 0) {
      if (!coverImageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 })
      }

      console.log(`📁 Processing cover image: ${coverImageFile.name} (${(coverImageFile.size / 1024 / 1024).toFixed(2)}MB, ${coverImageFile.type})`)

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
              maxWidth: 1600, // Blog cover images can be larger
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

    // Step 4: Save to database
    const blog = await db.blog.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        coverImage: finalCoverImageUrl,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        featured: featured || false,
        published: published || false,
      }
    })

    console.log('✅ Blog created:', blog.id)
    
    const response = {
      ...blog,
      uploadDetails: processingInfo,
      message: processingInfo.wasConverted 
        ? "TIFF blog image converted to JPEG and uploaded successfully"
        : "Blog created successfully"
    }

    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error("❌ Error creating blog:", error)
    return NextResponse.json(
      { error: "Failed to create blog", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}