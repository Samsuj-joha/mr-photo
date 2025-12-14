// src/app/api/admin/categories/route.ts
// API endpoint to manage categories (add, remove, list)

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - List all categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

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

// POST - Add a new category
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
    const { category } = body

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    const categoryName = category.trim()
    const normalizedCategoryName = categoryName.toLowerCase().trim()

    // Helper function to normalize a category name for comparison
    const normalizeForComparison = (cat: string): string => {
      return cat.trim().toLowerCase()
    }

    // Helper function to check if a category string contains the category (handles comma-separated)
    const containsCategory = (categoryString: string | null): boolean => {
      if (!categoryString) return false
      const categories = categoryString.split(',').map(c => normalizeForComparison(c))
      return categories.includes(normalizedCategoryName)
    }

    // Check if category already exists in galleries, images, or portfolios
    // We need to check all records and see if any contain this category (handles comma-separated)
    const allGalleries = await db.gallery.findMany({
      where: { 
        category: { 
          not: null,
          not: ""
        } 
      },
      select: { category: true }
    })

    const allImages = await db.galleryImage.findMany({
      where: { 
        category: { 
          not: null,
          not: ""
        } 
      },
      select: { category: true }
    })

    const allPortfolios = await db.portfolio.findMany({
      where: { 
        category: { 
          not: null,
          not: ""
        } 
      },
      select: { category: true }
    })

    const existsInGalleries = allGalleries.some(g => g.category && containsCategory(g.category))
    const existsInImages = allImages.some(img => img.category && containsCategory(img.category))
    const existsInPortfolios = allPortfolios.some(p => p.category && containsCategory(p.category))

    if (existsInGalleries || existsInImages || existsInPortfolios) {
      return NextResponse.json({
        success: false,
        error: "Category already exists",
        message: `Category "${categoryName}" already exists in the system`,
        category: categoryName
      }, { status: 400 })
    }

    // Create a temporary unpublished gallery to register the category
    try {
      const newGallery = await db.gallery.create({
        data: {
          title: `Category: ${categoryName}`,
          description: `Temporary gallery for category: ${categoryName}`,
          category: categoryName.trim(),
          published: false,
          featured: false
        }
      })

      console.log(`✅ Category "${categoryName}" added successfully, gallery ID: ${newGallery.id}`)

      return NextResponse.json({
        success: true,
        message: "Category added successfully",
        category: categoryName
      })
    } catch (createError: any) {
      console.error("❌ Error creating category gallery:", createError)
      
      // Check if it's a unique constraint error (category might already exist)
      if (createError.code === 'P2002' || createError.message?.includes('Unique constraint')) {
        return NextResponse.json({
          success: false,
          error: "Category already exists",
          message: `Category "${categoryName}" already exists in the system`,
          category: categoryName
        }, { status: 400 })
      }
      
      // Re-throw to be caught by outer catch
      throw createError
    }
  } catch (error) {
    console.error("Error adding category:", error)
    return NextResponse.json(
      { error: "Failed to add category", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

// DELETE - Remove a category (only if no items use it)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    if (!category) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    const normalizedCategory = category.toLowerCase().trim()

    // Helper function to check if a category string contains the category (handles comma-separated)
    const containsCategory = (categoryString: string | null): boolean => {
      if (!categoryString) return false
      const categories = categoryString.split(',').map(c => c.trim().toLowerCase())
      return categories.includes(normalizedCategory)
    }

    // Check if category is used by any published galleries, images, or portfolios
    // Get all records and check if they contain this category
    const allGalleries = await db.gallery.findMany({
      where: { 
        published: true 
      },
      select: { category: true }
    })

    const allImages = await db.galleryImage.findMany({
      select: { category: true }
    })

    const allPortfolios = await db.portfolio.findMany({
      where: { 
        published: true 
      },
      select: { category: true }
    })

    // Filter out null/empty categories in JavaScript
    const galleriesWithCategory = allGalleries
      .filter(g => g.category && g.category.trim() !== "")
      .filter(g => containsCategory(g.category))
      .length

    const imagesWithCategory = allImages
      .filter(img => img.category && img.category.trim() !== "")
      .filter(img => containsCategory(img.category))
      .length

    const portfoliosWithCategory = allPortfolios
      .filter(p => p.category && p.category.trim() !== "")
      .filter(p => containsCategory(p.category))
      .length

    if (galleriesWithCategory > 0 || imagesWithCategory > 0 || portfoliosWithCategory > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete category", 
          message: `Category is used by ${galleriesWithCategory} galleries, ${imagesWithCategory} images, and ${portfoliosWithCategory} portfolios`,
          details: {
            galleries: galleriesWithCategory,
            images: imagesWithCategory,
            portfolios: portfoliosWithCategory
          }
        },
        { status: 400 }
      )
    }

    // Delete unpublished temporary galleries that contain this category (handles comma-separated)
    const unpublishedGalleries = await db.gallery.findMany({
      where: {
        published: false
      },
      select: { id: true, category: true }
    })

    // Filter galleries that have this category (handles null/empty and comma-separated)
    const galleriesToDelete = unpublishedGalleries
      .filter(g => g.category && g.category.trim() !== "")
      .filter(g => containsCategory(g.category))

    const deletedIds = galleriesToDelete.map(g => g.id)

    if (deletedIds.length > 0) {
      await db.gallery.deleteMany({
        where: {
          id: { in: deletedIds }
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: "Category removed successfully",
      deletedCount: deletedIds.length
    })
  } catch (error) {
    console.error("Error removing category:", error)
    return NextResponse.json(
      { error: "Failed to remove category", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

