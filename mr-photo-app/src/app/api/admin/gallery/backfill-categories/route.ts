// src/app/api/admin/gallery/backfill-categories/route.ts
// API endpoint to backfill categories for existing images

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dryRun = searchParams.get('dryRun') === 'true'

    console.log(`🔧 Backfilling categories${dryRun ? ' (DRY RUN)' : ''}...`)

    // Find all images without a category (NULL or empty)
    const imagesWithoutCategory = await db.galleryImage.findMany({
      where: {
        OR: [
          { category: null },
          { category: '' }
        ]
      },
      select: {
        id: true,
        url: true,
        publicId: true,
        alt: true
      }
    })

    console.log(`📊 Found ${imagesWithoutCategory.length} images without categories`)

    if (dryRun) {
      return NextResponse.json({
        success: true,
        count: imagesWithoutCategory.length,
        message: `Found ${imagesWithoutCategory.length} images that need categories`
      })
    }

    if (imagesWithoutCategory.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: "All images already have categories"
      })
    }

    // Process each image to detect category
    const results = []
    let updated = 0

    for (const image of imagesWithoutCategory) {
      try {
        console.log(`🔍 Processing image: ${image.publicId}`)

        // Try to detect category from filename first (faster)
        let category = detectCategoryFromFilename(image.alt || image.publicId || '')
        
        // If still "Others", try AI detection
        if (category === "Others" && image.url) {
          try {
            const baseUrl = process.env.NEXTAUTH_URL || 
                           process.env.NEXT_PUBLIC_APP_URL || 
                           (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
            
            const aiResponse = await fetch(`${baseUrl}/api/ai/detect-category`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                imageUrl: image.url,
                fileName: image.publicId
              })
            })

            if (aiResponse.ok) {
              const aiData = await aiResponse.json()
              if (aiData.success && aiData.category) {
                category = aiData.category
                console.log(`🤖 AI detected: ${category}`)
              }
            }
          } catch (aiError) {
            console.warn(`⚠️ AI detection failed for ${image.publicId}, using filename-based detection`)
          }
        }

        // Update the image with the detected category
        await db.galleryImage.update({
          where: { id: image.id },
          data: { category }
        })

        updated++
        results.push({
          id: image.id,
          publicId: image.publicId,
          category,
          method: category === "Others" ? "default" : "detected"
        })

        console.log(`✅ Updated ${image.publicId} -> ${category}`)

      } catch (error) {
        console.error(`❌ Failed to process ${image.publicId}:`, error)
        results.push({
          id: image.id,
          publicId: image.publicId,
          error: error instanceof Error ? error.message : String(error)
        })
      }
    }

    return NextResponse.json({
      success: true,
      updated,
      total: imagesWithoutCategory.length,
      details: results,
      message: `Successfully updated ${updated} out of ${imagesWithoutCategory.length} images`
    })

  } catch (error: any) {
    console.error("❌ Backfill failed:", error)
    return NextResponse.json({
      success: false,
      error: "Backfill failed",
      message: error?.message || String(error)
    }, { status: 500 })
  }
}

// Helper function to detect category from filename
function detectCategoryFromFilename(fileName: string): string {
  if (!fileName) return "Others"

  const lowerFileName = fileName.toLowerCase()
  
  // Check for category keywords
  const keywordMap: Record<string, string> = {
    // Birds
    "bird": "Birds", "birds": "Birds", "avian": "Birds",
    "eagle": "Birds", "owl": "Birds", "parrot": "Birds",
    "sparrow": "Birds", "pigeon": "Birds", "crow": "Birds",
    "duck": "Birds", "swan": "Birds", "pelican": "Birds",
    "seagull": "Birds", "flamingo": "Birds", "heron": "Birds",
    
    // Animal
    "animal": "Animal", "animals": "Animal", "dog": "Animal",
    "cat": "Animal", "lion": "Animal", "tiger": "Animal",
    "elephant": "Animal", "deer": "Animal", "bear": "Animal",
    "wolf": "Animal", "fox": "Animal", "rabbit": "Animal",
    "horse": "Animal", "cow": "Animal", "sheep": "Animal",
    "monkey": "Animal", "butterfly": "Animal", "insect": "Animal",
    
    // Ocean
    "ocean": "Ocean", "sea": "Ocean", "beach": "Ocean",
    "wave": "Ocean", "waves": "Ocean", "marine": "Ocean",
    "water": "Ocean", "coast": "Ocean", "shore": "Ocean",
    "coral": "Ocean", "whale": "Ocean", "dolphin": "Ocean",
    
    // Nature
    "nature": "Nature", "forest": "Nature", "tree": "Nature",
    "mountain": "Nature", "valley": "Nature", "meadow": "Nature",
    "flower": "Nature", "landscape": "Nature", "sunset": "Nature",
    "sunrise": "Nature", "sky": "Nature", "cloud": "Nature",
    
    // Peace in Mind
    "peace": "Peace in Mind", "calm": "Peace in Mind",
    "serene": "Peace in Mind", "tranquil": "Peace in Mind",
    "meditation": "Peace in Mind", "zen": "Peace in Mind",
    "spiritual": "Peace in Mind", "quiet": "Peace in Mind"
  }

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerFileName.includes(keyword)) {
      return category
    }
  }

  return "Others"
}

