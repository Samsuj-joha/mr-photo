// src/lib/imageAnalysis.ts
// Image analysis utility with dynamic label-based category detection

export interface ImageAnalysisResult {
  labels: { label: string; confidence: number }[]
  description: string
  suggestedCategory: string
  suggestedCategories?: string[] // Multiple top categories
  suggestedCategoryMatches: { name: string; score: number }[]
  extractedText: string
  colors: string[]
  objects: string[]
  allAvailableLabels?: { label: string; confidence: number }[] // All labels for user to choose from
}

// Generic labels to filter out (too generic or not useful as categories)
const GENERIC_LABELS = new Set([
  'image', 'photo', 'photograph', 'picture', 'picture frame', 'graphics',
  'object', 'thing', 'item', 'stuff', 'entity', 'subject',
  'art', 'artwork', 'illustration', 'drawing', 'painting',
  'text', 'font', 'letter', 'word', 'writing',
  'color', 'colour', 'monochrome', 'black and white',
  'background', 'foreground', 'scene', 'view', 'sight',
  'close-up', 'closeup', 'macro', 'detail',
  'outdoor', 'indoor', 'inside', 'outside',
  'day', 'night', 'morning', 'evening',
  'horizontal', 'vertical', 'portrait', 'landscape' // orientation terms
])

// Normalize a label (handle plurals, capitalization, etc.)
function normalizeLabel(label: string): string {
  if (!label) return label
  
  let normalized = label.trim().toLowerCase()
  
  // Remove common suffixes and normalize plurals
  const pluralMap: Record<string, string> = {
    'birds': 'bird',
    'animals': 'animal',
    'people': 'person',
    'persons': 'person',
    'children': 'child',
    'flowers': 'flower',
    'trees': 'tree',
    'mountains': 'mountain',
    'buildings': 'building',
    'vehicles': 'vehicle',
    'cars': 'car',
    'boats': 'boat',
    'planes': 'plane',
    'insects': 'insect',
    'butterflies': 'butterfly',
    'dogs': 'dog',
    'cats': 'cat',
    'horses': 'horse',
    'fish': 'fish', // same singular/plural
    'deer': 'deer', // same singular/plural
  }
  
  if (pluralMap[normalized]) {
    normalized = pluralMap[normalized]
  } else if (normalized.endsWith('s') && normalized.length > 3) {
    // Try to singularize common plural endings
    const singular = normalized.slice(0, -1)
    // Only use singular if it makes sense (not words like 'glass', 'grass')
    if (!['glass', 'grass', 'class', 'mass', 'pass'].includes(singular)) {
      normalized = singular
    }
  }
  
  // Capitalize first letter for display
  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

// Filter out generic or low-quality labels
function filterLabels(labels: { label: string; confidence: number }[], minConfidence: number = 0.5): { label: string; confidence: number }[] {
  return labels
    .filter(({ label, confidence }) => {
      const lowerLabel = label.toLowerCase().trim()
      
      // Filter by confidence
      if (confidence < minConfidence) return false
      
      // Filter out generic labels
      if (GENERIC_LABELS.has(lowerLabel)) return false
      
      // Filter out very short labels (likely noise)
      if (lowerLabel.length < 3) return false
      
      // Filter out labels that are just numbers
      if (/^\d+$/.test(lowerLabel)) return false
      
      return true
    })
    .map(({ label, confidence }) => ({
      label: normalizeLabel(label),
      confidence
    }))
}

// Deduplicate similar labels (keep the one with highest confidence)
function deduplicateLabels(labels: { label: string; confidence: number }[]): { label: string; confidence: number }[] {
  const seen = new Map<string, { label: string; confidence: number }>()
  
  for (const item of labels) {
    const key = item.label.toLowerCase()
    const existing = seen.get(key)
    
    if (!existing || item.confidence > existing.confidence) {
      seen.set(key, item)
    }
  }
  
  return Array.from(seen.values())
}

// Extract top categories directly from AI labels (no predefined categories)
function extractTopCategoriesFromLabels(
  labels: { label: string; confidence: number }[],
  maxCategories: number = 5,
  minConfidence: number = 0.5
): { categories: string[], allLabels: { label: string; confidence: number }[] } {
  // Filter and normalize labels
  const filtered = filterLabels(labels, minConfidence)
  
  // Deduplicate
  const deduplicated = deduplicateLabels(filtered)
  
  // Sort by confidence (highest first)
  const sorted = deduplicated.sort((a, b) => b.confidence - a.confidence)
  
  // Take top categories
  const topCategories = sorted.slice(0, maxCategories).map(item => item.label)
  
  // Return all labels for user to choose from later
  const allLabels = sorted.map(item => ({
    label: item.label,
    confidence: item.confidence
  }))
  
  return {
    categories: topCategories.length > 0 ? topCategories : ['Other'],
    allLabels
  }
}

// Legacy category keywords (kept for backward compatibility if needed)
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Nature: ["landscape", "mountain", "forest", "tree", "sky", "water", "lake", "river", "field", "grass", "nature", "outdoor"],
  Urban: ["city", "building", "street", "road", "urban", "architecture", "downtown", "skyscraper", "concrete"],
  Wildlife: ["animal", "bird", "insect", "wildlife", "deer", "bear", "elephant", "tiger", "lion", "pet", "dog", "cat"],
  Portrait: ["person", "people", "face", "portrait", "human", "man", "woman", "child", "selfie", "headshot"],
  Travel: ["landscape", "destination", "monument", "temple", "beach", "vacation", "tourism", "landmark"],
  Food: ["food", "dish", "meal", "restaurant", "cuisine", "cake", "pizza", "coffee", "dessert", "beverage"],
  Architecture: ["building", "structure", "design", "monument", "bridge", "construction", "interior", "facade"],
  Abstract: ["abstract", "art", "pattern", "texture", "color", "geometric", "painting", "illustration"],
  Macro: ["macro", "close-up", "detail", "flower", "insect", "dew", "droplet", "bokeh"],
  Sports: ["sport", "athlete", "game", "competition", "running", "soccer", "basketball", "fitness", "action"],
  Events: ["event", "celebration", "gathering", "crowd", "festival", "concert", "party", "wedding"],
}

