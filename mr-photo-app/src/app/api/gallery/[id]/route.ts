// src/app/api/gallery/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch single gallery
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gallery = await db.gallery.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" }
        },
        _count: {
          select: { images: true }
        }
      }
    })

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
  { params }: { params: { id: string } }
) {
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

    const gallery = await db.gallery.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if gallery exists
    const gallery = await db.gallery.findUnique({
      where: { id: params.id },
      include: { images: true }
    })

    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    // Delete all images first (this will handle Cloudinary cleanup in a real implementation)
    await db.galleryImage.deleteMany({
      where: { galleryId: params.id }
    })

    // Delete the gallery
    await db.gallery.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: "Gallery deleted successfully",
      deletedImages: gallery.images.length 
    })
  } catch (error) {
    console.error("Error deleting gallery:", error)
    return NextResponse.json(
      { error: "Failed to delete gallery" },
      { status: 500 }
    )
  }
}