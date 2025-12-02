// src/lib/imageProcessor.ts - Shared image processing for all uploads
import { convertImageToJPEG, optimizeImage } from "./imageConverter"

export interface ProcessedImage {
  buffer: Buffer
  fileName: string
  processingInfo: {
    originalFormat: string
    finalFormat: string
    originalSize: number
    finalSize: number
    wasConverted: boolean
    wasOptimized: boolean
    dimensions: string
  }
}

/**
 * Process image to ensure it's 10MB or less
 * Handles TIFF conversion and large file optimization
 */
export async function processImageForUpload(file: File): Promise<ProcessedImage> {
  const isTiff = file.type === 'image/tiff' || file.type === 'image/tif' || 
                 file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')
  const isLarge = file.size > 10 * 1024 * 1024 // Over 10MB
  const maxSize = 10 * 1024 * 1024 // 10MB target
  
  let processedBuffer: Buffer
  let processedFileName: string
  let processingInfo: any = {}
  
  try {
    if (isTiff) {
      console.log(`🔄 TIFF file detected, converting to JPEG...`)
      const conversionResult = await convertImageToJPEG(file)
      
      // Check if converted file is still too large
      if (conversionResult.convertedSize > maxSize) {
        console.log(`⚠️ Converted file still large (${(conversionResult.convertedSize / 1024 / 1024).toFixed(2)}MB), optimizing...`)
        
        // Create a temporary file from the converted buffer
        const tempFile = new File([conversionResult.buffer], file.name.replace(/\.tiff?$/i, '.jpg'), { type: 'image/jpeg' })
        const optimizationResult = await optimizeImage(tempFile, {
          maxWidth: 3840,
          maxHeight: 2160,
          quality: 80
        })
        
        // If still too large, reduce quality further
        if (optimizationResult.convertedSize > maxSize) {
          console.log(`⚠️ Still too large, reducing quality...`)
          const furtherOptimized = await optimizeImage(tempFile, {
            maxWidth: 3840,
            maxHeight: 2160,
            quality: 70
          })
          
          processedBuffer = furtherOptimized.buffer
          processedFileName = file.name.replace(/\.tiff?$/i, '.jpg')
          processingInfo = {
            originalFormat: 'TIFF',
            finalFormat: 'JPEG',
            originalSize: file.size,
            convertedSize: conversionResult.convertedSize,
            finalSize: furtherOptimized.convertedSize,
            wasConverted: true,
            wasOptimized: true,
            dimensions: `${furtherOptimized.width}×${furtherOptimized.height}`
          }
        } else {
          processedBuffer = optimizationResult.buffer
          processedFileName = file.name.replace(/\.tiff?$/i, '.jpg')
          processingInfo = {
            originalFormat: 'TIFF',
            finalFormat: 'JPEG',
            originalSize: file.size,
            convertedSize: conversionResult.convertedSize,
            finalSize: optimizationResult.convertedSize,
            wasConverted: true,
            wasOptimized: true,
            dimensions: `${optimizationResult.width}×${optimizationResult.height}`
          }
        }
      } else {
        processedBuffer = conversionResult.buffer
        processedFileName = file.name.replace(/\.tiff?$/i, '.jpg')
        processingInfo = {
          originalFormat: 'TIFF',
          finalFormat: 'JPEG',
          originalSize: file.size,
          finalSize: conversionResult.convertedSize,
          wasConverted: true,
          wasOptimized: false,
          dimensions: `${conversionResult.width}×${conversionResult.height}`
        }
      }
      
      console.log(`✅ TIFF processing complete: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
      
    } else if (isLarge) {
      console.log(`📦 Large file detected (${(file.size / 1024 / 1024).toFixed(2)}MB), optimizing...`)
      const optimizationResult = await optimizeImage(file, {
        maxWidth: 3840,
        maxHeight: 2160,
        quality: 80
      })
      
      // If still too large, reduce quality further iteratively
      let finalOptimized = optimizationResult
      if (optimizationResult.convertedSize > maxSize) {
        console.log(`⚠️ Still too large (${(optimizationResult.convertedSize / 1024 / 1024).toFixed(2)}MB), reducing quality...`)
        
        // Try progressively lower quality levels
        const qualityLevels = [70, 60, 50, 40]
        for (const quality of qualityLevels) {
          const furtherOptimized = await optimizeImage(file, {
            maxWidth: 3840,
            maxHeight: 2160,
            quality
          })
          
          if (furtherOptimized.convertedSize <= maxSize) {
            finalOptimized = furtherOptimized
            console.log(`✅ Optimized to ${(finalOptimized.convertedSize / 1024 / 1024).toFixed(2)}MB with quality ${quality}`)
            break
          }
          finalOptimized = furtherOptimized
        }
        
        // If still too large, reduce dimensions
        if (finalOptimized.convertedSize > maxSize) {
          console.log(`⚠️ Still too large, reducing dimensions...`)
          const dimensionLevels = [
            { maxWidth: 2560, maxHeight: 1440 },
            { maxWidth: 1920, maxHeight: 1080 },
            { maxWidth: 1280, maxHeight: 720 }
          ]
          
          for (const dims of dimensionLevels) {
            const dimensionOptimized = await optimizeImage(file, {
              ...dims,
              quality: 70
            })
            
            if (dimensionOptimized.convertedSize <= maxSize) {
              finalOptimized = dimensionOptimized
              console.log(`✅ Optimized to ${(finalOptimized.convertedSize / 1024 / 1024).toFixed(2)}MB with dimensions ${dims.maxWidth}×${dims.maxHeight}`)
              break
            }
            finalOptimized = dimensionOptimized
          }
        }
        
        processedBuffer = finalOptimized.buffer
        processedFileName = file.name.replace(/\.[^/.]+$/, '.jpg')
        processingInfo = {
          originalFormat: file.type,
          finalFormat: 'JPEG',
          originalSize: file.size,
          finalSize: finalOptimized.convertedSize,
          wasConverted: false,
          wasOptimized: true,
          dimensions: `${finalOptimized.width}×${finalOptimized.height}`
        }
      } else {
        processedBuffer = optimizationResult.buffer
        processedFileName = file.name.replace(/\.[^/.]+$/, '.jpg')
        processingInfo = {
          originalFormat: file.type,
          finalFormat: 'JPEG',
          originalSize: file.size,
          finalSize: optimizationResult.convertedSize,
          wasConverted: false,
          wasOptimized: true,
          dimensions: `${optimizationResult.width}×${optimizationResult.height}`
        }
      }
      
      console.log(`✅ Optimization complete: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
      
    } else {
      // For gallery images, always optimize to ensure consistent sizing and file size
      // Similar to home slider which always resizes images
      console.log(`📦 Optimizing image for consistent sizing (${(file.size / 1024 / 1024).toFixed(2)}MB)...`)
      const optimizationResult = await optimizeImage(file, {
        maxWidth: 3840,
        maxHeight: 2160,
        quality: 85
      })
      
      // If optimized file is still too large, reduce quality
      let finalOptimized = optimizationResult
      if (optimizationResult.convertedSize > maxSize) {
        console.log(`⚠️ Optimized file still large (${(optimizationResult.convertedSize / 1024 / 1024).toFixed(2)}MB), reducing quality...`)
        
        const qualityLevels = [75, 70, 60, 50]
        for (const quality of qualityLevels) {
          const furtherOptimized = await optimizeImage(file, {
            maxWidth: 3840,
            maxHeight: 2160,
            quality
          })
          
          if (furtherOptimized.convertedSize <= maxSize) {
            finalOptimized = furtherOptimized
            console.log(`✅ Optimized to ${(finalOptimized.convertedSize / 1024 / 1024).toFixed(2)}MB with quality ${quality}`)
            break
          }
          finalOptimized = furtherOptimized
        }
      }
      
      processedBuffer = finalOptimized.buffer
      processedFileName = file.name.replace(/\.[^/.]+$/, '.jpg')
      processingInfo = {
        originalFormat: file.type,
        finalFormat: 'JPEG',
        originalSize: file.size,
        finalSize: finalOptimized.convertedSize,
        wasConverted: false,
        wasOptimized: true,
        dimensions: `${finalOptimized.width}×${finalOptimized.height}`
      }
      
      console.log(`✅ Optimization complete: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`)
    }
    
    return {
      buffer: processedBuffer,
      fileName: processedFileName,
      processingInfo
    }
    
  } catch (error) {
    console.error('❌ Image processing failed:', error)
    throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

