// src/app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

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

// GET - Fetch all settings grouped by category
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await ensureSettingsTable()

    // Try Prisma Client first
    try {
      if (db.settings) {
        const allSettings = await db.settings.findMany({
          orderBy: [
            { category: 'asc' },
            { key: 'asc' }
          ]
        })

        // Group settings by category
        const grouped: Record<string, Array<{ key: string; value: string | null; description: string | null }>> = {}
        
        allSettings.forEach(setting => {
          const category = setting.category || 'general'
          if (!grouped[category]) {
            grouped[category] = []
          }
          grouped[category].push({
            key: setting.key,
            value: setting.value,
            description: setting.description
          })
        })

        return NextResponse.json({
          success: true,
          categories: Object.keys(grouped).sort(),
          settings: grouped
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
    const allSettings = await db.$queryRawUnsafe<Array<{
      id: string
      key: string
      value: string | null
      description: string | null
      category: string | null
    }>>(
      'SELECT id, key, value, description, category FROM "Settings" ORDER BY COALESCE(category, \'general\') ASC, key ASC'
    )

    // Group settings by category
    const grouped: Record<string, Array<{ key: string; value: string | null; description: string | null }>> = {}
    
    allSettings.forEach(setting => {
      const category = setting.category || 'general'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push({
        key: setting.key,
        value: setting.value,
        description: setting.description
      })
    })

    return NextResponse.json({
      success: true,
      categories: Object.keys(grouped).sort(),
      settings: grouped
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

