// src/app/api/gallery/options/categories/route.ts - UPDATED to get categories from images
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("📂 Fetching categories from database...")
    
    // Get unique categories from IMAGES (not galleries) - this is what users see
    const imageCategories = await db.galleryImage.groupBy({
      by: ['category'],
      where: {
        category: { 
          not: null,
          not: "" // Exclude empty strings
        },
        gallery: {
          published: true // Only from published galleries
        }
      },
      _count: {
        category: true
      }
    })

    console.log(`✅ Found ${imageCategories.length} unique image categories:`, imageCategories)

    // Also get categories from galleries as fallback
    const galleryCategories = await db.gallery.groupBy({
      by: ['category'],
      where: {
        published: true,
        category: { 
          not: null,
          not: ""
        }
      },
      _count: {
        category: true
      }
    })

    // Combine both, prioritizing image categories
    // Handle comma-separated categories from images
    const categoryMap = new Map<string, number>()
    
    // Helper function to check if image matches category (handles comma-separated)
    const matchesCategory = (imgCategory: string | null | undefined, searchCategory: string): boolean => {
      if (!imgCategory) return false
      const categories = imgCategory.split(",").map(c => c.trim().toLowerCase())
      return categories.includes(searchCategory.toLowerCase())
    }
    
    // Get all unique category names from images
    const allImageCategoryNames = new Set<string>()
    imageCategories.forEach(cat => {
      if (cat.category) {
        const categories = cat.category.split(",").map(c => c.trim()).filter(c => c)
        categories.forEach(singleCat => allImageCategoryNames.add(singleCat.toLowerCase()))
      }
    })
    
    // Add gallery categories to the set (for complete list)
    galleryCategories.forEach(cat => {
      if (cat.category) {
        allImageCategoryNames.add(cat.category.toLowerCase())
      }
    })
    
    // Count actual images for each category
    // Get all published images first
    const allImages = await db.galleryImage.findMany({
      where: {
        gallery: { published: true }
      },
      select: {
        category: true,
        gallery: {
          select: {
            category: true
          }
        }
      }
    })
    
    // Count images for each category
    for (const categoryName of allImageCategoryNames) {
      const count = allImages.filter(img => {
        const imgCategory = img.category || img.gallery.category
        if (!imgCategory) return false
        const categories = imgCategory.split(",").map(c => c.trim().toLowerCase())
        return categories.includes(categoryName.toLowerCase())
      }).length
      categoryMap.set(categoryName, count)
    }

    const formattedCategories = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        value: category,
        label: category.charAt(0).toUpperCase() + category.slice(1),
        count: count
      }))
      .sort((a, b) => b.count - a.count) // Sort by count descending

    console.log(`🎯 Returning formatted categories:`, formattedCategories)

    return NextResponse.json({ 
      categories: formattedCategories,
      debug: {
        imageCategories: imageCategories.length,
        galleryCategories: galleryCategories.length,
        totalCategories: formattedCategories.length
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