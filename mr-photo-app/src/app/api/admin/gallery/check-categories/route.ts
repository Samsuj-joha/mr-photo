// src/app/api/admin/gallery/check-categories/route.ts
// API endpoint to check categories in the database

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all images with their categories
    const images = await db.galleryImage.findMany({
      select: {
        id: true,
        category: true,
        alt: true,
        publicId: true
      }
    })

    // Count by category
    const categoryCount: Record<string, number> = {}
    const samples: Record<string, any> = {}
    
    images.forEach(img => {
      const cat = img.category || 'NULL'
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
      
      if (!samples[cat]) {
        samples[cat] = {
          id: img.id,
          alt: img.alt,
          publicId: img.publicId
        }
      }
    })

    return NextResponse.json({
      success: true,
      total: images.length,
      categories: categoryCount,
      samples
    })

  } catch (error: any) {
    console.error("❌ Check failed:", error)
    return NextResponse.json({
      success: false,
      error: "Check failed",
      message: error?.message || String(error)
    }, { status: 500 })
  }
}

