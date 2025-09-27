// src/app/api/debug/galleries/route.ts - Debug what's in your database
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Starting database debug...")
    
    // Get all galleries with their details
    const galleries = await db.gallery.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        country: true,
        published: true,
        createdAt: true,
        _count: {
          select: { images: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 Found ${galleries.length} total galleries`)

    // Get unique categories
    const uniqueCategories = [...new Set(galleries.map(g => g.category).filter(Boolean))]
    console.log(`📂 Unique categories:`, uniqueCategories)

    // Get unique countries  
    const uniqueCountries = [...new Set(galleries.map(g => g.country).filter(Boolean))]
    console.log(`🌍 Unique countries:`, uniqueCountries)

    // Count published vs unpublished
    const publishedCount = galleries.filter(g => g.published).length
    const unpublishedCount = galleries.filter(g => !g.published).length

    // Get total images
    const totalImages = await db.galleryImage.count()

    return NextResponse.json({
      status: "✅ Database Debug Complete",
      summary: {
        totalGalleries: galleries.length,
        publishedGalleries: publishedCount,
        unpublishedGalleries: unpublishedCount,
        totalImages: totalImages,
        uniqueCategories: uniqueCategories.length,
        uniqueCountries: uniqueCountries.length
      },
      categories: uniqueCategories,
      countries: uniqueCountries,
      galleries: galleries.map(g => ({
        id: g.id,
        title: g.title,
        category: g.category,
        country: g.country,
        published: g.published,
        imageCount: g._count.images,
        createdAt: g.createdAt
      })),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("❌ Database debug failed:", error)
    return NextResponse.json({
      status: "❌ Debug Failed",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}