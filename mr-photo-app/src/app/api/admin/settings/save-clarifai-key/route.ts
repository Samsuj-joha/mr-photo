// src/app/api/admin/settings/save-clarifai-key/route.ts
// Endpoint to save Clarifai API key

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomUUID } from "crypto"

// Helper function to ensure Settings table exists
async function ensureSettingsTable() {
  try {
    const checkSettingsTable = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Settings';
    `
    
    if (!Array.isArray(checkSettingsTable) || checkSettingsTable.length === 0) {
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
      
      await db.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "Settings_key_key" ON "Settings"("key");
      `
      await db.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Settings_key_idx" ON "Settings"("key");
      `
      await db.$executeRaw`
        CREATE INDEX IF NOT EXISTS "Settings_category_idx" ON "Settings"("category");
      `
    }
  } catch (error) {
    console.error("Error ensuring Settings table exists:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await ensureSettingsTable()

    const body = await request.json()
    const { apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      )
    }

    // Try Prisma Client first
    try {
      if (db.settings) {
        await db.settings.upsert({
          where: { key: "clarifai_api_key" },
          update: { 
            value: apiKey, 
            updatedAt: new Date(),
            description: "Clarifai Community API key for image categorization",
            category: "api"
          },
          create: { 
            key: "clarifai_api_key",
            value: apiKey,
            description: "Clarifai Community API key for image categorization",
            category: "api"
          }
        })
        
        return NextResponse.json({
          success: true,
          message: "Clarifai API key saved successfully"
        })
      }
    } catch (prismaError: any) {
      if (prismaError?.code === 'P2021') {
        console.warn('Prisma Client table not found, using raw SQL fallback')
      } else {
        throw prismaError
      }
    }

    // Fallback to raw SQL
    const existing = await db.$queryRawUnsafe<Array<{ id: string }>>(
      'SELECT id FROM "Settings" WHERE key = $1 LIMIT 1',
      'clarifai_api_key'
    )
    
    if (existing && existing.length > 0) {
      await db.$executeRawUnsafe(
        'UPDATE "Settings" SET value = $1, "updatedAt" = NOW() WHERE key = $2',
        apiKey,
        'clarifai_api_key'
      )
    } else {
      const id = randomUUID()
      await db.$executeRawUnsafe(
        'INSERT INTO "Settings" (id, key, value, description, category, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        id,
        'clarifai_api_key',
        apiKey,
        'Clarifai Community API key for image categorization',
        'api'
      )
    }

    return NextResponse.json({
      success: true,
      message: "Clarifai API key saved successfully"
    })
  } catch (error) {
    console.error("Error saving Clarifai API key:", error)
    return NextResponse.json(
      { error: "Failed to save API key", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

