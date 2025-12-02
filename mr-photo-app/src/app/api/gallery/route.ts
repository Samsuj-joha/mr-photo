// src/app/api/gallery/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch all galleries
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Fetching galleries...")
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const country = searchParams.get("country")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    const where: any = {}
    
    if (category && category !== "all") {
      where.category = category
    }

    if (country && country !== "all") {
      where.country = country
    }
    
    if (featured !== null) {
      where.featured = featured === "true"
    }
    
    if (published !== null) {
      where.published = published === "true"
    }

    // Try to fetch with year field, fallback if column doesn't exist
    let galleries
    try {
      galleries = await db.gallery.findMany({
        where,
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 1, // Get cover image
            select: {
              id: true,
              url: true,
              publicId: true,
              alt: true,
              caption: true,
              order: true,
              loves: true,
              galleryId: true,
              createdAt: true
              // Explicitly exclude year to avoid errors if column doesn't exist
            }
          },
          _count: {
            select: { images: true }
          }
        },
        orderBy: { createdAt: "desc" }
      })
    } catch (error: any) {
      // If year column doesn't exist (P2022), retry with explicit select
      if (error?.code === 'P2022' && error?.message?.includes('year')) {
        galleries = await db.gallery.findMany({
          where,
          include: {
            images: {
              orderBy: { order: "asc" },
              take: 1,
              select: {
                id: true,
                url: true,
                publicId: true,
                alt: true,
                caption: true,
                order: true,
                loves: true,
                galleryId: true,
                createdAt: true
              }
            },
            _count: {
              select: { images: true }
            }
          },
          orderBy: { createdAt: "desc" }
        })
      } else {
        throw error
      }
    }

    console.log(`✅ Found ${galleries.length} galleries`)

    const formattedGalleries = galleries.map(gallery => ({
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
      country: gallery.country,
      featured: gallery.featured,
      published: gallery.published,
      createdAt: gallery.createdAt,
      updatedAt: gallery.updatedAt,
      imageCount: gallery._count.images,
      coverImage: gallery.images[0]?.url || null,
    }))

    return NextResponse.json(formattedGalleries)
  } catch (error) {
    console.error("❌ Error fetching galleries:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch galleries",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// POST - Create new gallery
export async function POST(request: NextRequest) {
  console.log("🚀 Creating new gallery...")
  
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    console.log("🔐 Session check:", session ? "Valid" : "Invalid")
    
    if (!session || session.user.role !== "ADMIN") {
      console.log("❌ Unauthorized access")
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    console.log("📋 Request body:", body)
    
    const { title, description, category, country, featured, published } = body

    // Validate required fields
    if (!title || !category) {
      console.log("❌ Missing required fields")
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      )
    }

    console.log("✅ Validation passed, creating gallery...")

    // Check if gallery with same category and country already exists
    const whereClause: any = {
      category: category.toLowerCase(),
    }
    
    if (country && country.trim()) {
      whereClause.country = country.toLowerCase()
    } else {
      whereClause.country = null
    }
    
    let existingGallery = null
    try {
      existingGallery = await db.gallery.findFirst({
        where: whereClause,
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 1,
            select: {
              id: true,
              url: true,
              order: true
            }
          },
          _count: {
            select: { images: true }
          }
        }
      }).catch(() => null) // Silently handle if year column doesn't exist
    } catch (findError) {
      console.warn("⚠️ Error checking for existing gallery, continuing with creation:", findError)
      // Continue with creation even if check fails
    }

    if (existingGallery) {
      console.log("🔄 Gallery already exists, returning existing one:", existingGallery.id)
      
      const formattedGallery = {
        id: existingGallery.id,
        title: existingGallery.title,
        description: existingGallery.description,
        category: existingGallery.category,
        country: existingGallery.country,
        featured: existingGallery.featured,
        published: existingGallery.published,
        createdAt: existingGallery.createdAt,
        updatedAt: existingGallery.updatedAt,
        imageCount: existingGallery._count?.images || 0,
        coverImage: existingGallery.images?.[0]?.url || null,
      }

      return NextResponse.json(formattedGallery, { status: 200 })
    }

    // Create new gallery
    const galleryData: any = {
      title: title.trim(),
      category: category.trim().toLowerCase(),
      featured: featured || false,
      published: published !== undefined ? published : true,
    }
    
    // Handle description - set to null if empty
    if (description && description.trim()) {
      galleryData.description = description.trim()
    } else {
      galleryData.description = null
    }
    
    // Only add country if it's provided and not empty
    if (country && country.trim()) {
      galleryData.country = country.trim().toLowerCase()
    } else {
      galleryData.country = null
    }
    
    console.log("📝 Creating gallery with data:", { 
      title: galleryData.title,
      category: galleryData.category,
      country: galleryData.country,
      description: galleryData.description ? galleryData.description.substring(0, 50) + '...' : null,
      featured: galleryData.featured,
      published: galleryData.published
    })
    
    const gallery = await db.gallery.create({
      data: galleryData
    })

    console.log("✅ Gallery created successfully:", gallery.id)

    // Fetch the gallery with relations to get count and cover image
    let imageCount = 0
    let coverImage = null
    
    try {
      const galleryWithRelations = await db.gallery.findUnique({
        where: { id: gallery.id },
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 1,
            select: {
              id: true,
              url: true,
              publicId: true,
              alt: true,
              caption: true,
              order: true,
              loves: true,
              galleryId: true,
              createdAt: true
            }
          },
          _count: {
            select: { images: true }
          }
        }
      })

      if (galleryWithRelations) {
        imageCount = galleryWithRelations._count?.images || 0
        coverImage = galleryWithRelations.images?.[0]?.url || null
      }
    } catch (fetchError) {
      console.warn("⚠️ Could not fetch gallery relations, using defaults:", fetchError)
      // Continue with defaults - this is not critical
    }

    const formattedGallery = {
      id: gallery.id,
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
      country: gallery.country,
      featured: gallery.featured,
      published: gallery.published,
      createdAt: gallery.createdAt,
      updatedAt: gallery.updatedAt,
      imageCount,
      coverImage,
    }

    console.log("✅ Returning formatted gallery:", formattedGallery.id)
    return NextResponse.json(formattedGallery, { status: 201 })
    
  } catch (error) {
    console.error("❌ Error creating gallery:", error)
    console.error("❌ Error stack:", error instanceof Error ? error.stack : 'No stack trace')
    console.error("❌ Error name:", error instanceof Error ? error.name : 'Unknown')
    
    // Check if it's a database connection error
    if (error instanceof Error && (error.message.includes('connect') || error.message.includes('ECONNREFUSED'))) {
      return NextResponse.json(
        { 
          error: "Database connection failed",
          details: error.message,
          suggestion: "Make sure your DATABASE_URL is correct and the database is running"
        },
        { status: 500 }
      )
    }

    // Check if it's a Prisma schema error
    if (error instanceof Error && (error.message.includes('Unknown field') || error.message.includes('Unknown arg'))) {
      return NextResponse.json(
        { 
          error: "Database schema error",
          details: error.message,
          suggestion: "Please run 'npx prisma db push' or 'npx prisma migrate dev' to update your database schema"
        },
        { status: 500 }
      )
    }

    // Check if it's a validation error (Prisma or other)
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('Argument') || error.message.includes('constraint'))) {
      console.error("❌ Validation error details:", {
        message: error.message,
        name: error.name,
        fullError: error
      })
      return NextResponse.json(
        { 
          error: "Validation error",
          details: error.message,
          suggestion: "Please check your input data. Make sure all required fields are filled correctly."
        },
        { status: 400 }
      )
    }

    // Generic error response with full details
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    } : { raw: String(error) }

    return NextResponse.json(
      { 
        error: "Failed to create gallery",
        details: errorMessage,
        errorInfo: errorDetails,
        suggestion: "Check the server logs for more details"
      },
      { status: 500 }
    )
  }
}

// Test endpoint
export async function OPTIONS() {
  return NextResponse.json({
    message: "Gallery API is working",
    timestamp: new Date().toISOString(),
    methods: ["GET", "POST"],
    status: "OK"
  })
}