// Fetch categories from database directly
async function fetchDatabaseCategories(): Promise<{ id: number; name: string }[]> {
  try {
    const { db } = await import("@/lib/db")
    
    // Get all unique categories from galleries
    const galleryCategories = await db.gallery.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Get all unique categories from gallery images
    const imageCategories = await db.galleryImage.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Get all unique categories from portfolios
    const portfolioCategories = await db.portfolio.groupBy({
      by: ['category'],
      where: {
        category: {
          not: null,
          not: ""
        }
      }
    })

    // Combine all categories and split comma-separated ones
    const allCategories = new Set<string>()
    
    const addCategories = (categoryString: string | null) => {
      if (!categoryString) return
      // Split by comma and add each category separately
      const categories = categoryString.split(',').map(c => c.trim()).filter(c => c.length > 0)
      categories.forEach(cat => allCategories.add(cat))
    }
    
    galleryCategories.forEach(cat => {
      if (cat.category) addCategories(cat.category)
    })
    
    imageCategories.forEach(cat => {
      if (cat.category) addCategories(cat.category)
    })
    
    portfolioCategories.forEach(cat => {
      if (cat.category) addCategories(cat.category)
    })

    // Convert to array with id and name format
    return Array.from(allCategories)
      .sort()
      .map((name, index) => ({
        id: index + 1,
        name: name
      }))
  } catch (error) {
    console.error("Error fetching database categories:", error)
    return []
  }
}

function scoreCategories(labels: string[], customCategories?: { id: number; name: string }[]): { name: string; score: number }[] {
  const labelLower = labels.map((l) => l.toLowerCase())
  const categoryScores: Record<string, number> = {}

  // Score custom database categories FIRST with highest priority for exact matches
  if (customCategories && customCategories.length > 0) {
    for (const category of customCategories) {
      // Skip if category name contains comma (it's a multi-category string, not a single category)
      if (category.name.includes(',')) {
        continue
      }
      
      const categoryNameLower = category.name.toLowerCase().trim()
      let score = 0
      for (const label of labelLower) {
        const labelTrimmed = label.trim()
        if (labelTrimmed === categoryNameLower) {
          score += 100 // Exact match - highest priority
        } else if (labelTrimmed.includes(categoryNameLower) || categoryNameLower.includes(labelTrimmed)) {
          score += 10 // Partial match - high priority
        }
      }
      if (score > 0) {
        categoryScores[category.name] = score
      }
    }
  }

  // Then score hardcoded categories with lower priority
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    // Skip if already scored as custom category with exact match
    if (categoryScores[category] && categoryScores[category] >= 100) {
      continue
    }
    
    let score = 0
    for (const keyword of keywords) {
      for (const label of labelLower) {
        if (label.includes(keyword) || keyword.includes(label)) {
          score += 1
        }
      }
    }
    // Only add if score is meaningful (at least 2 keyword matches)
    if (score >= 2) {
      // Only add hardcoded category score if no custom category with same name and higher score
      if (!categoryScores[category] || categoryScores[category] < 50) {
        categoryScores[category] = (categoryScores[category] || 0) + score
      }
    }
  }

  return Object.entries(categoryScores)
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
}

