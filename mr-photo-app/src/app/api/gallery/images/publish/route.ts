// src/app/api/gallery/images/publish/route.ts - Bulk publish endpoint
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST - Publish multiple images at once
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imageIds, published } = body

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: "imageIds must be a non-empty array" },
        { status: 400 }
      )
    }

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "published field must be a boolean" },
        { status: 400 }
      )
    }

    // Update all images
    const result = await db.galleryImage.updateMany({
      where: {
        id: {
          in: imageIds,
        },
      },
      data: { published },
    })

    return NextResponse.json({
      success: true,
      count: result.count,
      published,
    })
  } catch (error) {
    console.error("❌ Error bulk updating image publish status:", error)
    return NextResponse.json(
      {
        error: "Failed to update image publish status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
