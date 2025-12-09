// src/app/api/gallery/images/[id]/publish/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// PATCH - Publish or unpublish an image
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { published } = body

    if (typeof published !== "boolean") {
      return NextResponse.json(
        { error: "published field must be a boolean" },
        { status: 400 }
      )
    }

    // Update the image
    const updatedImage = await db.galleryImage.update({
      where: { id },
      data: { published },
      include: {
        gallery: {
          select: {
            id: true,
            title: true,
            category: true,
            country: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      image: {
        id: updatedImage.id,
        published: updatedImage.published,
        url: updatedImage.url,
        alt: updatedImage.alt,
        caption: updatedImage.caption,
      },
    })
  } catch (error) {
    console.error("❌ Error updating image publish status:", error)
    return NextResponse.json(
      {
        error: "Failed to update image publish status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

