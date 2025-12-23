// src/app/api/gallery/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteImage } from "@/lib/cloudinary"

// GET - Fetch single gallery
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    // For admin panel, fetch gallery without published filter
    // For public, only show published galleries
    const { searchParams } = new URL(request.url)
    const skipPublishedCheck = searchParams.get("skipPublishedCheck") === "true"
    
    const gallery = await db.gallery.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            url: true,
            publicId: true,
            alt: true,
            caption: true,
            order: true,
            loves: true,
            year: true,
            category: true,
            aiLabels: true, // Include AI labels for instant display
            published: true,
            createdAt: true, // Explicitly select createdAt
            galleryId: true
          }
        },
        _count: {
          select: { images: true }
        }
      }
    })
    
    // Debug: Log dates for first few images
    if (gallery && gallery.images && gallery.images.length > 0) {
      console.log(`\n📅 Gallery ${id} - First 3 image dates:`)
      gallery.images.slice(0, 3).forEach((img: any, idx: number) => {
        console.log(`  Image ${idx + 1} (${img.id}):`, {
          createdAt: img.createdAt,
          createdAtType: typeof img.createdAt,
          createdAtISO: img.createdAt?.toISOString?.() || 'N/A',
          year: img.year || new Date(img.createdAt).getFullYear()
        })
      })
    }
    
    // If gallery doesn't exist, return 404
    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }
    
    // For public access, only show published galleries
    if (!skipPublishedCheck && !gallery.published) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    const formattedGallery = {
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
      featured: gallery.featured,
      published: gallery.published,
      createdAt: gallery.createdAt,
      updatedAt: gallery.updatedAt,
      images: gallery.images,
      imageCount: gallery._count.images,
    }

    return NextResponse.json(formattedGallery)
  } catch (error) {
    console.error("Error fetching gallery:", error)
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    )
  }
}

// PUT - Update gallery
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, category, featured, published } = body

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      )
    }

    const gallery = await db.gallery.update({
      where: { id },
      data: {
        title,
        description,
        category,
        featured,
        published,
        updatedAt: new Date(),
      },
      include: {
        images: true,
        _count: {
          select: { images: true }
        }
      }
    })

    const formattedGallery = {
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
      featured: gallery.featured,
      published: gallery.published,
      createdAt: gallery.createdAt,
      updatedAt: gallery.updatedAt,
      imageCount: gallery._count.images,
      coverImage: gallery.images[0]?.url || "/placeholder-image.jpg",
    }

    return NextResponse.json(formattedGallery)
  } catch (error) {
    console.error("Error updating gallery:", error)
    return NextResponse.json(
      { error: "Failed to update gallery" },
      { status: 500 }
    )
  }
}

