// src/app/api/admin/home-slider/verify/route.ts
// Utility to verify if slider images exist in Cloudinary
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all slider images
    const sliderImages = await db.homeSlider.findMany({
      orderBy: { order: "asc" }
    })

    const verificationResults = await Promise.all(
      sliderImages.map(async (slider) => {
        try {
          // Try to fetch the image to verify it exists
          // Use GET instead of HEAD as some servers don't support HEAD properly
          const response = await fetch(slider.imageUrl, { 
            method: 'GET',
            headers: {
              'Accept': 'image/*',
            },
            // Add cache control to avoid cached 404s
            cache: 'no-cache'
          })
          
          const exists = response.ok
          const contentType = response.headers.get('content-type') || ''
          const isImage = contentType.startsWith('image/')
          
          // If response is OK but not an image, there might be an issue
          if (response.ok && !isImage) {
            console.warn(`⚠️ URL returns OK but not an image: ${slider.imageUrl}, Content-Type: ${contentType}`)
          }
          
          // Get additional headers for debugging CORS/access issues
          const accessControl = response.headers.get('access-control-allow-origin')
          const cacheControl = response.headers.get('cache-control')
          const contentLength = response.headers.get('content-length')
          
          return {
            id: slider.id,
            title: slider.title || 'Untitled',
            imageUrl: slider.imageUrl,
            publicId: slider.publicId,
            exists: exists && isImage,
            status: response.status,
            contentType,
            isImage,
            accessControl,
            cacheControl,
            contentLength,
            active: slider.active,
            createdAt: slider.createdAt,
            // Diagnostic info
            diagnostic: {
              urlAccessible: exists,
              isImageType: isImage,
              hasCors: !!accessControl,
              hasContent: !!contentLength
            }
          }
        } catch (error) {
          return {
            id: slider.id,
            title: slider.title || 'Untitled',
            imageUrl: slider.imageUrl,
            publicId: slider.publicId,
            exists: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
            active: slider.active,
            createdAt: slider.createdAt
          }
        }
      })
    )

    const summary = {
      total: verificationResults.length,
      exists: verificationResults.filter(r => r.exists).length,
      missing: verificationResults.filter(r => !r.exists).length,
      active: verificationResults.filter(r => r.active).length,
      activeMissing: verificationResults.filter(r => r.active && !r.exists).length
    }

    return NextResponse.json({
      summary,
      results: verificationResults
    })
  } catch (error) {
    console.error("Error verifying slider images:", error)
    return NextResponse.json(
      { error: "Failed to verify slider images" },
      { status: 500 }
    )
  }
}

// POST - Auto-cleanup missing images (deletes all 404 images automatically)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all slider images
    const sliderImages = await db.homeSlider.findMany()

    // Check which images are missing
    const missingImages = await Promise.all(
      sliderImages.map(async (slider) => {
        try {
          const response = await fetch(slider.imageUrl, { 
            method: 'HEAD',
            cache: 'no-cache'
          })
          return {
            id: slider.id,
            exists: response.ok,
            status: response.status
          }
        } catch (error) {
          return {
            id: slider.id,
            exists: false,
            status: 'error'
          }
        }
      })
    )

    // Get IDs of missing images
    const missingIds = missingImages
      .filter(img => !img.exists)
      .map(img => img.id)

    if (missingIds.length === 0) {
      return NextResponse.json({
        message: "No missing images found. All images exist in Cloudinary.",
        deleted: 0,
        failed: 0
      })
    }

    // Delete all missing images from database
    const deleteResults = await Promise.all(
      missingIds.map(async (id: string) => {
        try {
          await db.homeSlider.delete({
            where: { id }
          })
          return { id, success: true }
        } catch (error) {
          console.error(`Error deleting slider ${id}:`, error)
          return { id, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })
    )

    const successCount = deleteResults.filter(r => r.success).length
    const failCount = deleteResults.filter(r => !r.success).length

    return NextResponse.json({
      message: `Auto-cleanup completed: Deleted ${successCount} missing image${successCount !== 1 ? 's' : ''}`,
      deleted: successCount,
      failed: failCount,
      deletedIds: deleteResults.filter(r => r.success).map(r => r.id),
      results: deleteResults
    })
  } catch (error) {
    console.error("Error auto-cleaning slider images:", error)
    return NextResponse.json(
      { error: "Failed to auto-cleanup slider images" },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete missing images
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ids } = body // Array of IDs to delete

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs array is required" },
        { status: 400 }
      )
    }

    // Delete all specified images from database
    // Note: We skip Cloudinary deletion since images don't exist there
    const deleteResults = await Promise.all(
      ids.map(async (id: string) => {
        try {
          await db.homeSlider.delete({
            where: { id }
          })
          return { id, success: true }
        } catch (error) {
          console.error(`Error deleting slider ${id}:`, error)
          return { id, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })
    )

    const successCount = deleteResults.filter(r => r.success).length
    const failCount = deleteResults.filter(r => !r.success).length

    return NextResponse.json({
      message: `Deleted ${successCount} image${successCount !== 1 ? 's' : ''}`,
      deleted: successCount,
      failed: failCount,
      results: deleteResults
    })
  } catch (error) {
    console.error("Error bulk deleting slider images:", error)
    return NextResponse.json(
      { error: "Failed to delete slider images" },
      { status: 500 }
    )
  }
}