function suggestCategory(labels: string[], customCategories?: { id: number; name: string }[]): string {
  const matches = scoreCategories(labels, customCategories)
  return matches.length > 0 ? matches[0].name : "Other"
}

// Suggest multiple categories (top 5 by default)
function suggestMultipleCategories(labels: string[], customCategories?: { id: number; name: string }[], maxCategories: number = 5): string[] {
  const matches = scoreCategories(labels, customCategories)
  
  // Filter out very weak matches (score < 2) but be more lenient for top categories
  // This allows us to get 4-5 categories while still filtering out noise
  const filteredMatches = matches.filter(m => m.score >= 2)
  
  if (filteredMatches.length > 0) {
    // Take top categories up to maxCategories
    // If we have fewer than maxCategories with score >= 5, include lower-scoring ones (but >= 2)
    const topMatches = filteredMatches.slice(0, maxCategories)
    return topMatches.map(m => m.name)
  } else if (matches.length > 0) {
    // Fallback: use top match even if score is very low
    return [matches[0].name]
  }
  
  return []
}

async function analyzeWithGoogle(buffer: Buffer, apiKey: string): Promise<ImageAnalysisResult> {
  try {
    const base64Image = buffer.toString("base64")
    const requestBody = {
      requests: [
        {
          image: { content: base64Image },
          features: [
            { type: "LABEL_DETECTION", maxResults: 10 },
            { type: "TEXT_DETECTION" },
            { type: "IMAGE_PROPERTIES" },
            { type: "OBJECT_LOCALIZATION", maxResults: 10 },
          ],
        },
      ],
    }

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()
    const annotation = result.responses?.[0]
    if (annotation?.error) throw new Error(annotation.error.message)

    const labels: { label: string; confidence: number }[] = (annotation.labelAnnotations || []).map((label: any) => ({
      label: label.description || "unknown",
      confidence: label.score || 0,
    }))

    const textAnnotations = annotation.textAnnotations || []
    const extractedText = textAnnotations.slice(1).map((text: any) => text.description || "").join(" ")

    const objects = (annotation.localizedObjectAnnotations || []).map((obj: any) => obj.name || "unknown")

    const colors: string[] = []
    const dominantColors = annotation.imagePropertiesAnnotation?.dominantColors?.colors || []
    dominantColors.slice(0, 3).forEach((color: any) => {
      const { red = 0, green = 0, blue = 0 } = color.color || {}
      if (red > green && red > blue) colors.push("red")
      else if (green > red && green > blue) colors.push("green")
      else if (blue > red && blue > green) colors.push("blue")
      else colors.push("neutral")
    })

    // Use dynamic label-based category extraction
    const categoryResult = extractTopCategoriesFromLabels(labels, 5, 0.5)
    
    return {
      labels,
      description: labels.slice(0, 3).map(l => l.label).join(", "),
      suggestedCategory: categoryResult.categories[0] || "Other",
      suggestedCategories: categoryResult.categories, // Top 4-5 categories
      suggestedCategoryMatches: categoryResult.allLabels.slice(0, 10).map(l => ({ 
        name: l.label, 
        score: Math.round(l.confidence * 100) 
      })),
      extractedText: extractedText.trim(),
      colors: [...new Set(colors)],
      objects: [...new Set(objects)],
      allAvailableLabels: categoryResult.allLabels, // All labels for user selection
    }
  } catch (error) {
    console.error("Google Vision API error:", error)
    throw error
  }
}

