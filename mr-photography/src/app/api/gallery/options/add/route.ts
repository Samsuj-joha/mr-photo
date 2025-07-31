// src/app/api/gallery/options/add/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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

    const body = await request.json()
    const { type, value, label } = body

    // Validate input
    if (!type || !value || !label) {
      return NextResponse.json(
        { error: "Type, value, and label are required" },
        { status: 400 }
      )
    }

    if (type !== "category" && type !== "country") {
      return NextResponse.json(
        { error: "Type must be either 'category' or 'country'" },
        { status: 400 }
      )
    }

    // Create a temporary gallery entry to add the new option to the database
    // This ensures the option appears in our dynamic dropdowns
    const tempGalleryData: any = {
      title: `Temp ${type} - ${label}`,
      description: `Temporary gallery for ${type}: ${label}`,
      featured: false,
      published: false, // Keep unpublished so it doesn't show on frontend
    }

    if (type === "category") {
      tempGalleryData.category = value
      tempGalleryData.country = "temp"
    } else {
      tempGalleryData.category = "temp"
      tempGalleryData.country = value
    }

    // Check if this option already exists
    const existingGallery = await db.gallery.findFirst({
      where: type === "category" 
        ? { category: value }
        : { country: value }
    })

    if (existingGallery) {
      return NextResponse.json(
        { error: `${type === "category" ? "Category" : "Country"} already exists` },
        { status: 409 }
      )
    }

    // Create temporary gallery to register the new option
    await db.gallery.create({
      data: tempGalleryData
    })

    return NextResponse.json({
      message: `${type === "category" ? "Category" : "Country"} added successfully`,
      [type]: { value, label }
    }, { status: 201 })

  } catch (error) {
    console.error(`Error adding new ${request.json}:`, error)
    return NextResponse.json(
      { error: `Failed to add new ${request.json}` },
      { status: 500 }
    )
  }
}