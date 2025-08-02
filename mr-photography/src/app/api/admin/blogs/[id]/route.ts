import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db" // Use your existing db import

// GET - Fetch single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await db.blog.findUnique({
      where: { id: params.id }
    })

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    )
  }
}

// PATCH - Partial update (for toggles like published/featured)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    const updatedBlog = await db.blog.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(updatedBlog)
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if blog exists
    const existingBlog = await db.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      )
    }

    await db.blog.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Blog deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    )
  }
}