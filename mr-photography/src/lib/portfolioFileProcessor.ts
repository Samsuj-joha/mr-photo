// src/lib/portfolioFileProcessor.ts
// Utility functions for portfolio file processing

export interface FileProcessingInfo {
  originalFile: File
  needsConversion: boolean
  needsOptimization: boolean
  estimatedFinalSize: number
  processingSteps: string[]
  supportedFormat: boolean
}

export interface ProcessingResult {
  success: boolean
  file?: File
  error?: string
  steps: string[]
  originalSize: number
  finalSize: number
  compressionRatio: number
}

export class PortfolioFileProcessor {
  
  static analyzeFile(file: File): FileProcessingInfo {
    const isTiff = file.type === 'image/tiff' || 
                  file.type === 'image/tif' || 
                  file.name.toLowerCase().endsWith('.tif') || 
                  file.name.toLowerCase().endsWith('.tiff')
    
    const isLarge = file.size > 10 * 1024 * 1024 // Over 10MB
    const isSupported = file.type.startsWith('image/')
    
    const processingSteps: string[] = []
    let estimatedFinalSize = file.size
    
    if (isTiff) {
      processingSteps.push("Convert TIFF to JPEG")
      estimatedFinalSize = file.size * 0.6 // TIFF to JPEG usually reduces by ~40%
    }
    
    if (isLarge || estimatedFinalSize > 10 * 1024 * 1024) {
      processingSteps.push("Optimize image size and quality")
      estimatedFinalSize = Math.min(estimatedFinalSize * 0.7, 8 * 1024 * 1024) // Target 8MB max
    }
    
    if (processingSteps.length === 0) {
      processingSteps.push("Upload as-is")
    }

    return {
      originalFile: file,
      needsConversion: isTiff,
      needsOptimization: isLarge,
      estimatedFinalSize,
      processingSteps,
      supportedFormat: isSupported
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  static getCompressionRatio(originalSize: number, finalSize: number): number {
    return ((originalSize - finalSize) / originalSize) * 100
  }

  static validatePortfolioImage(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' }
    }

    // Check file size (50MB limit for TIFF, 20MB for others)
    const maxSize = file.type.includes('tiff') ? 50 * 1024 * 1024 : 20 * 1024 * 1024
    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: `File too large. Maximum size: ${this.formatFileSize(maxSize)}` 
      }
    }

    // Check dimensions if possible (this would need to be done client-side)
    return { valid: true }
  }

  static getOptimalDimensions(width: number, height: number): { width: number; height: number } {
    const maxWidth = 1920 // Portfolio images don't need to be as large as gallery images
    const maxHeight = 1080
    
    if (width <= maxWidth && height <= maxHeight) {
      return { width, height }
    }

    const aspectRatio = width / height
    
    let newWidth = maxWidth
    let newHeight = Math.round(maxWidth / aspectRatio)

    if (newHeight > maxHeight) {
      newHeight = maxHeight
      newWidth = Math.round(maxHeight * aspectRatio)
    }

    return { width: newWidth, height: newHeight }
  }
}

// React hook for file processing
export function usePortfolioFileProcessor() {
  const [processingInfo, setProcessingInfo] = useState<FileProcessingInfo | null>(null)
  
  const analyzeFile = (file: File) => {
    const info = PortfolioFileProcessor.analyzeFile(file)
    setProcessingInfo(info)
    return info
  }

  const clearAnalysis = () => {
    setProcessingInfo(null)
  }

  return {
    processingInfo,
    analyzeFile,
    clearAnalysis,
    formatFileSize: PortfolioFileProcessor.formatFileSize,
    validateFile: PortfolioFileProcessor.validatePortfolioImage
  }
}