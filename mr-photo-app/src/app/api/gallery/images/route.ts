// src/app/api/gallery/images/route.ts - UPDATED with pagination support
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const country = searchParams.get("country")
    const year = searchParams.get("year")
    const limit = parseInt(searchParams.get("limit") || "15")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Build where clause for filtering galleries
    const galleryWhere: any = {
      published: true
    }

    if (country && country !== "all") {
      galleryWhere.country = country
    }

    // Build where clause for images (year and category filters)
    const imageWhere: any = {
      gallery: galleryWhere,
      published: true // Only show published images on the public gallery
    }

    if (year && year !== "all") {
      imageWhere.year = parseInt(year)
    }

    // Filter by image category (not gallery category)
    // Note: Categories can be comma-separated, so we need to handle that
    // We'll filter in memory after fetching to handle comma-separated categories properly
    
    // Try to query with year/category filters, fallback if columns don't exist
    let totalCount: number
    let images: any[]
    
    // Base where clause without year/category filters (for fallback)
    const imageWhereBase: any = {
      gallery: galleryWhere,
      published: true // Only show published images on the public gallery
    }
    
    // Base select fields (without year/category that might not exist)
    const baseSelect = {
      id: true,
      url: true,
      publicId: true,
      alt: true,
      caption: true,
      order: true,
      loves: true,
      galleryId: true,
      createdAt: true,
      gallery: {
        select: {
          id: true,
          title: true,
          category: true,
          country: true
        }
      }
    }
    
    // Helper function to check if image matches category (handles comma-separated)
    const matchesCategory = (imgCategory: string | null | undefined, searchCategory: string): boolean => {
      if (!imgCategory) return false
      // Split by comma and check if any matches (case-insensitive, trimmed)
      const categories = imgCategory.split(",").map(c => c.trim().toLowerCase())
      return categories.includes(searchCategory.toLowerCase())
    }
    
    try {
      // First, try to get images with year/category fields
      // We'll filter by category in memory to handle comma-separated values
      let queryWhere = { ...imageWhere }
      
      // Remove category from where clause - we'll filter in memory
      if (category && category !== "all") {
        delete queryWhere.category
      }
      
      // Try to get images with year/category fields
      images = await db.galleryImage.findMany({
        where: queryWhere,
        select: {
          ...baseSelect,
          year: true,
          category: true,
        },
        orderBy: { createdAt: "desc" }
      })

      // Filter by category in memory (handles comma-separated categories)
      if (category && category !== "all") {
        images = images.filter(img => {
          const imgCategory = (img as any).category || img.gallery.category
          return matchesCategory(imgCategory, category)
        })
      }

      // Filter by year if requested
      if (year && year !== "all") {
        const yearFilter = parseInt(year)
        images = images.filter(img => {
          const imgYear = (img as any).year !== undefined 
            ? (img as any).year 
            : new Date(img.createdAt).getFullYear()
          return imgYear === yearFilter
        })
      }

      totalCount = images.length
      images = images.slice(offset, offset + limit)
    } catch (error: any) {
      // If year or category columns don't exist (P2022), remove filters and use base fields
      if (error?.code === 'P2022' || error?.message?.includes('Unknown column') || error?.message?.includes('column') || error?.message?.includes('field')) {
        // Remove year and category from where clause
        const fallbackWhere = { ...imageWhereBase }
        
        // Get all images without year/category filters
        const allImages = await db.galleryImage.findMany({
          where: fallbackWhere,
          select: baseSelect,
          orderBy: { createdAt: "desc" }
        })

        // Filter by year using createdAt if year filter was requested
        let filteredImages = allImages
        if (year && year !== "all") {
          const yearFilter = parseInt(year)
          filteredImages = filteredImages.filter(img => {
            const imgYear = new Date(img.createdAt).getFullYear()
            return imgYear === yearFilter
          })
        }

        // Filter by category if requested (handles comma-separated categories)
        if (category && category !== "all") {
          filteredImages = filteredImages.filter(img => {
            // Try image category first, fallback to gallery category
            const imgCategory = (img as any).category || img.gallery.category
            return matchesCategory(imgCategory, category)
          })
        }

        totalCount = filteredImages.length
        images = filteredImages.slice(offset, offset + limit)
      } else {
        throw error
      }
    }

    const formattedImages = images.map(image => {
      // Safely get year and category, with fallbacks
      const imageYear = (image as any).year !== undefined 
        ? (image as any).year 
        : new Date(image.createdAt).getFullYear()
      
      const imageCategory = (image as any).category !== undefined && (image as any).category !== null
        ? (image as any).category
        : (image.gallery.category || "Others")
      
      return {
        id: image.id,
        title: image.alt || image.caption || image.gallery.title || "Untitled",
        imageUrl: image.url,
        category: imageCategory,
        country: image.gallery.country || "unknown",
        loves: image.loves || 0,
        year: imageYear,
        createdAt: image.createdAt.toISOString(),
        galleryId: image.gallery.id,
        galleryTitle: image.gallery.title
      }
    })

    // Return with caching headers for better performance
    return NextResponse.json({
      images: formattedImages,
      total: totalCount,
      limit,
      offset,
      hasMore: offset + limit < totalCount
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
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