async function analyzeWithClarifai(buffer: Buffer, apiKey: string): Promise<ImageAnalysisResult> {
  try {
    const base64Image = buffer.toString("base64")
    const response = await fetch("https://api.clarifai.com/v2/users/clarifai/apps/main/models/aaa03c23b3724a16a56b629203edc62c/outputs", {
      method: "POST",
      headers: {
        "Authorization": `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [{ data: { image: { base64: base64Image } } }],
      }),
    })

    const result = await response.json()
    if (result.status?.code !== 10000) throw new Error(result.status?.description || "Clarifai API error")

    const concepts = result.outputs?.[0]?.data?.concepts || []
    const labels = concepts.map((c: any) => ({
      label: c.name || "unknown",
      confidence: c.value || 0,
    }))

    // Use dynamic label-based category extraction
    const categoryResult = extractTopCategoriesFromLabels(labels, 5, 0.5)
    
    return {
      labels,
      description: labels.slice(0, 3).map(l => l.label).join(", "),
      suggestedCategory: categoryResult.categories[0] || "Other",
      suggestedCategories: categoryResult.categories, // Top 4-5 categories
      suggestedCategoryMatches: categoryResult.allLabels.slice(0, 10).map(l => ({ 
        name: l.label, 
        score: Math.round(l.confidence * 100) 
      })),
      extractedText: "",
      colors: [],
      objects: labels.slice(0, 5).map(l => l.label),
      allAvailableLabels: categoryResult.allLabels, // All labels for user selection
    }
  } catch (error) {
    console.error("Clarifai API error:", error)
    throw error
  }
}

async function analyzeWithAzure(buffer: Buffer, apiKeyConfig: string): Promise<ImageAnalysisResult> {
  try {
    const [endpoint, key] = apiKeyConfig.split("|")
    if (!endpoint || !key) throw new Error("Invalid Azure format. Use: endpoint|key")

    // Clean endpoint URL (remove trailing slash and any existing path)
    const cleanEndpoint = endpoint.replace(/\/$/, "").replace(/\/vision\/.*$/, "")
    
    console.log(`🔍 Azure Vision: Using endpoint: ${cleanEndpoint}`)
    console.log(`🔍 Azure Vision: Image buffer size: ${buffer.length} bytes`)
    
    // Try v3.2 first (most compatible), fallback to v4.0 if needed
    let apiUrl = `${cleanEndpoint}/vision/v3.2/analyze?visualFeatures=Objects,Tags,Description,Categories`
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Azure Vision API error (${response.status}):`, errorText)
      
      let errorMessage = `Azure Vision API error: ${response.status} ${response.statusText}`
      
      // Provide helpful error messages
      if (response.status === 401) {
        errorMessage = "Azure API authentication failed. Please check your API key and endpoint."
      } else if (response.status === 429) {
        errorMessage = "Azure API rate limit exceeded. Please wait a moment and try again."
      } else if (response.status === 400) {
        errorMessage = `Azure API request error: ${errorText || "Invalid request format. Check endpoint URL."}`
      } else if (response.status === 404) {
        errorMessage = `Azure API endpoint not found. Check your endpoint URL: ${cleanEndpoint}`
      }
      
      throw new Error(errorMessage)
    }

    const result = await response.json()
    console.log(`✅ Azure Vision API response received`)
    console.log(`📊 Azure tags found: ${result.tags?.length || 0}`)
    console.log(`📊 Azure objects found: ${result.objects?.length || 0}`)
    
    // Extract tags (labels)
    const tags = result.tags?.map((t: any) => ({ 
      label: t.name, 
      confidence: t.confidence || 0.8 
    })) || []
    
    // Extract description
    const description = result.description?.captions?.[0]?.text || 
                       result.description?.tags?.join(", ") || 
                       "Image analyzed"
    
    // Extract objects
    const objects = result.objects?.map((o: any) => o.object) || []
    
    // Extract categories (if available)
    const categories = result.categories?.map((c: any) => c.name) || []
    
    // Combine tags, objects, and categories into label format
    const allLabels: { label: string; confidence: number }[] = [
      ...tags,
      ...objects.map(obj => ({ label: obj, confidence: 0.7 })),
      ...categories.map(cat => ({ label: cat, confidence: 0.6 }))
    ]
    
    // Use dynamic label-based category extraction
    const labelsToUse = allLabels.length > 0 ? allLabels : (tags.length > 0 ? tags : [{ label: description, confidence: 0.8 }])
    const categoryResult = extractTopCategoriesFromLabels(labelsToUse, 5, 0.5)
    
    console.log(`✅ Azure analysis complete. Categories: ${categoryResult.categories.join(", ")}`)
    
    return {
      labels: labelsToUse,
      description,
      suggestedCategory: categoryResult.categories[0] || "Other",
      suggestedCategories: categoryResult.categories, // Top 4-5 categories
      suggestedCategoryMatches: categoryResult.allLabels.slice(0, 10).map(l => ({ 
        name: l.label, 
        score: Math.round(l.confidence * 100) 
      })),
      extractedText: "",
      colors: [],
      objects: objects.length > 0 ? objects : labelsToUse.slice(0, 5).map(l => l.label),
      allAvailableLabels: categoryResult.allLabels, // All labels for user selection
    }
  } catch (error: any) {
    console.error("❌ Azure Vision API error:", error)
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
      apiKeyConfig: apiKeyConfig ? `${apiKeyConfig.split("|")[0]}...` : "missing"
    })
    // Re-throw with more context
    throw new Error(`Azure Vision analysis failed: ${error.message || error}`)
  }
}

