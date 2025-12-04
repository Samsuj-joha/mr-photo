// src/app/api/home-slider/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteImage } from "@/lib/cloudinary"

// PUT - Update slider image
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, alt, order, active, linkUrl, linkText } = body

    const sliderImage = await db.homeSlider.update({
      where: { id },
      data: {
        title: title || "",
        description: description || "",
        alt: alt || "",
        order: order || 0,
        active: active !== undefined ? active : true,
        linkUrl: linkUrl || null,
        linkText: linkText || null,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(sliderImage)
  } catch (error) {
    console.error("Error updating slider image:", error)
    return NextResponse.json(
      { error: "Failed to update slider image" },
      { status: 500 }
    )
  }
}

// DELETE - Delete slider image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find the slider image first
    const sliderImage = await db.homeSlider.findUnique({
      where: { id }
    })

    if (!sliderImage) {
      return NextResponse.json(
        { error: "Slider image not found" },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    try {
      await deleteImage(sliderImage.publicId)
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError)
    }

    // Delete from database
    await db.homeSlider.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Slider image deleted successfully" })
  } catch (error) {
    console.error("Error deleting slider image:", error)
    return NextResponse.json(
      { error: "Failed to delete slider image" },
      { status: 500 }
    )
  }
}