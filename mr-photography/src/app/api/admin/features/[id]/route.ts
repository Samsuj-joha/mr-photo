

// src/app/api/admin/features/[id]/route.ts - ENHANCED with TIFF Support & Compression
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { convertImageToJPEG, optimizeImage } from "@/lib/imageConverter"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const feature = await db.feature.findUnique({
      where: { id }
    })

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error fetching feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/features/[id] - Update feature with ENHANCED image processing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🔄 Feature update API called with TIFF support")
  
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

    const { id } = await params

    // Check if feature exists
    const existingFeature = await db.feature.findUnique({
      where: { id }
    })

    if (!existingFeature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
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

    let finalImageUrl = existingFeature.image
    let finalPublicId = existingFeature.publicId
    let processingInfo: any = {}

    // Process new image if provided
    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json({ error: "File must be an image" }, { status: 400 })
      }

      console.log(`📁 Processing new image: ${imageFile.name} (${(imageFile.size / 1024 / 1024).toFixed(2)}MB, ${imageFile.type})`)

      // Delete old image from Cloudinary if it exists
      if (existingFeature.publicId) {
        try {
          const { v2: cloudinary } = await import('cloudinary')
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true
          })
          
          console.log('🗑️ Deleting old image:', existingFeature.publicId)
          await cloudinary.uploader.destroy(existingFeature.publicId)
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
              maxWidth: 1200,
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
              wasOptimized: true
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
              wasOptimized: false
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
            wasOptimized: true
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

    // Step 4: Update in database
    const feature = await db.feature.update({
      where: { id },
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

    console.log('✅ Feature updated successfully:', {
      id: feature.id,
      title: feature.title,
      hasImage: !!feature.image,
      finalImageUrl: feature.image
    })

    const response = {
      ...feature,
      uploadDetails: processingInfo,
      message: processingInfo.wasConverted 
        ? "TIFF feature image converted to JPEG and updated successfully"
        : "Feature updated successfully"
    }

    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/features/[id] - Delete feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get feature to delete associated image
    const feature = await db.feature.findUnique({
      where: { id }
    })

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it exists
    if (feature.publicId) {
      try {
        const { v2: cloudinary } = await import('cloudinary')
        
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
        })
        
        await cloudinary.uploader.destroy(feature.publicId)
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error)
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete feature from database
    await db.feature.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    )
  }
}