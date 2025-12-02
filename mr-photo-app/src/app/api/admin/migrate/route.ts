// src/app/api/admin/migrate/route.ts
// Admin API endpoint to add missing columns to the database

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Starting database migration...")

    // Check if year column exists
    const checkYearColumn = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryImage' 
      AND column_name = 'year';
    `
    
    const checkCategoryColumn = await db.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'GalleryImage' 
      AND column_name = 'category';
    `

    // Check if Settings table exists
    const checkSettingsTable = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Settings';
    `

    console.log("📊 Column check:", { 
      yearExists: Array.isArray(checkYearColumn) && checkYearColumn.length > 0,
      categoryExists: Array.isArray(checkCategoryColumn) && checkCategoryColumn.length > 0,
      settingsTableExists: Array.isArray(checkSettingsTable) && checkSettingsTable.length > 0
    })

    const results: string[] = []

    // Add year column if it doesn't exist
    if (!Array.isArray(checkYearColumn) || checkYearColumn.length === 0) {
      console.log("➕ Adding year column...")
      await db.$executeRaw`
        ALTER TABLE "GalleryImage" 
        ADD COLUMN IF NOT EXISTS "year" INTEGER;
      `
      results.push("Added 'year' column to GalleryImage table")
      console.log("✅ Year column added")
    } else {
      results.push("'year' column already exists")
      console.log("✅ Year column already exists")
    }

    // Add category column if it doesn't exist
    if (!Array.isArray(checkCategoryColumn) || checkCategoryColumn.length === 0) {
      console.log("➕ Adding category column...")
      await db.$executeRaw`
        ALTER TABLE "GalleryImage" 
        ADD COLUMN IF NOT EXISTS "category" TEXT;
      `
      results.push("Added 'category' column to GalleryImage table")
      console.log("✅ Category column added")
    } else {
      results.push("'category' column already exists")
      console.log("✅ Category column already exists")
    }

    // Create Settings table if it doesn't exist
    if (!Array.isArray(checkSettingsTable) || checkSettingsTable.length === 0) {
      console.log("➕ Creating Settings table...")
      await db.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Settings" (
          "id" TEXT NOT NULL,
          "key" TEXT NOT NULL,
          "value" TEXT,
          "description" TEXT,
          "category" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
        );
      `
      
      // Create indexes
      await db.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "Settings_key_key" ON "Settings"("key");
      `
      await db.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Settings_key_idx" ON "Settings"("key");
      `
      await db.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Settings_category_idx" ON "Settings"("category");
      `
      
      results.push("Created 'Settings' table with indexes")
      console.log("✅ Settings table created")
    } else {
      results.push("'Settings' table already exists")
      console.log("✅ Settings table already exists")
    }

    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error("❌ Migration failed:", error)
    return NextResponse.json({
      success: false,
      error: "Migration failed",
      message: error?.message || String(error),
      details: error?.stack || String(error)
    }, { status: 500 })
  }
}

