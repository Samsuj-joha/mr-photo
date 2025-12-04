// // File: src/app/api/admin/portfolios/[id]/route.ts
// // Dynamic portfolio API route with your actual Prisma schema

// import { NextRequest, NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'
// import { v2 as cloudinary } from 'cloudinary'

// const prisma = new PrismaClient()

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// // GET - Fetch single portfolio from your database
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id
    
//     const portfolio = await prisma.portfolio.findUnique({
//       where: { id }
//     })
    
//     if (!portfolio) {
//       return NextResponse.json(
//         { error: 'Portfolio not found' },
//         { status: 404 }
//       )
//     }

//     // Transform data to match your component interface
//     const transformedPortfolio = {
//       id: portfolio.id,
//       title: portfolio.title,
//       description: portfolio.description || '',
//       gallery: portfolio.category,
//       coverImage: portfolio.coverImage,
//       createdAt: portfolio.createdAt.toISOString(),
//       views: 0
//     }
    
//     return NextResponse.json(transformedPortfolio)
//   } catch (error) {
//     console.error('Error fetching portfolio:', error)
//     return NextResponse.json(
//       { error: 'Failed to fetch portfolio' },
//       { status: 500 }
//     )
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// // PATCH - Update portfolio in your database
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id
//     const updates = await request.json()
    
//     // Transform gallery back to category if needed
//     const updateData = { ...updates }
//     if (updates.gallery) {
//       updateData.category = updates.gallery
//       delete updateData.gallery
//     }
    
//     const updatedPortfolio = await prisma.portfolio.update({
//       where: { id },
//       data: updateData
//     })

//     // Transform response
//     const transformedPortfolio = {
//       id: updatedPortfolio.id,
//       title: updatedPortfolio.title,
//       description: updatedPortfolio.description || '',
//       gallery: updatedPortfolio.category,
//       coverImage: updatedPortfolio.coverImage,
//       createdAt: updatedPortfolio.createdAt.toISOString(),
//       views: 0
//     }
    
//     return NextResponse.json(transformedPortfolio)
    
//   } catch (error) {
//     console.error('Error updating portfolio:', error)
    
//     // Check if portfolio doesn't exist (Prisma error code)
//     if (error.code === 'P2025') {
//       return NextResponse.json(
//         { error: 'Portfolio not found' },
//         { status: 404 }
//       )
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to update portfolio' },
//       { status: 500 }
//     )
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// // DELETE - Delete portfolio from database and Cloudinary
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = params.id
    
//     // First, get the portfolio to get the Cloudinary URL
//     const portfolio = await prisma.portfolio.findUnique({
//       where: { id }
//     })
    
//     if (!portfolio) {
//       return NextResponse.json(
//         { error: 'Portfolio not found' },
//         { status: 404 }
//       )
//     }
    
//     // Extract public_id from Cloudinary URL and delete from Cloudinary
//     if (portfolio.coverImage && portfolio.coverImage.includes('cloudinary.com')) {
//       try {
//         // Extract public_id from URL
//         const urlParts = portfolio.coverImage.split('/')
//         const fileWithExtension = urlParts[urlParts.length - 1]
//         const publicId = `mr-photography/portfolios/${fileWithExtension.split('.')[0]}`
        
//         await cloudinary.uploader.destroy(publicId)
//       } catch (cloudinaryError) {
//         console.error('Error deleting from Cloudinary:', cloudinaryError)
//         // Continue with database deletion even if Cloudinary fails
//       }
//     }
    
//     // Delete portfolio from database
//     await prisma.portfolio.delete({
//       where: { id }
//     })
    
//     return NextResponse.json(
//       { message: 'Portfolio deleted successfully' },
//       { status: 200 }
//     )
    
//   } catch (error) {
//     console.error('Error deleting portfolio:', error)
    
