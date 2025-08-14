
// src/app/api/admin/features/route.ts - ENHANCED with TIFF Support & Compression
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { convertImageToJPEG, optimizeImage } from "@/lib/imageConverter"

// GET /api/admin/features - Get all features for admin
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin features API called...')
    
    // Test database connection first
    try {
      await db.$connect()
      console.log('✅ Database connected successfully')
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      )
    }

    // Check authentication
    let session
    try {
      session = await getServerSession(authOptions)
      console.log('🔐 Session check:', session ? 'Found' : 'Not found')
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 500 }
      )
    }
    
    if (!session || session.user.role !== 'ADMIN') {
      console.log('🚫 Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('👤 Admin user authenticated:', session.user.email)

    // Try to fetch features
    try {
      console.log('🔍 Attempting to fetch features...')
      const features = await db.feature.findMany({
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      })
      
      console.log(`✅ Successfully fetched ${features.length} features`)
      
      if (!Array.isArray(features)) {
        console.error('❌ Features is not an array:', typeof features)
        return NextResponse.json(
          { error: 'Invalid data format returned from database' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(features)
    } catch (fetchError) {
      console.error('❌ Error fetching features:', fetchError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch features', 
          details: fetchError.message,
          hint: 'The Feature table might not exist. Run: npx prisma migrate dev'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('❌ Unexpected error in admin features API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/features - Create new feature with ENHANCED image processing
export async function POST(request: NextRequest) {
  console.log("🚀 Feature upload API called with TIFF support")
  
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
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File | null
    const icon = formData.get('icon') as string
    const published = formData.get('published') === 'true'
    const featured = formData.get('featured') === 'true'
    const order = parseInt(formData.get('order') as string) || 0

    // Validate required fields
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    let finalImageUrl = null
    let finalPublicId = null
    let processingInfo: any = {}

    // Process image if provided
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 })
      }

      console.log(`📁 Original file: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)}MB, ${imageFile.type})`)

      // ✨ SMART IMAGE PROCESSING
      let processedBuffer: Buffer
      let processedFileName: string
      
      try {
        const isTiff = imageFile.type === 'image/tiff' || 
                      imageFile.type === 'image/tif' || 
                      imageFile.name.toLowerCase().endsWith('.tif') || 
                      imageFile.name.toLowerCase().endsWith('.tiff')
        const isLarge = imageFile.size > 10 * 1024 * 1024 // Over 10MB
        
        if (isTiff) {
          console.log(`🔄 TIFF file detected, converting to JPEG...`)
          const conversionResult = await convertImageToJPEG(imageFile)
          
          if (conversionResult.convertedSize > 10 * 1024 * 1024) {
            console.log(`⚠️ Converted file still large, optimizing...`)
            const tempFile = new File([conversionResult.buffer], imageFile.name.replace(/\.tiff?$/i, '.jpg'), { type: 'image/jpeg' })
            const optimizationResult = await optimizeImage(tempFile, {
              maxWidth: 1200, // Features don't need huge images
              maxHeight: 800,
              quality: 85
            })
            
            processedBuffer = optimizationResult.buffer
            processedFileName = imageFile.name.replace(/\.tiff?$/i, '.jpg')
            processingInfo = {
              originalFormat: 'TIFF',
              finalFormat: 'JPEG',
              originalSize: imageFile.size,
              convertedSize: conversionResult.convertedSize,
              finalSize: optimizationResult.convertedSize,
              wasConverted: true,
              wasOptimized: true,
              dimensions: `${optimizationResult.width}×${optimizationResult.height}`
            }
          } else {
            processedBuffer = conversionResult.buffer
            processedFileName = imageFile.name.replace(/\.tiff?$/i, '.jpg')
            processingInfo = {
              originalFormat: 'TIFF',
              finalFormat: 'JPEG',
              originalSize: imageFile.size,
              finalSize: conversionResult.convertedSize,
              wasConverted: true,
              wasOptimized: false,
              dimensions: `${conversionResult.width}×${conversionResult.height}`
            }
          }
          
        } else if (isLarge) {
          console.log(`📦 Large file detected, optimizing...`)
          const optimizationResult = await optimizeImage(imageFile, {
            maxWidth: 1200,
            maxHeight: 800,
            quality: 85
          })
          
          processedBuffer = optimizationResult.buffer
          processedFileName = imageFile.name.replace(/\.[^/.]+$/, '.jpg')
          processingInfo = {
            originalFormat: imageFile.type,
            finalFormat: 'JPEG',
            originalSize: imageFile.size,
            finalSize: optimizationResult.convertedSize,
            wasConverted: false,
            wasOptimized: true,
            dimensions: `${optimizationResult.width}×${optimizationResult.height}`
          }
          
        } else {
          console.log(`✅ File size acceptable, processing as-is`)
          const arrayBuffer = await imageFile.arrayBuffer()
          processedBuffer = Buffer.from(arrayBuffer)
          processedFileName = imageFile.name
          processingInfo = {
            originalFormat: imageFile.type,
            finalFormat: imageFile.type,
            originalSize: imageFile.size,
            finalSize: imageFile.size,
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
      console.log("☁️ Uploading processed feature image to Cloudinary...")
      
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
              folder: 'mr-photography/features',
              resource_type: 'image',
              transformation: [
                { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
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
        
        finalImageUrl = uploadResult.secure_url
        finalPublicId = uploadResult.public_id
        
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
    const feature = await db.feature.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        image: finalImageUrl,
        publicId: finalPublicId,
        icon: icon || null,
        published,
        featured,
        order,
      }
    })

    console.log('✅ Feature created successfully:', {
      id: feature.id,
      title: feature.title,
      hasImage: !!feature.image,
      imageUrl: feature.image
    })

    const response = {
      ...feature,
      uploadDetails: processingInfo,
      message: processingInfo.wasConverted 
        ? "TIFF feature image converted to JPEG and uploaded successfully"
        : "Feature created successfully"
    }

    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error creating feature:', error)
    return NextResponse.json(
      { error: 'Failed to create feature', details: error.message },
      { status: 500 }
    )
  }
}