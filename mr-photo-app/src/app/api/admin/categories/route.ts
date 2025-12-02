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

    // Check if category already exists by creating a temporary gallery
    const existing = await db.gallery.findFirst({
      where: { category: categoryName }
    })

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "Category already exists",
        category: categoryName
      })
    }

    // Create a temporary unpublished gallery to register the category
    await db.gallery.create({
      data: {
        title: `Category: ${categoryName}`,
        description: `Temporary gallery for category: ${categoryName}`,
        category: categoryName,
        published: false,
        featured: false
      }
    })

    return NextResponse.json({
      success: true,
      message: "Category added successfully",
      category: categoryName
    })
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

    // Check if category is used by any galleries, images, or portfolios
    const galleriesWithCategory = await db.gallery.count({
      where: { category: category, published: true }
    })

    const imagesWithCategory = await db.galleryImage.count({
      where: { category: category }
    })

    const portfoliosWithCategory = await db.portfolio.count({
      where: { category: category, published: true }
    })

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

    // Delete only unpublished temporary galleries with this category
    const deleted = await db.gallery.deleteMany({
      where: {
        category: category,
        published: false
      }
    })

    return NextResponse.json({
      success: true,
      message: "Category removed successfully",
      deletedCount: deleted.count
    })
  } catch (error) {
    console.error("Error removing category:", error)
    return NextResponse.json(
      { error: "Failed to remove category", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

