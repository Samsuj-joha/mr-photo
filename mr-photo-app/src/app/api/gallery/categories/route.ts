// src/app/api/gallery/categories/route.ts
// Public API endpoint to fetch all categories (for gallery page)

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Helper function to normalize category names
function normalizeCategory(category: string): string {
  if (!category) return category
  const normalized = category.trim().toLowerCase()
  
  const normalizations: Record<string, string> = {
    'portraits': 'portrait',
    'animals': 'animal',
    'birds': 'bird',
    'events': 'event',
    'sports': 'sport',
  }
  
  return normalizations[normalized] || normalized
}

export async function GET() {
  try {
    // Get all unique categories from galleries, images, and portfolios
    const galleryCategories = await db.gallery.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    const imageCategories = await db.galleryImage.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    const portfolioCategories = await db.portfolio.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Combine all categories and split comma-separated values
    const allCategories = new Set<string>()
    
    // Helper function to split and add categories
    const addCategories = (categoryString: string | null) => {
      if (!categoryString) return
      // Split by comma and add each individual category
      const splitCategories = categoryString.split(',').map(c => c.trim()).filter(c => c.length > 0)
      splitCategories.forEach(cat => {
        // Normalize: capitalize first letter, lowercase rest
        const normalized = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
        allCategories.add(normalized)
      })
    }
    
    galleryCategories.forEach(cat => {
      if (cat.category) addCategories(cat.category)
    })
    
    imageCategories.forEach(cat => {
      if (cat.category) addCategories(cat.category)
    })
    
    portfolioCategories.forEach(cat => {
      if (cat.category) addCategories(cat.category)
    })

    const categories = Array.from(allCategories).sort()

    return NextResponse.json({
      success: true,
      categories
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

