// src/app/api/admin/gallery/default/route.ts
// Ensure a default gallery exists (e.g. "Main Gallery") and return it.

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Try to find an existing default gallery
    let defaultGallery = await db.gallery.findFirst({
      where: {
        title: "Main Gallery",
      }
    })

    if (!defaultGallery) {
      // Create a default gallery if it doesn't exist
      defaultGallery = await db.gallery.create({
        data: {
          title: "Main Gallery",
          description: "Main photography gallery",
          category: "general",
          published: true,
          featured: false,
        }
      })
    }

    return NextResponse.json({
      id: defaultGallery.id,
      title: defaultGallery.title,
      published: defaultGallery.published,
      category: defaultGallery.category,
    })
  } catch (error) {
    console.error("Error ensuring default gallery:", error)
    return NextResponse.json(
      { error: "Failed to get or create default gallery" },
      { status: 500 }
    )
  }
}


