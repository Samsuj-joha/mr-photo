// src/app/api/admin/categories/all/route.ts
// API endpoint to fetch all categories from galleries, gallery images, and portfolios

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all unique categories from galleries
    const galleryCategories = await db.gallery.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Get all unique categories from gallery images
    const imageCategories = await db.galleryImage.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Get all unique categories from portfolios
    const portfolioCategories = await db.portfolio.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Combine all categories
    const allCategories = new Set<string>()
    
    galleryCategories.forEach(cat => {
      if (cat.category) allCategories.add(cat.category)
    })
    
    imageCategories.forEach(cat => {
      if (cat.category) allCategories.add(cat.category)
    })
    
    portfolioCategories.forEach(cat => {
      if (cat.category) allCategories.add(cat.category)
    })

    // Convert to array with id and name format
    const categories = Array.from(allCategories)
      .sort()
      .map((name, index) => ({
        id: index + 1,
        name: name
      }))

    return NextResponse.json({
      success: true,
      categories,
      counts: {
        galleries: galleryCategories.length,
        images: imageCategories.length,
        portfolios: portfolioCategories.length,
        total: categories.length
      }
    })
  } catch (error) {
    console.error("Error fetching all categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        categories: [],
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

