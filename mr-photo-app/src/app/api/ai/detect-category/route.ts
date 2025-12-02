// src/app/api/ai/detect-category/route.ts
// AI-powered category detection for images using Clarifai, Google, or Azure,
// with safe fallbacks to filename-based heuristics.

import { NextRequest, NextResponse } from "next/server"
import { analyzeImageBuffer, getAllCategories } from "@/lib/imageAnalysis"

// Fixed gallery categories as fallback
const GALLERY_CATEGORIES = [
  "Birds",
  "Animal",
  "Ocean",
  "Nature",
  "Peace in Mind",
  "Others"
] as const

type GalleryCategory = typeof GALLERY_CATEGORIES[number]

interface CategorySuggestion {
  category: string
  confidence: number
  reasoning: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, fileName } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      )
    }

    // Fetch categories from database
    let customCategories: { id: number; name: string }[] = []
    try {
      customCategories = await getAllCategories()
      console.log(`✅ Loaded ${customCategories.length} categories from database`)
    } catch (error) {
      console.warn("⚠️ Could not load categories from database, using fallback")
    }

    // Get API key and provider from database settings
    let clarifaiApiKey: string | null = null
    let googleApiKey: string | null = null
    let azureConfig: string | null = null
    let activeProvider = "clarifai"

    try {
      const { db } = await import("@/lib/db")
      
      // Get provider setting
      const providerSetting = await db.settings.findUnique({
        where: { key: "image_analysis_provider" }
      })
      activeProvider = providerSetting?.value || process.env.IMAGE_ANALYSIS_PROVIDER || "clarifai"

      // Get API keys
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
      } else if (process.env.AZURE_COMPUTER_VISION_ENDPOINT && process.env.AZURE_COMPUTER_VISION_KEY) {
        azureConfig = `${process.env.AZURE_COMPUTER_VISION_ENDPOINT}|${process.env.AZURE_COMPUTER_VISION_KEY}`
      }
    } catch (error) {
      console.log("⚠️ Could not load settings from database, using environment variables")
      clarifaiApiKey = process.env.CLARIFAI_API_KEY || null
      googleApiKey = process.env.GOOGLE_VISION_API_KEY || null
      activeProvider = process.env.IMAGE_ANALYSIS_PROVIDER || "clarifai"
    }

    // Try to fetch image and analyze with imageAnalysis utility
    try {
      console.log(`🔍 Using ${activeProvider} API for category detection...`)
      
      // Fetch image buffer
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
      }
      
      const arrayBuffer = await imageResponse.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'

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

      if (apiKey) {
        const analysisResult = await analyzeImageBuffer(
          buffer,
          mimeType,
          provider,
          apiKey,
          customCategories
        )

        // Get top 3 categories (excluding the main one if it's already in the list)
        const topCategories = analysisResult.suggestedCategories || [analysisResult.suggestedCategory]
        const alternatives = analysisResult.suggestedCategoryMatches
          .filter(m => m.name !== analysisResult.suggestedCategory && m.score > 0)
          .slice(0, 2)
          .map(m => m.name)

        return NextResponse.json({
          success: true,
          category: analysisResult.suggestedCategory,
          categories: topCategories, // Multiple categories
          confidence: analysisResult.labels[0]?.confidence || 0.8,
          reasoning: analysisResult.description,
          method: `${provider}_vision`,
          alternatives: alternatives,
          allMatches: analysisResult.suggestedCategoryMatches.slice(0, 5),
          labels: analysisResult.labels.slice(0, 5)
        })
      }
    } catch (analysisError: any) {
      console.error("Image analysis error:", analysisError)
      // Fall through to filename detection
    }

    // Fallback: Use simple heuristics based on filename
    console.log("⚠️ No AI API configured or analysis failed, using filename-based detection")
    const suggestedCategory = detectCategoryFromFilename(fileName || "")
    
    return NextResponse.json({
      success: true,
      category: suggestedCategory,
      confidence: 0.5,
      method: "filename_heuristic",
      message: "No AI API configured or analysis failed. Using filename-based detection."
    })

  } catch (error: any) {
    console.error("Category detection error:", error)
    return NextResponse.json(
      {
        error: "Failed to detect category",
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Helper function to detect category from filename
function detectCategoryFromFilename(fileName: string): GalleryCategory {
  if (!fileName) return "Others"

  const lowerFileName = fileName.toLowerCase()
  
  // Check for category keywords
  const keywordMap: Record<string, GalleryCategory> = {
    // Birds
    "bird": "Birds",
    "birds": "Birds",
    "avian": "Birds",
    "eagle": "Birds",
    "owl": "Birds",
    "parrot": "Birds",
    "sparrow": "Birds",
    "pigeon": "Birds",
    "crow": "Birds",
    "duck": "Birds",
    "swan": "Birds",
    "pelican": "Birds",
    "seagull": "Birds",
    "flamingo": "Birds",
    
    // Animal (but not birds)
    "animal": "Animal",
    "animals": "Animal",
    "dog": "Animal",
    "cat": "Animal",
    "lion": "Animal",
    "tiger": "Animal",
    "elephant": "Animal",
    "deer": "Animal",
    "bear": "Animal",
    "wolf": "Animal",
    "fox": "Animal",
    "rabbit": "Animal",
    "horse": "Animal",
    "cow": "Animal",
    "sheep": "Animal",
    "goat": "Animal",
    "monkey": "Animal",
    "zebra": "Animal",
    "giraffe": "Animal",
    "insect": "Animal",
    "butterfly": "Animal",
    "reptile": "Animal",
    "snake": "Animal",
    "lizard": "Animal",
    
    // Ocean
    "ocean": "Ocean",
    "sea": "Ocean",
    "beach": "Ocean",
    "wave": "Ocean",
    "waves": "Ocean",
    "marine": "Ocean",
    "water": "Ocean",
    "coast": "Ocean",
    "shore": "Ocean",
    "surf": "Ocean",
    "coral": "Ocean",
    "fish": "Ocean",
    "whale": "Ocean",
    "dolphin": "Ocean",
    "seal": "Ocean",
    
    // Nature
    "nature": "Nature",
    "forest": "Nature",
    "tree": "Nature",
    "trees": "Nature",
    "mountain": "Nature",
    "mountains": "Nature",
    "valley": "Nature",
    "meadow": "Nature",
    "field": "Nature",
    "flower": "Nature",
    "flowers": "Nature",
    "plant": "Nature",
    "plants": "Nature",
    "landscape": "Nature",
    "sunset": "Nature",
    "sunrise": "Nature",
    "sky": "Nature",
    "cloud": "Nature",
    "clouds": "Nature",
    
    // Peace in Mind
    "peace": "Peace in Mind",
    "calm": "Peace in Mind",
    "serene": "Peace in Mind",
    "tranquil": "Peace in Mind",
    "meditation": "Peace in Mind",
    "zen": "Peace in Mind",
    "spiritual": "Peace in Mind",
    "contemplative": "Peace in Mind",
    "quiet": "Peace in Mind",
    "stillness": "Peace in Mind"
  }

  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerFileName.includes(keyword)) {
      return category
    }
  }

  return "Others"
}

// Clarifai API integration
async function detectCategoryWithClarifai(
  imageUrl: string,
  apiKey: string
): Promise<CategorySuggestion> {
  try {
    // Clarifai "General" image recognition model
    const apiUrl = "https://api.clarifai.com/v2/models/general-image-recognition/outputs"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: { url: imageUrl }
            }
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Clarifai API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const concepts = data.outputs?.[0]?.data?.concepts || []

    if (!concepts.length) {
      throw new Error("Clarifai returned no concepts")
    }

    // Build a text blob from top concepts to reuse our existing mapping
    const topConcepts = concepts.slice(0, 10)
    const conceptNames = topConcepts.map((c: any) => (c.name || "").toLowerCase())
    const pseudoDescription = conceptNames.join(" ")

    const mappedCategory = mapAzureTagsToCategory(
      // Reuse mapping by simulating Azure-style tag objects
      topConcepts.map((c: any) => ({
        name: (c.name || "").toLowerCase(),
        confidence: c.value ?? c.score ?? 0.8
      })),
      pseudoDescription
    )

    const topConfidence = topConcepts[0]?.value ?? topConcepts[0]?.score ?? 0.8

    return {
      category: mappedCategory,
      confidence: Math.min(0.95, topConfidence),
      reasoning: `Clarifai detected: ${conceptNames.join(", ")}`
    }
  } catch (error: any) {
    console.error("Clarifai API error:", error)
    throw error
  }
}

