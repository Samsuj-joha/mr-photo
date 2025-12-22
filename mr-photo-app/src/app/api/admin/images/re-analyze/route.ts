// src/app/api/admin/images/re-analyze/route.ts
// Re-analyze images to update their categories using AI

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { analyzeImageBuffer } from "@/lib/imageAnalysis"

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
    const { imageId } = body

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      )
    }

    // Get image from database
    const image = await db.galleryImage.findUnique({
      where: { id: imageId },
      include: { gallery: true }
    })

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    // Note: We now use dynamic label-based categories, no need to fetch predefined categories

    // Get API keys from database settings
    let clarifaiApiKey: string | null = null
    let googleApiKey: string | null = null
    let azureConfig: string | null = null
    let activeProvider = "clarifai"

    try {
      const providerSetting = await db.settings.findUnique({
        where: { key: "image_analysis_provider" }
      })
      activeProvider = providerSetting?.value || process.env.IMAGE_ANALYSIS_PROVIDER || "clarifai"

      const clarifaiSetting = await db.settings.findUnique({
        where: { key: "clarifai_api_key" }
      })
      clarifaiApiKey = clarifaiSetting?.value || process.env.CLARIFAI_API_KEY || null

      const googleSetting = await db.settings.findUnique({
        where: { key: "google_vision_api_key" }
      })
      googleApiKey = googleSetting?.value || process.env.GOOGLE_VISION_API_KEY || null

      const azureEndpointSetting = await db.settings.findUnique({
        where: { key: "azure_computer_vision_endpoint" }
      })
      const azureKeySetting = await db.settings.findUnique({
        where: { key: "azure_computer_vision_key" }
      })
      if (azureEndpointSetting?.value && azureKeySetting?.value) {
        azureConfig = `${azureEndpointSetting.value}|${azureKeySetting.value}`
      }
    } catch (error) {
      console.warn("⚠️ Could not load settings from database, using environment variables")
      clarifaiApiKey = process.env.CLARIFAI_API_KEY || null
      googleApiKey = process.env.GOOGLE_VISION_API_KEY || null
      activeProvider = process.env.IMAGE_ANALYSIS_PROVIDER || "clarifai"
    }

    // Determine which API key to use
    let apiKey: string | undefined
    let provider: string = activeProvider

    if (activeProvider === "clarifai" && clarifaiApiKey) {
      apiKey = clarifaiApiKey
    } else if (activeProvider === "google" && googleApiKey) {
      apiKey = googleApiKey
    } else if (activeProvider === "azure" && azureConfig) {
      apiKey = azureConfig
    } else {
      // Fallback: try Clarifai if available
      if (clarifaiApiKey) {
        apiKey = clarifaiApiKey
        provider = "clarifai"
      } else if (googleApiKey) {
        apiKey = googleApiKey
        provider = "google"
      } else if (azureConfig) {
        apiKey = azureConfig
        provider = "azure"
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { 
          error: "No API key configured",
          message: "Please configure an API key in Settings → API tab"
        },
        { status: 400 }
      )
    }

    // Fetch image from URL
    console.log(`🔍 Re-analyzing image: ${image.url}`)
    const imageResponse = await fetch(image.url)
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    }

    const arrayBuffer = await imageResponse.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'

    // Analyze image (now uses dynamic label-based categories)
    const analysisResult = await analyzeImageBuffer(
      buffer,
      mimeType,
      provider,
      apiKey
    )

    console.log(`✅ Analysis complete. Suggested category: ${analysisResult.suggestedCategory}`)
    console.log(`📊 Top matches:`, analysisResult.suggestedCategoryMatches.slice(0, 5))
    console.log(`📊 Multiple categories (top 4-5):`, analysisResult.suggestedCategories)
    console.log(`📊 Number of categories found:`, analysisResult.suggestedCategories?.length || 1)
    console.log(`📊 Total available labels:`, analysisResult.allAvailableLabels?.length || 0)

    // Save top 4-5 categories (highest confidence labels) as comma-separated
    const categoriesToSave = analysisResult.suggestedCategories && analysisResult.suggestedCategories.length > 0
      ? analysisResult.suggestedCategories.join(", ")
      : analysisResult.suggestedCategory
    
    console.log(`💾 Saving categories: "${categoriesToSave}"`)

    // Update image category in database (save multiple categories)
    await db.galleryImage.update({
      where: { id: imageId },
      data: { category: categoriesToSave }
    })

    return NextResponse.json({
      success: true,
      message: "Image re-analyzed successfully",
      imageId,
      oldCategory: image.category,
      newCategory: categoriesToSave,
      categories: analysisResult.suggestedCategories || [analysisResult.suggestedCategory],
      analysis: {
        suggestedCategory: analysisResult.suggestedCategory,
        suggestedCategories: analysisResult.suggestedCategories,
        confidence: analysisResult.labels[0]?.confidence || 0.8,
        description: analysisResult.description,
        topMatches: analysisResult.suggestedCategoryMatches.slice(0, 10),
        labels: analysisResult.labels.slice(0, 10),
        allAvailableLabels: analysisResult.allAvailableLabels || [],
        remainingLabels: analysisResult.allAvailableLabels 
          ? analysisResult.allAvailableLabels.slice((analysisResult.suggestedCategories?.length || 1))
          : [],
        provider
      }
    })

  } catch (error: any) {
    console.error("Re-analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to re-analyze image",
        details: error.message,
        message: error.message?.includes("API key") 
          ? "Please check your API key in Settings → API tab"
          : "An error occurred during analysis"
      },
      { status: 500 }
    )
  }
}

