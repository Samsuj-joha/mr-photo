// src/app/api/admin/settings/image-analysis/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomUUID } from "crypto"

// Helper function to ensure Settings table exists
async function ensureSettingsTable() {
  try {
    // Check if Settings table exists
    const checkSettingsTable = await db.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Settings';
    `
    
    // If table doesn't exist, create it
    if (!Array.isArray(checkSettingsTable) || checkSettingsTable.length === 0) {
      console.log("➕ Creating Settings table...")
      
      // Create table
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
      
      console.log("✅ Settings table created")
    }
  } catch (error) {
    console.error("Error ensuring Settings table exists:", error)
    // Don't throw - let the calling function handle the error
  }
}

// Helper function to get setting value
async function getSetting(key: string): Promise<string | null> {
  try {
    // Try Prisma Client first
    if (db.settings) {
      try {
        const setting = await db.settings.findUnique({
          where: { key }
        })
        return setting?.value || null
      } catch (prismaError: any) {
        // If Prisma error is P2021 (table doesn't exist), fall back to raw SQL
        if (prismaError?.code === 'P2021') {
          console.warn(`Prisma Client table not found, using raw SQL fallback for setting: ${key}`)
          // Fall through to raw SQL
        } else {
          throw prismaError
        }
      }
    }
    
    // Ensure Settings table exists before using raw SQL
    await ensureSettingsTable()
    
    // Fallback to raw query if Prisma Client not available or table not found
    // Use $queryRawUnsafe to avoid template literal parsing issues
    const result = await db.$queryRawUnsafe<Array<{ value: string | null }>>(
      'SELECT value FROM "Settings" WHERE key = $1 LIMIT 1',
      key
    )
    return result[0]?.value || null
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error)
    return null
  }
}

// Helper function to set setting value
async function setSetting(key: string, value: string, description?: string, category?: string) {
  try {
    // Try Prisma Client first
    if (db.settings) {
      try {
        await db.settings.upsert({
          where: { key },
          update: { value, updatedAt: new Date() },
          create: { key, value, description, category }
        })
        return
      } catch (prismaError: any) {
        // If Prisma error is P2021 (table doesn't exist), fall back to raw SQL
        if (prismaError?.code === 'P2021') {
          console.warn(`Prisma Client table not found, using raw SQL fallback for setting: ${key}`)
          // Fall through to raw SQL
        } else {
          throw prismaError
        }
      }
    }
    
    // Ensure Settings table exists before using raw SQL
    await ensureSettingsTable()
    
    // Fallback to raw query if Prisma Client not available or table not found
    // Check if setting exists
    const existing = await db.$queryRawUnsafe<Array<{ id: string }>>(
      'SELECT id FROM "Settings" WHERE key = $1 LIMIT 1',
      key
    )
    
    if (existing && existing.length > 0) {
      // Update existing
      await db.$executeRawUnsafe(
        'UPDATE "Settings" SET value = $1, "updatedAt" = NOW() WHERE key = $2',
        value,
        key
      )
    } else {
      // Create new
      const id = randomUUID()
      await db.$executeRawUnsafe(
        'INSERT INTO "Settings" (id, key, value, description, category, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        id,
        key,
        value,
        description || null,
        category || null
      )
    }
  } catch (error) {
    console.error(`Error setting ${key}:`, error)
    throw error
  }
}

// GET - Fetch image analysis settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get settings from database, fallback to environment variables
    const activeProvider = await getSetting("image_analysis_provider") || 
                          process.env.IMAGE_ANALYSIS_PROVIDER || 
                          "clarifai"
    
    const clarifaiApiKey = await getSetting("clarifai_api_key") || 
                          process.env.CLARIFAI_API_KEY || 
                          ""
    
    const googleApiKey = await getSetting("google_vision_api_key") || 
                        process.env.GOOGLE_VISION_API_KEY || 
                        ""
    
    const azureEndpoint = await getSetting("azure_computer_vision_endpoint") || 
                          process.env.AZURE_COMPUTER_VISION_ENDPOINT || 
                          ""
    
    const azureKey = await getSetting("azure_computer_vision_key") || 
                    process.env.AZURE_COMPUTER_VISION_KEY || 
                    ""

    return NextResponse.json({
      activeProvider,
      googleApiKey: googleApiKey || "",
      clarifaiApiKey: clarifaiApiKey || "",
      azureEndpoint: azureEndpoint || "",
      azureKey: azureKey || "",
    })
  } catch (error) {
    console.error("Error fetching image analysis settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// POST - Save image analysis settings
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
    const { activeProvider, googleApiKey, clarifaiApiKey, azureEndpoint, azureKey } = body

    // Save all settings to database
    try {
      // Save active provider
      if (activeProvider) {
        await setSetting(
          "image_analysis_provider",
          activeProvider,
          "Active image analysis provider (google, clarifai, azure)",
          "api"
        )
      }

      // Save Clarifai API key
      if (clarifaiApiKey) {
        await setSetting(
          "clarifai_api_key",
          clarifaiApiKey,
          "Clarifai Community API key for image categorization",
          "api"
        )
      }

      // Save Google Vision API key
      if (googleApiKey) {
        await setSetting(
          "google_vision_api_key",
          googleApiKey,
          "Google Vision API key for image categorization",
          "api"
        )
      }

      // Save Azure endpoint
      if (azureEndpoint) {
        await setSetting(
          "azure_computer_vision_endpoint",
          azureEndpoint,
          "Azure Computer Vision API endpoint",
          "api"
        )
      }

      // Save Azure API key
      if (azureKey) {
        await setSetting(
          "azure_computer_vision_key",
          azureKey,
          "Azure Computer Vision API key",
          "api"
        )
      }

      console.log("✅ Image analysis settings saved to database")
      
      return NextResponse.json({
        success: true,
        message: "Settings saved successfully! The API keys are now stored in the database.",
        settings: {
          activeProvider: activeProvider || "clarifai",
          googleApiKey: googleApiKey ? "saved" : "",
          clarifaiApiKey: clarifaiApiKey ? "saved" : "",
          azureEndpoint: azureEndpoint ? "saved" : "",
          azureKey: azureKey ? "saved" : "",
        }
      })
    } catch (dbError) {
      console.error("Database error saving settings:", dbError)
      return NextResponse.json(
        { 
          error: "Failed to save settings to database",
          details: dbError instanceof Error ? dbError.message : String(dbError)
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error saving image analysis settings:", error)
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    )
  }
}

