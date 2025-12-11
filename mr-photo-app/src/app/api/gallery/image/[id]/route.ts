// src/app/api/gallery/image/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { deleteImage } from "@/lib/cloudinary"
import { analyzeImageBuffer, getAllCategories } from "@/lib/imageAnalysis"

// GET - Fetch single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params
    
    const image = await db.galleryImage.findUnique({
      where: { id: imageId },
      include: {
        gallery: {
          select: {
            id: true,
            title: true,
            category: true,
            country: true
          }
        }
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      )
    }

    // Try to get AI labels if available (optional - don't fail if analysis fails)
    let aiLabels: { label: string; confidence: number }[] = []
    try {
      // Get API keys for analysis
      const customCategories = await getAllCategories()
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
        // Use env vars as fallback
        clarifaiApiKey = process.env.CLARIFAI_API_KEY || null
        googleApiKey = process.env.GOOGLE_VISION_API_KEY || null
      }

      let apiKey: string | undefined
      let provider: string = activeProvider

      if (activeProvider === "clarifai" && clarifaiApiKey) {
        apiKey = clarifaiApiKey
      } else if (activeProvider === "google" && googleApiKey) {
        apiKey = googleApiKey
      } else if (activeProvider === "azure" && azureConfig) {
        apiKey = azureConfig
      } else if (clarifaiApiKey) {
        apiKey = clarifaiApiKey
        provider = "clarifai"
      } else if (googleApiKey) {
        apiKey = googleApiKey
        provider = "google"
      } else if (azureConfig) {
        apiKey = azureConfig
        provider = "azure"
      }

      // Only analyze if API key is available
      if (apiKey) {
        const imageResponse = await fetch(image.url)
        if (imageResponse.ok) {
          const arrayBuffer = await imageResponse.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
          
          const analysisResult = await analyzeImageBuffer(
            buffer,
            mimeType,
            provider,
            apiKey,
            customCategories
          )
          
          aiLabels = analysisResult.labels || []
        }
      }
    } catch (error) {
      // Silently fail - labels are optional
      console.log("Could not fetch AI labels:", error)
    }

    return NextResponse.json({
      id: image.id,
      url: image.url,
      publicId: image.publicId,
      alt: image.alt,
      caption: image.caption,
      category: image.category,
      year: image.year,
      order: image.order,
      loves: image.loves,
      galleryId: image.galleryId,
      createdAt: image.createdAt,
      gallery: image.gallery,
      aiLabels: aiLabels // Add AI labels with confidence scores
    })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }
}

// DELETE - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id: imageId } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find the image first
    const image = await db.galleryImage.findUnique({
      where: { id: imageId }
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
      console.log(`✅ Image deleted from Cloudinary: ${image.publicId}`)
    } catch (cloudinaryError) {
      console.error("⚠️ Error deleting from Cloudinary:", cloudinaryError)
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await db.galleryImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({ 
      message: "Image deleted successfully",
      deletedId: imageId
    })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    )
  }
}

