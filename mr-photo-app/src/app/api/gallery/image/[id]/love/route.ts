// src/app/api/gallery/image/[id]/love/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST - Increment love count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    console.log(`❤️ Adding love to image: ${id}`)
    
    // Find the image and increment love count
    const image = await db.galleryImage.update({
      where: { id },
      data: {
        loves: {
          increment: 1
        }
      }
    })

    console.log(`✅ Love count updated to: ${image.loves}`)

    return NextResponse.json({
      id: image.id,
      loves: image.loves,
      message: "Love added successfully"
    })
  } catch (error) {
    console.error("❌ Error adding love:", error)
    return NextResponse.json(
      { 
        error: "Failed to add love",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// GET - Get current love count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    const image = await db.galleryImage.findUnique({
      where: { id },
      select: { id: true, loves: true }
    })

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: image.id,
      loves: image.loves
    })
  } catch (error) {
    console.error("❌ Error fetching love count:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch love count",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}