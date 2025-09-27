// // File: src/app/api/admin/portfolios/route.ts
// // Portfolio API route with your actual Prisma schema and Cloudinary config

// import { NextRequest, NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'
// import { v2 as cloudinary } from 'cloudinary'

// const prisma = new PrismaClient()

// // Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// // GET - Fetch all portfolios from your database
// export async function GET() {
//   try {
//     const portfolios = await prisma.portfolio.findMany({
//       orderBy: {
//         createdAt: 'desc'
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         category: true,
//         coverImage: true,
//         images: true,
//         featured: true,
//         published: true,
//         client: true,
//         completedAt: true,
//         createdAt: true,
//         updatedAt: true
//       }
//     })

//     // Transform data to match your component interface
//     const transformedPortfolios = portfolios.map(portfolio => ({
//       id: portfolio.id,
//       title: portfolio.title,
//       description: portfolio.description || '',
//       gallery: portfolio.category, // Map category to gallery for your component
//       coverImage: portfolio.coverImage,
//       createdAt: portfolio.createdAt.toISOString(),
//       views: 0 // You can add a views field to your schema later if needed
//     }))
    
//     return NextResponse.json(transformedPortfolios)
//   } catch (error) {
//     console.error('Error fetching portfolios:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch portfolios' },
//       { status: 500 }
//     )
//   }
// }

// // POST - Create new portfolio with Cloudinary upload
// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
    
//     const title = formData.get('title') as string
//     const description = formData.get('description') as string
//     const gallery = formData.get('gallery') as string // This will be stored as category
//     const imageFile = formData.get('image') as File

//     // Validate required fields
//     if (!title || !description || !gallery || !imageFile) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       )
//     }

//     // Upload image to Cloudinary
//     let coverImageUrl = ''
    
//     try {
//       // Convert file to buffer
//       const bytes = await imageFile.arrayBuffer()
//       const buffer = Buffer.from(bytes)
      
//       // Upload to Cloudinary
//       const uploadResponse = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           {
//             folder: 'mr-photography/portfolios',
//             resource_type: 'image',
//             transformation: [
//               { width: 800, height: 600, crop: 'fill', quality: 'auto' }
//             ]
//           },
//           (error, result) => {
//             if (error) reject(error)
//             else resolve(result)
//           }
//         ).end(buffer)
//       })

//       coverImageUrl = uploadResponse.secure_url
      
//     } catch (uploadError) {
//       console.error('Error uploading to Cloudinary:', uploadError)
//       return NextResponse.json(
//         { error: 'Failed to upload image' },
//         { status: 500 }
//       )
//     }

//     // Save portfolio to your database
//     const newPortfolio = await prisma.portfolio.create({
//       data: {
//         title,
//         description,
//         category: gallery, // Store gallery as category in your schema
//         coverImage: coverImageUrl,
//         images: [], // Empty array initially
//         featured: false,
//         published: true,
//         completedAt: new Date()
//       }
//     })

//     // Transform response to match your component interface
//     const transformedPortfolio = {
//       id: newPortfolio.id,
//       title: newPortfolio.title,
//       description: newPortfolio.description || '',
//       gallery: newPortfolio.category,
//       coverImage: newPortfolio.coverImage,
//       createdAt: newPortfolio.createdAt.toISOString(),
//       views: 0
//     }

//     return NextResponse.json(transformedPortfolio, { status: 201 })
    
//   } catch (error) {
//     console.error('Error creating portfolio:', error)
//     return NextResponse.json(
//       { error: 'Failed to create portfolio' },
//       { status: 500 }
//     )
//   } finally {
//     await prisma.$disconnect()
//   }
// }




// src/app/api/admin/portfolios/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'
import { convertImageToJPEG, optimizeImage } from "@/lib/imageConverter"

export async function GET() {
  try {
    const portfolios = await db.portfolio.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedPortfolios = portfolios.map(portfolio => ({
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description || '',
      gallery: portfolio.category,
      coverImage: portfolio.coverImage,
      createdAt: portfolio.createdAt.toISOString(),
      views: 0
    }))
    
    return NextResponse.json(transformedPortfolios)
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log("🚀 Portfolio upload API called")
  
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing Cloudinary credentials" },
        { status: 500 }
      )
    }
    
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const gallery = formData.get('gallery') as string
    const imageFile = formData.get('image') as File

    if (!title || !description || !gallery || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    console.log(`📁 Original file: ${imageFile.name}`)

    let processedBuffer: Buffer
    let processedFileName: string
    let processingInfo: any = {}
    
    try {
      const isTiff = imageFile.type === 'image/tiff' || 
                    imageFile.type === 'image/tif' || 
                    imageFile.name.toLowerCase().endsWith('.tif') || 
                    imageFile.name.toLowerCase().endsWith('.tiff')
      const isLarge = imageFile.size > 10 * 1024 * 1024
      
      if (isTiff) {
        console.log(`🔄 Converting TIFF to JPEG...`)
        const conversionResult = await convertImageToJPEG(imageFile)
        
        if (conversionResult.convertedSize > 10 * 1024 * 1024) {
          const tempFile = new File([conversionResult.buffer], imageFile.name.replace(/\.tiff?$/i, '.jpg'), { type: 'image/jpeg' })
          const optimizationResult = await optimizeImage(tempFile, {
            maxWidth: 1920,
            maxHeight: 1080,
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
        console.log(`📦 Optimizing large file...`)
        const optimizationResult = await optimizeImage(imageFile, {
          maxWidth: 1920,
          maxHeight: 1080,
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
        console.log(`✅ File acceptable, using as-is`)
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
        message: conversionError instanceof Error ? conversionError.message : 'Unknown error'
      }, { status: 422 })
    }
    
    if (processedBuffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({
        error: "FILE_TOO_LARGE",
        message: "File is too large even after processing"
      }, { status: 413 })
    }

    console.log("☁️ Uploading to Cloudinary...")
    
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
            folder: 'mr-photography/portfolios',
            resource_type: 'image',
            transformation: [
              { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' }
            ],
            timeout: 300000,
            public_id: processedFileName.replace(/\.[^/.]+$/, '')
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
      
      console.log("📤 Cloudinary upload completed")

      const newPortfolio = await db.portfolio.create({
        data: {
          title,
          description,
          category: gallery,
          coverImage: uploadResult.secure_url,
          images: [],
          featured: false,
          published: true,
          completedAt: new Date()
        }
      })

      const transformedPortfolio = {
        id: newPortfolio.id,
        title: newPortfolio.title,
        description: newPortfolio.description || '',
        gallery: newPortfolio.category,
        coverImage: newPortfolio.coverImage,
        createdAt: newPortfolio.createdAt.toISOString(),
        views: 0,
        uploadDetails: processingInfo,
        message: processingInfo.wasConverted 
          ? "TIFF converted to JPEG and uploaded successfully"
          : "Portfolio uploaded successfully"
      }

      return NextResponse.json(transformedPortfolio, { status: 201 })
      
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload failed:", cloudinaryError)
      return NextResponse.json({
        error: "Cloudinary upload failed",
        details: cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError)
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error("💥 Unexpected error:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}