// Map Azure Computer Vision tags to our categories
function mapAzureTagsToCategory(tags: any[], description: string): GalleryCategory {
  const lowerDescription = description.toLowerCase()
  const tagNames = tags.map(t => t.name.toLowerCase())
  const allText = [...tagNames, lowerDescription].join(' ')
  
  // Birds detection
  const birdKeywords = ['bird', 'birds', 'avian', 'eagle', 'owl', 'parrot', 'sparrow', 
    'pigeon', 'crow', 'duck', 'swan', 'pelican', 'seagull', 'flamingo', 'heron', 
    'hawk', 'falcon', 'robin', 'finch', 'warbler', 'woodpecker']
  if (birdKeywords.some(keyword => allText.includes(keyword))) {
    return "Birds"
  }
  
  // Ocean detection
  const oceanKeywords = ['ocean', 'sea', 'beach', 'wave', 'waves', 'marine', 'water', 
    'coast', 'shore', 'surf', 'coral', 'fish', 'whale', 'dolphin', 'seal', 
    'underwater', 'aquatic', 'tide', 'shoreline']
  if (oceanKeywords.some(keyword => allText.includes(keyword))) {
    return "Ocean"
  }
  
  // Animal detection (but not birds)
  const animalKeywords = ['animal', 'animals', 'dog', 'cat', 'lion', 'tiger', 'elephant', 
    'deer', 'bear', 'wolf', 'fox', 'rabbit', 'horse', 'cow', 'sheep', 'monkey', 
    'zebra', 'giraffe', 'insect', 'butterfly', 'reptile', 'snake', 'lizard', 
    'wildlife', 'mammal', 'pet', 'puppy', 'kitten']
  if (animalKeywords.some(keyword => allText.includes(keyword))) {
    return "Animal"
  }
  
  // Nature detection
  const natureKeywords = ['nature', 'forest', 'tree', 'trees', 'mountain', 'mountains', 
    'valley', 'meadow', 'field', 'flower', 'flowers', 'plant', 'plants', 'landscape', 
    'sunset', 'sunrise', 'sky', 'cloud', 'clouds', 'wilderness', 'scenery', 'outdoor']
  if (natureKeywords.some(keyword => allText.includes(keyword))) {
    return "Nature"
  }
  
  // Peace in Mind detection
  const peaceKeywords = ['peace', 'peaceful', 'calm', 'serene', 'tranquil', 'meditation', 
    'zen', 'spiritual', 'quiet', 'stillness', 'contemplative', 'relaxing', 'soothing']
  if (peaceKeywords.some(keyword => allText.includes(keyword))) {
    return "Peace in Mind"
  }
  
  return "Others"
}

