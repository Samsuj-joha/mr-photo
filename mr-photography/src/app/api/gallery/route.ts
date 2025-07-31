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

    const galleries = await db.gallery.findMany({
      where,
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1, // Get cover image
        },
        _count: {
          select: { images: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

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
    const existingGallery = await db.gallery.findFirst({
      where: {
        category: category.toLowerCase(),
        country: country ? country.toLowerCase() : null,
      },
      include: {
        images: true,
        _count: {
          select: { images: true }
        }
      }
    })

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
        imageCount: existingGallery._count.images,
        coverImage: existingGallery.images[0]?.url || null,
      }

      return NextResponse.json(formattedGallery, { status: 200 })
    }

    // Create new gallery
    const gallery = await db.gallery.create({
      data: {
        title: title.trim(),
        description: description?.trim() || "",
        category: category.trim().toLowerCase(),
        country: country ? country.trim().toLowerCase() : null,
        featured: featured || false,
        published: published !== undefined ? published : true,
      },
      include: {
        images: true,
        _count: {
          select: { images: true }
        }
      }
    })

    console.log("✅ Gallery created successfully:", gallery.id)

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
      imageCount: gallery._count.images,
      coverImage: gallery.images[0]?.url || null,
    }

    return NextResponse.json(formattedGallery, { status: 201 })
    
  } catch (error) {
    console.error("❌ Error creating gallery:", error)
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { 
          error: "Database connection failed",
          details: "Please check your database connection",
          suggestion: "Make sure your DATABASE_URL is correct and the database is running"
        },
        { status: 500 }
      )
    }

    // Check if it's a Prisma schema error
    if (error instanceof Error && error.message.includes('Unknown field')) {
      return NextResponse.json(
        { 
          error: "Database schema error",
          details: error.message,
          suggestion: "Please run 'npx prisma db push' to update your database schema"
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Failed to create gallery",
        details: error instanceof Error ? error.message : String(error)
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