// DELETE - Delete gallery
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle params as either Promise or direct object (Next.js version compatibility)
    let galleryId: string
    
    try {
      if (params && typeof params === 'object' && 'then' in params && typeof (params as any).then === 'function') {
        // It's a Promise
        const resolvedParams = await (params as Promise<{ id: string }>)
        galleryId = resolvedParams.id
      } else {
        // It's a direct object
        galleryId = (params as { id: string }).id
      }
    } catch (paramsError) {
      console.error("❌ Error resolving params:", paramsError)
      return NextResponse.json(
        { error: "Invalid request parameters" },
        { status: 400 }
      )
    }

    if (!galleryId || typeof galleryId !== 'string') {
      console.error("❌ Gallery ID is missing or invalid:", galleryId)
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      )
    }

    console.log(`🗑️ Starting deletion of gallery: ${galleryId}`)

    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      console.error("❌ Unauthorized deletion attempt")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if gallery exists
    // Use select to avoid Prisma errors if year/category columns don't exist in database
    const gallery = await db.gallery.findUnique({
      where: { id: galleryId },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        featured: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        images: {
          select: {
            id: true,
            url: true,
            publicId: true,
            alt: true,
            caption: true,
            order: true,
            createdAt: true
            // Note: Not selecting 'year' or 'category' fields to avoid database errors
            // if these columns don't exist yet
          }
        }
      }
    })

    if (!gallery) {
      console.error(`❌ Gallery not found: ${galleryId}`)
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    console.log(`📋 Gallery found: "${gallery.title}" with ${gallery.images?.length || 0} images`)

    // Delete all images from Cloudinary first (non-blocking)
    let deletedFromCloudinary = 0
    let cloudinaryErrors = 0
    
    if (gallery.images && gallery.images.length > 0) {
      console.log(`🗑️ Deleting ${gallery.images.length} images from Cloudinary...`)
      
      // Wrap Cloudinary deletion in try-catch to prevent it from failing the entire operation
      try {
        // Use Promise.allSettled to handle all deletions independently
        const cloudinaryDeletions = gallery.images.map(async (image) => {
          if (!image.publicId) {
            console.warn(`⚠️ Image ${image.id} has no publicId, skipping Cloudinary deletion`)
            return { success: false, reason: 'no-publicId' }
          }
          
          try {
            await deleteImage(image.publicId)
            console.log(`✅ Deleted image from Cloudinary: ${image.publicId}`)
            return { success: true, publicId: image.publicId }
          } catch (cloudinaryError: any) {
            const errorMsg = cloudinaryError?.message || String(cloudinaryError)
            console.error(`⚠️ Error deleting image ${image.publicId} from Cloudinary:`, errorMsg)
            return { success: false, reason: 'cloudinary-error', error: errorMsg }
          }
        })
        
        const results = await Promise.allSettled(cloudinaryDeletions)
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              deletedFromCloudinary++
            } else {
              cloudinaryErrors++
            }
          } else {
            cloudinaryErrors++
            console.error(`⚠️ Promise rejected for Cloudinary deletion:`, result.reason)
          }
        })
        
        console.log(`📊 Cloudinary deletion summary: ${deletedFromCloudinary} deleted, ${cloudinaryErrors} errors`)
      } catch (cloudinaryBatchError) {
        // If the entire Cloudinary batch fails, log but continue with database deletion
        console.error(`⚠️ Critical error in Cloudinary batch deletion:`, cloudinaryBatchError)
        cloudinaryErrors = gallery.images.length
        console.log(`⚠️ Continuing with database deletion despite Cloudinary errors`)
      }
    }

    // Delete the gallery (cascade will automatically delete all images from database)
    const imageCount = gallery.images?.length || 0
    console.log(`🗑️ Deleting gallery from database (cascade will delete ${imageCount} images)...`)
    
    try {
      const deleteResult = await db.gallery.delete({
        where: { id: galleryId }
      })
      console.log(`✅ Gallery "${gallery.title}" deleted successfully`)
      console.log(`✅ Delete result:`, deleteResult)
    } catch (dbError: any) {
      console.error(`❌ Database deletion error:`, dbError)
      
      // Log Prisma-specific error details
      if (dbError.code) {
        console.error(`❌ Prisma error code: ${dbError.code}`)
      }
      if (dbError.meta) {
        console.error(`❌ Prisma error meta:`, dbError.meta)
      }
      if (dbError.message) {
        console.error(`❌ Database error message:`, dbError.message)
      }
      
      // Re-throw with more context
      const enhancedError = new Error(
        `Database deletion failed: ${dbError.message || String(dbError)}`
      )
      ;(enhancedError as any).originalError = dbError
      throw enhancedError
    }

    return NextResponse.json({ 
      message: "Gallery deleted successfully",
      deletedImages: gallery.images?.length || 0,
      deletedFromCloudinary,
      cloudinaryErrors
    })
  } catch (error) {
    console.error("❌ Error deleting gallery:", error)
    
    let errorMessage = "Unknown error"
    let errorDetails: any = {}
    let prismaCode: string | undefined
    
    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      }
      
      // Check for Prisma error in originalError
      const originalError = (error as any).originalError
      if (originalError) {
        if (originalError.code) {
          prismaCode = originalError.code
          errorDetails.prismaCode = originalError.code
        }
        if (originalError.meta) {
          errorDetails.prismaMeta = originalError.meta
        }
        errorDetails.originalMessage = originalError.message
      }
      
      // Also check if error itself has Prisma properties
      if ((error as any).code) {
        prismaCode = (error as any).code
        errorDetails.prismaCode = (error as any).code
      }
      if ((error as any).meta) {
        errorDetails.prismaMeta = (error as any).meta
      }
    } else if (typeof error === "string") {
      errorMessage = error
    } else if (error && typeof error === "object") {
      // Handle Prisma errors directly
      if ((error as any).code) {
        prismaCode = (error as any).code
        errorMessage = (error as any).message || errorMessage
        errorDetails = {
          prismaCode: (error as any).code,
          prismaMeta: (error as any).meta,
          message: (error as any).message
        }
      } else {
        errorDetails = error
        errorMessage = (error as any).message || JSON.stringify(error).substring(0, 200)
      }
    }
    
    console.error("Error details:", {
      message: errorMessage,
      prismaCode,
      ...errorDetails
    })

    // Ensure we always return a valid JSON response
    try {
      const responseBody: any = { 
        error: "Failed to delete gallery",
        message: errorMessage
      }
      
      if (process.env.NODE_ENV === "development") {
        responseBody.details = errorDetails
        if (prismaCode) {
          responseBody.prismaCode = prismaCode
        }
      }
      
      return NextResponse.json(responseBody, { status: 500 })
    } catch (jsonError) {
      // Fallback if JSON serialization fails
      console.error("Failed to serialize error response:", jsonError)
      return new NextResponse(
        JSON.stringify({ error: "Failed to delete gallery", message: String(errorMessage) }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      )
    }
  }
}