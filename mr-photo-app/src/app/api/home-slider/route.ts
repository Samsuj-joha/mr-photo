// src/app/api/home-slider/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch all slider images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const where = activeOnly ? { active: true } : {}

    const sliderImages = await db.homeSlider.findMany({
      where,
      orderBy: { order: "asc" }
    })

    return NextResponse.json(sliderImages)
  } catch (error) {
    console.error("Error fetching slider images:", error)
    return NextResponse.json(
      { error: "Failed to fetch slider images" },
      { status: 500 }
    )
  }
}

// POST - Create new slider image
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
    const { title, description, imageUrl, publicId, alt, order, active, linkUrl, linkText } = body

    // Validate required fields
    if (!imageUrl || !publicId) {
      return NextResponse.json(
        { error: "Image URL and public ID are required" },
        { status: 400 }
      )
    }

    const sliderImage = await db.homeSlider.create({
      data: {
        title: title || "",
        description: description || "",
        imageUrl,
        publicId,
        alt: alt || "",
        order: order || 0,
        active: active !== undefined ? active : true,
        linkUrl: linkUrl || null,
        linkText: linkText || null,
      }
    })

    return NextResponse.json(sliderImage, { status: 201 })
  } catch (error) {
    console.error("Error creating slider image:", error)
    return NextResponse.json(
      { error: "Failed to create slider image" },
      { status: 500 }
    )
  }
}

// PUT - Update slider order
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { sliders } = body

    // Update order for multiple sliders
    await Promise.all(
      sliders.map((slider: any) =>
        db.homeSlider.update({
          where: { id: slider.id },
          data: { order: slider.order }
        })
      )
    )

    return NextResponse.json({ message: "Order updated successfully" })
  } catch (error) {
    console.error("Error updating slider order:", error)
    return NextResponse.json(
      { error: "Failed to update slider order" },
      { status: 500 }
    )
  }
}