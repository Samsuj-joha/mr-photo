// src/app/api/admin/images/update-category/route.ts
// Update image category (supports multiple categories as comma-separated)

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imageId, category } = body

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      )
    }

    if (!category || typeof category !== 'string') {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      )
    }

    // Update image category
    await db.galleryImage.update({
      where: { id: imageId },
      data: { category: category.trim() }
    })

    return NextResponse.json({
      success: true,
      message: "Image category updated successfully",
      imageId,
      category
    })

  } catch (error: any) {
    console.error("Error updating image category:", error)
    return NextResponse.json(
      {
        error: "Failed to update image category",
        details: error.message
      },
      { status: 500 }
    )
  }
}

