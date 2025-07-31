// src/app/api/gallery/options/categories/route.ts - FIXED VERSION
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("📂 Fetching categories from database...")
    
    // First, let's check if we have any galleries at all
    const totalGalleries = await db.gallery.count()
    console.log(`📊 Total galleries in database: ${totalGalleries}`)
    
    // Get unique categories from published galleries
    const categories = await db.gallery.groupBy({
      by: ['category'],
      where: {
        published: true,
        category: { 
          not: null,
          not: "" // Exclude empty strings
        }
      },
      _count: {
        category: true
      }
    })

    console.log(`✅ Found ${categories.length} unique categories:`, categories)

    // If no categories found, let's check unpublished galleries too
    if (categories.length === 0) {
      console.log("🔍 No published categories found, checking all galleries...")
      const allCategories = await db.gallery.groupBy({
        by: ['category'],
        where: {
          category: { 
            not: null,
            not: ""
          }
        },
        _count: {
          category: true
        }
      })
      console.log(`📋 All categories (including unpublished):`, allCategories)
    }

    const formattedCategories = categories.map(category => ({
      value: category.category,
      label: category.category.charAt(0).toUpperCase() + category.category.slice(1),
      count: category._count.category
    }))

    console.log(`🎯 Returning formatted categories:`, formattedCategories)

    return NextResponse.json({ 
      categories: formattedCategories,
      debug: {
        totalGalleries,
        categoriesFound: categories.length,
        rawCategories: categories
      }
    })
  } catch (error) {
    console.error("❌ Error fetching categories:", error)
    return NextResponse.json(
      { 
        categories: [],
        error: "Failed to fetch categories",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}