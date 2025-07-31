// src/app/api/gallery/images/route.ts - UPDATED with pagination support
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const country = searchParams.get("country")
    const limit = parseInt(searchParams.get("limit") || "15")
    const offset = parseInt(searchParams.get("offset") || "0")

    console.log("🖼️ Fetching images with filters:", { category, country, limit, offset })

    // Build where clause for filtering galleries
    const galleryWhere: any = {
      published: true
    }
    
    if (category && category !== "all") {
      galleryWhere.category = category
    }

    if (country && country !== "all") {
      galleryWhere.country = country
    }

    // Get total count first
    const totalCount = await db.galleryImage.count({
      where: {
        gallery: galleryWhere
      }
    })

    // Get paginated images from filtered galleries
    const images = await db.galleryImage.findMany({
      where: {
        gallery: galleryWhere
      },
      include: {
        gallery: {
          select: {
            id: true,
            title: true,
            category: true,
            country: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit
    })

    console.log(`✅ Found ${images.length} images (${totalCount} total)`)

    const formattedImages = images.map(image => ({
      id: image.id,
      title: image.alt || image.caption || image.gallery.title || "Untitled",
      imageUrl: image.url,
      category: image.gallery.category,
      country: image.gallery.country || "unknown",
      loves: image.loves || 0,
      galleryId: image.gallery.id,
      galleryTitle: image.gallery.title
    }))

    return NextResponse.json({
      images: formattedImages,
      total: totalCount,
      limit,
      offset,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    console.error("❌ Error fetching gallery images:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch gallery images",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}