//     // Check if portfolio doesn't exist
//     if (error.code === 'P2025') {
//       return NextResponse.json(
//         { error: 'Portfolio not found' },
//         { status: 404 }
//       )
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to delete portfolio' },
//       { status: 500 }
//     )
//   } finally {
//     await prisma.$disconnect()
//   }
// }




// src/app/api/admin/portfolios/[id]/route.ts - ENHANCED with proper Cloudinary cleanup
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    const portfolio = await db.portfolio.findUnique({
      where: { id }
    })
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Transform data to match your component interface
    const transformedPortfolio = {
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description || '',
      gallery: portfolio.category,
      coverImage: portfolio.coverImage,
      createdAt: portfolio.createdAt.toISOString(),
      views: 0
    }
    
    return NextResponse.json(transformedPortfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }
    const updates = await request.json()
    
    // Transform gallery back to category if needed
    const updateData = { ...updates }
    if (updates.gallery) {
      updateData.category = updates.gallery
      delete updateData.gallery
    }
    
    const updatedPortfolio = await db.portfolio.update({
      where: { id },
      data: updateData
    })

    // Transform response
    const transformedPortfolio = {
      id: updatedPortfolio.id,
      title: updatedPortfolio.title,
      description: updatedPortfolio.description || '',
      gallery: updatedPortfolio.category,
      coverImage: updatedPortfolio.coverImage,
      createdAt: updatedPortfolio.createdAt.toISOString(),
      views: 0
    }
    
    return NextResponse.json(transformedPortfolio)
    
  } catch (error) {
    console.error('Error updating portfolio:', error)
    
    // Check if portfolio doesn't exist (Prisma error code)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

// DELETE - Enhanced with proper Cloudinary cleanup
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log("🗑️ Portfolio delete API called")
  
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }
    
    // First, get the portfolio to get the Cloudinary URL
    const portfolio = await db.portfolio.findUnique({
      where: { id }
    })
    
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }
    
    console.log(`🔍 Found portfolio: ${portfolio.title}`)
    console.log(`🖼️ Cover image URL: ${portfolio.coverImage}`)
    
    // Enhanced Cloudinary cleanup
    if (portfolio.coverImage && portfolio.coverImage.includes('cloudinary.com')) {
      try {
        const { v2: cloudinary } = await import('cloudinary')
        
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
        })
        
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[public_id].[format]
        const urlParts = portfolio.coverImage.split('/')
        const imageSegment = urlParts[urlParts.length - 1] // Get the last part (filename)
        const publicIdWithExtension = imageSegment.split('.')[0] // Remove extension
        
        // Reconstruct the full public_id with folder structure
        const folderPath = 'mr-photography/portfolios'
        const fullPublicId = `${folderPath}/${publicIdWithExtension}`
        
        console.log(`🔄 Attempting to delete from Cloudinary: ${fullPublicId}`)
        
        const deleteResult = await cloudinary.uploader.destroy(fullPublicId)
        console.log(`✅ Cloudinary deletion result:`, deleteResult)
        
        // Also try to delete any eager transformations
        try {
          await cloudinary.uploader.destroy(`${fullPublicId}_800x600`)
          await cloudinary.uploader.destroy(`${fullPublicId}_400x300`)
        } catch (eagerError) {
          console.log('ℹ️ No eager transformations to delete (this is normal)')
        }
        
      } catch (cloudinaryError) {
        console.error('❌ Error deleting from Cloudinary:', cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
        console.log('⚠️ Continuing with database deletion despite Cloudinary error')
      }
    } else {
      console.log('ℹ️ No Cloudinary image to delete')
    }
    
    // Delete portfolio from database
    await db.portfolio.delete({
      where: { id }
    })
    
    console.log(`✅ Portfolio deleted successfully from database`)
    
    return NextResponse.json(
      { 
        message: 'Portfolio deleted successfully',
        deletedId: id,
        deletedTitle: portfolio.title
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('💥 Error deleting portfolio:', error)
    
    // Check if portfolio doesn't exist
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    )
  }
}