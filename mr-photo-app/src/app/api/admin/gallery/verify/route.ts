// src/app/api/admin/gallery/verify/route.ts
// Utility to verify if gallery images exist in Cloudinary and clean up 404s

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Verify gallery images (optionally by galleryId)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const galleryId = searchParams.get("galleryId")

    // Get all gallery images (optionally filtered by gallery)
    const images = await db.galleryImage.findMany({
      where: galleryId ? { galleryId } : {},
      orderBy: { createdAt: "asc" },
      include: {
        gallery: {
          select: { id: true, title: true }
        }
      }
    })

    const verificationResults = await Promise.all(
      images.map(async (image) => {
        try {
          // Try to fetch the image to verify it exists
          // Use GET instead of HEAD as some CDNs handle HEAD differently
          const response = await fetch(image.url, {
            method: "GET",
            headers: {
              Accept: "image/*",
            },
            cache: "no-cache",
          })

          const exists = response.ok
          const contentType = response.headers.get("content-type") || ""
          const isImage = contentType.startsWith("image/")

          // Get additional headers for debugging
          const accessControl = response.headers.get("access-control-allow-origin")
          const cacheControl = response.headers.get("cache-control")
          const contentLength = response.headers.get("content-length")

          return {
            id: image.id,
            title: image.caption || image.alt || "Untitled",
            imageUrl: image.url,
            publicId: image.publicId,
            galleryId: image.galleryId,
            galleryTitle: image.gallery?.title || "Unknown gallery",
            exists: exists && isImage,
            status: response.status,
            contentType,
            isImage,
            accessControl,
            cacheControl,
            contentLength,
            createdAt: image.createdAt,
            diagnostic: {
              urlAccessible: exists,
              isImageType: isImage,
              hasCors: !!accessControl,
              hasContent: !!contentLength,
            },
          }
        } catch (error) {
          return {
            id: image.id,
            title: image.caption || image.alt || "Untitled",
            imageUrl: image.url,
            publicId: image.publicId,
            galleryId: image.galleryId,
            galleryTitle: image.gallery?.title || "Unknown gallery",
            exists: false,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
            createdAt: image.createdAt,
          }
        }
      })
    )

    const summary = {
      total: verificationResults.length,
      exists: verificationResults.filter((r) => r.exists).length,
      missing: verificationResults.filter((r) => !r.exists).length,
    }

    return NextResponse.json({
      summary,
      results: verificationResults,
    })
  } catch (error) {
    console.error("Error verifying gallery images:", error)
    return NextResponse.json(
      { error: "Failed to verify gallery images" },
      { status: 500 }
    )
  }
}

// POST - Auto-cleanup missing images (deletes all 404 images; optional galleryId filter)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { galleryId } = body as { galleryId?: string }

    // Get all gallery images (optionally filtered by gallery)
    const images = await db.galleryImage.findMany({
      where: galleryId ? { galleryId } : {},
    })

    // Check which images are missing
    const missingImages = await Promise.all(
      images.map(async (image) => {
        try {
          const response = await fetch(image.url, {
            method: "HEAD",
            cache: "no-cache",
          })
          return {
            id: image.id,
            exists: response.ok,
            status: response.status,
          }
        } catch (error) {
          return {
            id: image.id,
            exists: false,
            status: "error",
          }
        }
      })
    )

    // Get IDs of missing images
    const missingIds = missingImages
      .filter((img) => !img.exists)
      .map((img) => img.id)

    if (missingIds.length === 0) {
      return NextResponse.json({
        message: "No missing images found. All images exist in Cloudinary.",
        deleted: 0,
        failed: 0,
      })
    }

    // Delete all missing images from database
    const deleteResults = await Promise.all(
      missingIds.map(async (id: string) => {
        try {
          await db.galleryImage.delete({
            where: { id },
          })
          return { id, success: true }
        } catch (error) {
          console.error(`Error deleting gallery image ${id}:`, error)
          return {
            id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      })
    )

    const successCount = deleteResults.filter((r) => r.success).length
    const failCount = deleteResults.filter((r) => !r.success).length

    return NextResponse.json({
      message: "Auto-cleanup completed",
      deleted: successCount,
      failed: failCount,
      details: deleteResults,
    })
  } catch (error) {
    console.error("Error auto-cleaning gallery images:", error)
    return NextResponse.json(
      { error: "Failed to auto-clean missing gallery images" },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete specific gallery image IDs
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { ids } = body as { ids?: string[] }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "No IDs provided" },
        { status: 400 }
      )
    }

    const deleteResults = await Promise.all(
      ids.map(async (id: string) => {
        try {
          await db.galleryImage.delete({
            where: { id },
          })
          return { id, success: true }
        } catch (error) {
          console.error(`Error deleting gallery image ${id}:`, error)
          return {
            id,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          }
        }
      })
    )

    const successCount = deleteResults.filter((r) => r.success).length
    const failCount = deleteResults.filter((r) => !r.success).length

    return NextResponse.json({
      message: "Bulk delete completed",
      deleted: successCount,
      failed: failCount,
      details: deleteResults,
    })
  } catch (error) {
    console.error("Error bulk deleting gallery images:", error)
    return NextResponse.json(
      { error: "Failed to delete gallery images" },
      { status: 500 }
    )
  }
}


