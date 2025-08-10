// src/lib/quickResize.ts
interface QuickResizeOptions {
  targetSizeMB?: number
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

interface ResizeResult {
  file: File
  originalSize: number
  newSize: number
  compressionRatio: number
  dimensions: { width: number; height: number }
}

export class QuickImageResizer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D

  constructor() {
    this.canvas = document.createElement('canvas')
    const ctx = this.canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')
    this.ctx = ctx
  }

  async resizeForCloudinary(file: File): Promise<ResizeResult> {
    console.log(`🎯 Starting compression: ${file.name} (${formatFileSize(file.size)})`)
    
    return this.quickResize(file, {
      targetSizeMB: 7, // Target 7MB to stay under 10MB
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.7,
      format: 'jpeg'
    })
  }

  async quickResize(file: File, options: QuickResizeOptions = {}): Promise<ResizeResult> {
    const { targetSizeMB = 7, maxWidth = 1920, maxHeight = 1080, quality = 0.7, format = 'jpeg' } = options
    const originalSize = file.size
    const img = await this.loadImage(file)
    
    // Aggressive initial sizing for large files
    let dimensions = this.calculateDimensions(img, maxWidth, maxHeight)
    let currentQuality = quality
    
    // Start with more aggressive compression
    let resizedFile = await this.performResize(img, dimensions, currentQuality, format, file.name)
    
    // Progressive compression if still too large
    let attempts = 0
    while (resizedFile.size > targetSizeMB * 1024 * 1024 && attempts < 5) {
      attempts++
      console.log(`🔄 Attempt ${attempts}: ${formatFileSize(resizedFile.size)} > ${targetSizeMB}MB`)
      
      if (attempts <= 2) {
        currentQuality = Math.max(0.4, currentQuality - 0.15)
      } else {
        dimensions = {
          width: Math.max(800, Math.floor(dimensions.width * 0.85)),
          height: Math.max(600, Math.floor(dimensions.height * 0.85))
        }
        currentQuality = 0.5
      }
      
      resizedFile = await this.performResize(img, dimensions, currentQuality, format, file.name)
    }

    URL.revokeObjectURL(img.src)
    const compressionRatio = (originalSize - resizedFile.size) / originalSize
    console.log(`✅ Final: ${formatFileSize(resizedFile.size)} (${(compressionRatio * 100).toFixed(1)}% saved)`)

    return { file: resizedFile, originalSize, newSize: resizedFile.size, compressionRatio, dimensions }
  }

  private async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
    })
  }

  private calculateDimensions(img: HTMLImageElement, maxWidth: number, maxHeight: number) {
    const aspectRatio = img.naturalWidth / img.naturalHeight
    let width = img.naturalWidth
    let height = img.naturalHeight

    if (width > maxWidth || height > maxHeight) {
      if (width / maxWidth > height / maxHeight) {
        width = maxWidth
        height = width / aspectRatio
      } else {
        height = maxHeight
        width = height * aspectRatio
      }
    }

    return { width: Math.floor(width), height: Math.floor(height) }
  }

  private async performResize(img: HTMLImageElement, dimensions: { width: number; height: number }, quality: number, format: string, originalName: string): Promise<File> {
    this.canvas.width = dimensions.width
    this.canvas.height = dimensions.height
    this.ctx.clearRect(0, 0, dimensions.width, dimensions.height)
    
    if (format === 'jpeg') {
      this.ctx.fillStyle = '#FFFFFF'
      this.ctx.fillRect(0, 0, dimensions.width, dimensions.height)
    }

    this.ctx.imageSmoothingEnabled = true
    this.ctx.imageSmoothingQuality = 'high'
    this.ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      this.canvas.toBlob(result => result ? resolve(result) : reject(new Error('Failed')), `image/${format}`, quality)
    })

    return new File([blob], originalName.replace(/\.[^/.]+$/, `.compressed.jpg`), { type: 'image/jpeg' })
  }

  async needsResizing(file: File): Promise<boolean> {
    return file.size > 7 * 1024 * 1024
  }
}

export const quickResizer = new QuickImageResizer()
export async function resizeForCloudinary(file: File): Promise<ResizeResult> {
  return quickResizer.resizeForCloudinary(file)
}
export async function needsCompression(file: File): Promise<boolean> {
  return quickResizer.needsResizing(file)
}
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}