// POST - Re-analyze all images
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { limit = 10 } = body // Limit to prevent overload

    // Get all images
    const images = await db.galleryImage.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    if (images.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No images to analyze",
        analyzed: 0,
        results: []
      })
    }

    // Fetch categories and API keys (same as above)
    const customCategories = await getAllCategories()
    
    let clarifaiApiKey: string | null = null
    let provider = "clarifai"

    try {
      const clarifaiSetting = await db.settings.findUnique({
        where: { key: "clarifai_api_key" }
      })
      clarifaiApiKey = clarifaiSetting?.value || process.env.CLARIFAI_API_KEY || null

      const providerSetting = await db.settings.findUnique({
        where: { key: "image_analysis_provider" }
      })
      provider = providerSetting?.value || process.env.IMAGE_ANALYSIS_PROVIDER || "clarifai"
    } catch (error) {
      clarifaiApiKey = process.env.CLARIFAI_API_KEY || null
    }

    if (!clarifaiApiKey) {
      return NextResponse.json(
        { 
          error: "No API key configured",
          message: "Please configure Clarifai API key in Settings → API tab"
        },
        { status: 400 }
      )
    }

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const image of images) {
      try {
        const imageResponse = await fetch(image.url)
        if (!imageResponse.ok) continue

        const arrayBuffer = await imageResponse.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'

        const analysisResult = await analyzeImageBuffer(
          buffer,
          mimeType,
          provider,
          clarifaiApiKey!,
          customCategories
        )

        // Save multiple categories as comma-separated (up to 5 categories)
        const categoriesToSave = analysisResult.suggestedCategories?.slice(0, 5).join(", ") || analysisResult.suggestedCategory

        await db.galleryImage.update({
          where: { id: image.id },
          data: { category: categoriesToSave }
        })

        results.push({
          imageId: image.id,
          oldCategory: image.category,
          newCategory: categoriesToSave,
          categories: analysisResult.suggestedCategories || [analysisResult.suggestedCategory],
          success: true
        })
        successCount++

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
        results.push({
          imageId: image.id,
          error: error.message,
          success: false
        })
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Re-analyzed ${successCount} images successfully, ${errorCount} failed`,
      analyzed: successCount,
      errors: errorCount,
      results
    })

  } catch (error: any) {
    console.error("Batch re-analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to re-analyze images",
        details: error.message
      },
      { status: 500 }
    )
  }
}

