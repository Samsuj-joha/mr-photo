// lib/advancedCompression.ts - Advanced compression for large photography files

export interface CompressionOptions {
  maxFileSize: number // Target max size in bytes (8MB = 8 * 1024 * 1024)
  maxWidth: number    // Max width in pixels (3840 for 4K)
  maxHeight: number   // Max height in pixels (2160 for 4K)
  quality: number     // Starting quality (0.85 = 85%)
  format: 'jpeg' | 'webp' | 'auto'
  preserveExif: boolean
  progressCallback?: (progress: number) => void
}

export interface CompressionResult {
  file: File
  originalSize: number
  newSize: number
  compressionRatio: number
  dimensions: { width: number; height: number }
  quality: number
  format: string
  compressionSteps: string[]
}

export async function advancedImageCompression(
  file: File, 
  options: Partial<CompressionOptions> = {}
): Promise<CompressionResult> {
  
  const config: CompressionOptions = {
    maxFileSize: 8 * 1024 * 1024, // 8MB default target
    maxWidth: 3840,  // 4K width
    maxHeight: 2160, // 4K height  
    quality: 0.85,   // Start with 85% quality
    format: 'auto',
    preserveExif: false,
    ...options
  }

  const compressionSteps: string[] = []
  const originalSize = file.size
  
  let currentFile = file
  let currentQuality = config.quality
  
  try {
    // Step 1: Load image and get dimensions
    const img = await loadImage(file)
    const originalDimensions = { width: img.width, height: img.height }
    
    compressionSteps.push(`📏 Original: ${originalDimensions.width}×${originalDimensions.height}`)
    config.progressCallback?.(10)

    // Step 2: Calculate optimal dimensions
    const targetDimensions = calculateOptimalDimensions(
      originalDimensions.width, 
      originalDimensions.height,
      config.maxWidth,
      config.maxHeight
    )
    
    if (targetDimensions.width !== originalDimensions.width || 
        targetDimensions.height !== originalDimensions.height) {
      compressionSteps.push(`📐 Resizing to: ${targetDimensions.width}×${targetDimensions.height}`)
    }
    config.progressCallback?.(25)

    // Step 3: Determine optimal format
    const targetFormat = determineOptimalFormat(file.type, config.format)
    compressionSteps.push(`🎨 Format: ${targetFormat}`)
    config.progressCallback?.(40)

    // Step 4: Initial compression
    currentFile = await compressImage(img, {
      width: targetDimensions.width,
      height: targetDimensions.height,
      quality: currentQuality,
      format: targetFormat,
      fileName: file.name
    })
    
    compressionSteps.push(`🔄 Initial compression: ${formatFileSize(currentFile.size)} (${currentQuality * 100}% quality)`)
    config.progressCallback?.(60)

    // Step 5: Iterative quality reduction if needed
    let attempts = 0
    const maxAttempts = 5
    const qualityStep = 0.05 // Reduce by 5% each iteration

    while (currentFile.size > config.maxFileSize && attempts < maxAttempts && currentQuality > 0.5) {
      currentQuality -= qualityStep
      
      currentFile = await compressImage(img, {
        width: targetDimensions.width,
        height: targetDimensions.height,
        quality: currentQuality,
        format: targetFormat,
        fileName: file.name
      })
      
      attempts++
      compressionSteps.push(`🎯 Attempt ${attempts}: ${formatFileSize(currentFile.size)} (${Math.round(currentQuality * 100)}% quality)`)
      config.progressCallback?.(60 + (attempts * 8))
    }

    // Step 6: Final size check and aggressive compression if needed
    if (currentFile.size > config.maxFileSize) {
      compressionSteps.push(`⚠️ Still large, applying aggressive compression...`)
      
      // More aggressive dimension reduction
      const aggressiveDimensions = {
        width: Math.floor(targetDimensions.width * 0.85),
        height: Math.floor(targetDimensions.height * 0.85)
      }
      
      currentFile = await compressImage(img, {
        width: aggressiveDimensions.width,
        height: aggressiveDimensions.height,
        quality: 0.75, // 75% quality
        format: 'jpeg', // Force JPEG for better compression
        fileName: file.name
      })
      
      compressionSteps.push(`💪 Aggressive: ${aggressiveDimensions.width}×${aggressiveDimensions.height} at 75% quality`)
    }

    config.progressCallback?.(100)

    const compressionRatio = (originalSize - currentFile.size) / originalSize

    return {
      file: currentFile,
      originalSize,
      newSize: currentFile.size,
      compressionRatio,
      dimensions: targetDimensions,
      quality: currentQuality,
      format: targetFormat,
      compressionSteps
    }

  } catch (error) {
    throw new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Helper functions
async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function calculateOptimalDimensions(
  width: number, 
  height: number, 
  maxWidth: number, 
  maxHeight: number
): { width: number; height: number } {
  
  // If image is already within limits, return as-is
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }

  // Calculate aspect ratio
  const aspectRatio = width / height

  // Determine limiting dimension
  let newWidth = maxWidth
  let newHeight = Math.round(maxWidth / aspectRatio)

  // If height is still too large, limit by height instead
  if (newHeight > maxHeight) {
    newHeight = maxHeight
    newWidth = Math.round(maxHeight * aspectRatio)
  }

  return { width: newWidth, height: newHeight }
}

function determineOptimalFormat(originalType: string, preferredFormat: string): string {
  if (preferredFormat !== 'auto') {
    return preferredFormat
  }

  // Smart format selection
  if (originalType.includes('png') && originalType.includes('alpha')) {
    return 'png' // Preserve transparency
  }
  
  if (originalType.includes('webp')) {
    return 'webp' // Keep WebP if supported
  }
  
  return 'jpeg' // Default to JPEG for best compression
}

async function compressImage(
  img: HTMLImageElement,
  options: {
    width: number
    height: number
    quality: number
    format: string
    fileName: string
  }
): Promise<File> {
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    canvas.width = options.width
    canvas.height = options.height

    // High-quality rendering
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    
    // Draw image with optimal scaling
    ctx.drawImage(img, 0, 0, options.width, options.height)

    // Convert to blob with specified quality
    const mimeType = `image/${options.format === 'jpg' ? 'jpeg' : options.format}`
    
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'))
          return
        }

        // Create new file with compressed data
        const compressedFile = new File(
          [blob], 
          options.fileName.replace(/\.[^/.]+$/, `.${options.format === 'jpeg' ? 'jpg' : options.format}`),
          { type: mimeType }
        )
        
        resolve(compressedFile)
      },
      mimeType,
      options.quality
    )
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Usage example for your upload component:
export async function compressForCloudinary(file: File): Promise<CompressionResult> {
  return advancedImageCompression(file, {
    maxFileSize: 8 * 1024 * 1024, // 8MB target (safely under 10MB)
    maxWidth: 3840,   // 4K resolution  
    maxHeight: 2160,  // 4K resolution
    quality: 0.85,    // Start with high quality
    format: 'auto',   // Smart format selection
    progressCallback: (progress) => {
      console.log(`Compression progress: ${progress}%`)
    }
  })
}