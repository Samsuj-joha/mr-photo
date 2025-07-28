import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { uploadImage } from "@/lib/cloudinary"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const galleryId = formData.get("galleryId") as string
    const alt = formData.get("alt") as string || ""
    const caption = formData.get("caption") as string || ""

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (!galleryId) {
      return NextResponse.json(
        { error: "Gallery ID is required" },
        { status: 400 }
      )
    }

    // Check if gallery exists
    const gallery = await db.gallery.findUnique({
      where: { id: galleryId }
    })

    if (!gallery) {
      return NextResponse.json(
        { error: "Gallery not found" },
        { status: 404 }
      )
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(file, `mr-photography/galleries/${galleryId}`) as any

    if (!uploadResult) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      )
    }

    // Get the current highest order in the gallery
    const lastImage = await db.galleryImage.findFirst({
      where: { galleryId },
      orderBy: { order: 'desc' }
    })

    const nextOrder = lastImage ? lastImage.order + 1 : 0

    // Save to database
    const galleryImage = await db.galleryImage.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        alt,
        caption,
        order: nextOrder,
        galleryId,
      }
    })

    return NextResponse.json({
      id: galleryImage.id,
      url: galleryImage.url,
      publicId: galleryImage.publicId,
      alt: galleryImage.alt,
      caption: galleryImage.caption,
      order: galleryImage.order,
      galleryId: galleryImage.galleryId,
      createdAt: galleryImage.createdAt,
    }, { status: 201 })

  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}