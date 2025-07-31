// src/app/api/test/route.ts - Database Connection Test
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  console.log("🧪 Testing database connection...")
  
  try {
    // Test 1: Basic connection
    console.log("1️⃣ Testing basic connection...")
    await db.$connect()
    console.log("✅ Database connected successfully")

    // Test 2: Check if Gallery table exists
    console.log("2️⃣ Testing Gallery table...")
    const galleryCount = await db.gallery.count()
    console.log(`✅ Gallery table accessible, found ${galleryCount} records`)

    // Test 3: Check if all required fields exist
    console.log("3️⃣ Testing Gallery fields...")
    const testGallery = await db.gallery.findFirst({
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        country: true,
        featured: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      }
    })
    console.log("✅ All Gallery fields accessible")

    // Test 4: Check if GalleryImage table exists
    console.log("4️⃣ Testing GalleryImage table...")
    const imageCount = await db.galleryImage.count()
    console.log(`✅ GalleryImage table accessible, found ${imageCount} records`)

    // Test 5: Check if GalleryImage has loves field
    console.log("5️⃣ Testing GalleryImage fields...")
    const testImage = await db.galleryImage.findFirst({
      select: {
        id: true,
        url: true,
        publicId: true,
        alt: true,
        caption: true,
        order: true,
        loves: true,
        galleryId: true,
        createdAt: true,
      }
    })
    console.log("✅ All GalleryImage fields accessible")

    await db.$disconnect()

    return NextResponse.json({
      status: "✅ ALL TESTS PASSED",
      tests: {
        connection: "✅ Connected",
        galleryTable: `✅ ${galleryCount} galleries found`,
        galleryFields: "✅ All fields accessible",
        imageTable: `✅ ${imageCount} images found`,
        imageFields: "✅ All fields accessible (including loves)"
      },
      message: "Database is ready for use!",
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("❌ Database test failed:", error)
    
    let errorType = "Unknown error"
    let solution = "Check your database setup"

    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        errorType = "Connection Error"
        solution = "Check DATABASE_URL in .env file and ensure database is running"
      } else if (error.message.includes('does not exist')) {
        errorType = "Table Missing"
        solution = "Run 'npx prisma db push' to create tables"
      } else if (error.message.includes('Unknown field')) {
        errorType = "Schema Mismatch"
        solution = "Run 'npx prisma db push' to update schema"
      }
    }

    return NextResponse.json({
      status: "❌ TEST FAILED",
      errorType,
      solution,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}