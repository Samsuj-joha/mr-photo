import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteImage } from "@/lib/cloudinary"

// DELETE - Delete single image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find the image first
    const image = await db.galleryImage.findUnique({
      where: { id: params.id }
    })

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    try {
      await deleteImage(image.publicId)
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await db.galleryImage.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}