// Check if a tag is relevant for categorization
function isRelevantTag(tagName: string): boolean {
  const relevantTags = [
    'bird', 'animal', 'ocean', 'sea', 'nature', 'forest', 'mountain', 
    'peace', 'calm', 'wildlife', 'landscape', 'water', 'beach'
  ]
  return relevantTags.some(rt => tagName.includes(rt))
}

// Normalize category to match database format
function normalizeCategory(category: string): GalleryCategory {
  const normalized = category.trim()
  
  // Direct match (case-insensitive)
  for (const cat of GALLERY_CATEGORIES) {
    if (cat.toLowerCase() === normalized.toLowerCase()) {
      return cat
    }
  }

  // Fuzzy matching
  const fuzzyMap: Record<string, GalleryCategory> = {
    "birds": "Birds",
    "bird": "Birds",
    "avian": "Birds",
    "animals": "Animal",
    "animal": "Animal",
    "wildlife": "Animal",
    "mammal": "Animal",
    "ocean": "Ocean",
    "sea": "Ocean",
    "marine": "Ocean",
    "beach": "Ocean",
    "water": "Ocean",
    "nature": "Nature",
    "natural": "Nature",
    "landscape": "Nature",
    "forest": "Nature",
    "peace": "Peace in Mind",
    "peaceful": "Peace in Mind",
    "calm": "Peace in Mind",
    "serene": "Peace in Mind",
    "tranquil": "Peace in Mind",
    "meditation": "Peace in Mind",
    "zen": "Peace in Mind",
    "spiritual": "Peace in Mind"
  }

  const lowerNormalized = normalized.toLowerCase()
  if (fuzzyMap[lowerNormalized]) {
    return fuzzyMap[lowerNormalized]
  }

  // Check if any category name is contained in the detected category
  for (const cat of GALLERY_CATEGORIES) {
    if (normalized.toLowerCase().includes(cat.toLowerCase()) || 
        cat.toLowerCase().includes(normalized.toLowerCase())) {
      return cat
    }
  }

  return "Others"
}

// Get similar/alternative categories
function getSimilarCategories(category: GalleryCategory): GalleryCategory[] {
  const similarMap: Record<GalleryCategory, GalleryCategory[]> = {
    "Birds": ["Animal", "Nature"],
    "Animal": ["Birds", "Nature"],
    "Ocean": ["Nature", "Peace in Mind"],
    "Nature": ["Animal", "Peace in Mind"],
    "Peace in Mind": ["Nature", "Ocean"],
    "Others": []
  }

  return similarMap[category] || []
}

