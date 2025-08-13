// First, install Sharp.js
// Run this command in your terminal:
// npm install sharp @types/sharp

// src/lib/imageConverter.ts - Server-side image conversion utility
import sharp from 'sharp'

export interface ConversionResult {
  buffer: Buffer
  originalFormat: string
  convertedFormat: string
  originalSize: number
  convertedSize: number
  width: number
  height: number
  wasConverted: boolean
}

export async function convertImageToJPEG(file: File): Promise<ConversionResult> {
  console.log(`🔄 Processing ${file.name} (${file.type})`)
  
  try {
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)
    
    // Get image metadata
    const metadata = await sharp(inputBuffer).metadata()
    console.log(`📊 Image info: ${metadata.width}×${metadata.height}, format: ${metadata.format}`)
    
    const originalFormat = metadata.format || 'unknown'
    const originalSize = inputBuffer.length
    
    // Check if conversion is needed
    const needsConversion = originalFormat.toLowerCase() === 'tiff' || originalFormat.toLowerCase() === 'tif'
    
    if (needsConversion) {
      console.log(`🔄 Converting ${originalFormat.toUpperCase()} to JPEG...`)
      
      // Convert TIFF to high-quality JPEG
      const convertedBuffer = await sharp(inputBuffer)
        .jpeg({ 
          quality: 95, // High quality to preserve detail
          progressive: true, // Progressive JPEG for better web loading
          mozjpeg: true // Use mozjpeg encoder for better compression
        })
        .toBuffer()
      
      console.log(`✅ Conversion complete: ${originalFormat.toUpperCase()} → JPEG`)
      console.log(`📦 Size change: ${formatBytes(originalSize)} → ${formatBytes(convertedBuffer.length)}`)
      
      return {
        buffer: convertedBuffer,
        originalFormat: originalFormat.toUpperCase(),
        convertedFormat: 'JPEG',
        originalSize,
        convertedSize: convertedBuffer.length,
        width: metadata.width || 0,
        height: metadata.height || 0,
        wasConverted: true
      }
    } else {
      console.log(`✅ ${originalFormat.toUpperCase()} format supported, no conversion needed`)
      
      return {
        buffer: inputBuffer,
        originalFormat: originalFormat.toUpperCase(),
        convertedFormat: originalFormat.toUpperCase(),
        originalSize,
        convertedSize: originalSize,
        width: metadata.width || 0,
        height: metadata.height || 0,
        wasConverted: false
      }
    }
    
  } catch (error) {
    console.error('❌ Image conversion failed:', error)
    throw new Error(`Image conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function optimizeImage(file: File, options: {
  maxWidth?: number
  maxHeight?: number
  quality?: number
} = {}): Promise<ConversionResult> {
  const { maxWidth = 3840, maxHeight = 2160, quality = 85 } = options
  
  console.log(`🎯 Optimizing ${file.name} with max dimensions ${maxWidth}×${maxHeight}`)
  
  try {
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)
    
    const metadata = await sharp(inputBuffer).metadata()
    const originalSize = inputBuffer.length
    
    // Calculate resize dimensions if needed
    let resizeOptions = {}
    if (metadata.width && metadata.height) {
      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        resizeOptions = {
          width: maxWidth,
          height: maxHeight,
          fit: 'inside' as const,
          withoutEnlargement: true
        }
        console.log(`📐 Resizing from ${metadata.width}×${metadata.height}`)
      }
    }
    
    // Process image
    let sharpInstance = sharp(inputBuffer)
    
    // Apply resize if needed
    if (Object.keys(resizeOptions).length > 0) {
      sharpInstance = sharpInstance.resize(resizeOptions)
    }
    
    // Convert to JPEG with optimization
    const optimizedBuffer = await sharpInstance
      .jpeg({ 
        quality,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer()
    
    // Get final dimensions
    const finalMetadata = await sharp(optimizedBuffer).metadata()
    
    console.log(`✅ Optimization complete`)
    console.log(`📦 Size: ${formatBytes(originalSize)} → ${formatBytes(optimizedBuffer.length)}`)
    console.log(`📏 Dimensions: ${metadata.width}×${metadata.height} → ${finalMetadata.width}×${finalMetadata.height}`)
    
    return {
      buffer: optimizedBuffer,
      originalFormat: metadata.format?.toUpperCase() || 'UNKNOWN',
      convertedFormat: 'JPEG',
      originalSize,
      convertedSize: optimizedBuffer.length,
      width: finalMetadata.width || 0,
      height: finalMetadata.height || 0,
      wasConverted: true
    }
    
  } catch (error) {
    console.error('❌ Image optimization failed:', error)
    throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}