export async function analyzeImageBuffer(
  buffer: Buffer,
  mimeType: string,
  provider?: string,
  apiKey?: string,
  customCategories?: { id: number; name: string }[] // Kept for backward compatibility but not used in new approach
): Promise<ImageAnalysisResult> {
  try {
    // Note: We no longer use predefined categories - we extract directly from AI labels
    // customCategories parameter is kept for backward compatibility

    const providerToUse = provider || process.env.IMAGE_ANALYSIS_PROVIDER || "clarifai"
    let keyToUse = apiKey

    // If no API key provided, try to get from database settings
    if (!keyToUse) {
      try {
        const { db } = await import("@/lib/db")
        if (providerToUse === "clarifai") {
          const setting = await db.settings.findUnique({ where: { key: "clarifai_api_key" } })
          keyToUse = setting?.value || process.env.CLARIFAI_API_KEY
        } else if (providerToUse === "google") {
          const setting = await db.settings.findUnique({ where: { key: "google_vision_api_key" } })
          keyToUse = setting?.value || process.env.GOOGLE_VISION_API_KEY
        } else if (providerToUse === "azure") {
          const endpointSetting = await db.settings.findUnique({ where: { key: "azure_computer_vision_endpoint" } })
          const keySetting = await db.settings.findUnique({ where: { key: "azure_computer_vision_key" } })
          if (endpointSetting?.value && keySetting?.value) {
            keyToUse = `${endpointSetting.value}|${keySetting.value}`
          } else {
            keyToUse = process.env.AZURE_COMPUTER_VISION_ENDPOINT && process.env.AZURE_COMPUTER_VISION_KEY
              ? `${process.env.AZURE_COMPUTER_VISION_ENDPOINT}|${process.env.AZURE_COMPUTER_VISION_KEY}`
              : undefined
          }
        }
      } catch (error) {
        console.warn("Could not fetch API key from database, using environment variables")
      }
    }

    if (!keyToUse) {
      console.warn("No API key provided, using fallback analysis")
      return getFallbackAnalysis()
    }

    if (providerToUse === "google") {
      return await analyzeWithGoogle(buffer, keyToUse)
    } else if (providerToUse === "clarifai") {
      return await analyzeWithClarifai(buffer, keyToUse)
    } else if (providerToUse === "azure") {
      return await analyzeWithAzure(buffer, keyToUse)
    } else {
      console.warn(`Unknown provider: ${providerToUse}, using fallback`)
      return getFallbackAnalysis()
    }
  } catch (error) {
    console.error("Image analysis error:", error)
    return getFallbackAnalysis()
  }
}

function getFallbackAnalysis(): ImageAnalysisResult {
  return {
    labels: [{ label: "image", confidence: 0.7 }],
    description: "Image analyzed successfully",
    suggestedCategory: "Other",
    suggestedCategories: ["Other"],
    suggestedCategoryMatches: [],
    extractedText: "",
    colors: ["blue", "green", "neutral"],
    objects: ["scene"],
    allAvailableLabels: [{ label: "Other", confidence: 0.7 }],
  }
}

// Export function to get all available categories
export async function getAllCategories(): Promise<{ id: number; name: string }[]> {
  return await fetchDatabaseCategories()
}

