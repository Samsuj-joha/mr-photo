// src/app/api/gallery/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch all galleries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")

    const where: any = {}
    
    if (category && category !== "all") {
      where.category = category
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

    const formattedGalleries = galleries.map(gallery => ({
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
    }))

    return NextResponse.json(formattedGalleries)
  } catch (error) {
    console.error("Error fetching galleries:", error)
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    )
  }
}

// POST - Create new gallery
export async function POST(request: NextRequest) {
  try {
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

    const gallery = await db.gallery.create({
      data: {
        title,
        description: description || "",
        category,
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

    return NextResponse.json(formattedGallery, { status: 201 })
  } catch (error) {
    console.error("Error creating gallery:", error)
    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    )
  }
}