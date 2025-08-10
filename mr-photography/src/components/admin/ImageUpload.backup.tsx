"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  Check,
  AlertCircle,
  Compress,
  Info,
  Zap
} from "lucide-react"
import Image from "next/image"

// Import the compression utility
import { resizeForCloudinary, formatFileSize, needsCompression } from "@/lib/quickResize"

interface ImageUploadProps {
  galleryId: string
  onUploadComplete?: (images: any[]) => void
  maxFiles?: number
}

interface UploadFile {
  id: string
  file: File
  originalFile: File
  preview: string
  uploadProgress: number
  uploadStatus: "pending" | "compressing" | "uploading" | "success" | "error"
  uploadedData?: any
  alt: string
  caption: string
  compressionData?: {
    originalSize: number
    newSize: number
    compressionRatio: number
    dimensions: { width: number; height: number }
  }
  error?: string
}

export function ImageUpload({ 
  galleryId, 
  onUploadComplete, 
  maxFiles = 10 
}: ImageUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [autoCompress, setAutoCompress] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const processFileWithCompression = async (file: File, fileId: string) => {
    console.log(`🔄 Processing ${file.name}...`)
    
    try {
      // Update status to compressing
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, uploadStatus: "compressing" } : f
      ))

      if (autoCompress && await needsCompression(file)) {
        console.log(`🗜️ Compressing ${file.name}...`)
        
        // Compress the file
        const compressionResult = await resizeForCloudinary(file)
        
        console.log(`✅ Compression complete: ${formatFileSize(compressionResult.originalSize)} → ${formatFileSize(compressionResult.newSize)}`)
        
        // Update with compressed file
        setFiles(prev => prev.map(f => 
          f.id === fileId ? {
            ...f,
            file: compressionResult.file,
            preview: URL.createObjectURL(compressionResult.file),
            uploadStatus: "pending",
            compressionData: {
              originalSize: compressionResult.originalSize,
              newSize: compressionResult.newSize,
              compressionRatio: compressionResult.compressionRatio,
              dimensions: compressionResult.dimensions
            }
          } : f
        ))
      } else {
        // No compression needed
        console.log(`✅ File ${file.name} is already optimized`)
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, uploadStatus: "pending" } : f
        ))
      }
    } catch (error) {
      console.error(`❌ Compression failed for ${file.name}:`, error)
      
      // Fallback to original file
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          uploadStatus: "pending", 
          error: "Compression failed, using original file"
        } : f
      ))
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    // Add files immediately with compressing status
    const newFiles = selectedFiles.map(file => ({
      id: generateFileId(),
      file,
      originalFile: file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
      uploadStatus: "compressing" as const,
      alt: "",
      caption: "",
    }))

    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))

    // Process each file with compression
    for (const newFile of newFiles) {
      await processFileWithCompression(newFile.originalFile, newFile.id)
    }
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'))
    
    // Create fake event to reuse handleFileSelect
    const fakeEvent = {
      target: { files: imageFiles }
    } as React.ChangeEvent<HTMLInputElement>
    
    handleFileSelect(fakeEvent)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }

  const updateFileData = (fileId: string, field: 'alt' | 'caption', value: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, [field]: value } : f
    ))
  }

  const recompressFile = async (fileId: string) => {
    const fileData = files.find(f => f.id === fileId)
    if (!fileData) return

    await processFileWithCompression(fileData.originalFile, fileId)
  }

  const uploadFiles = async () => {
    setIsUploading(true)
    const pendingFiles = files.filter(f => f.uploadStatus === "pending")
    const uploadedImages = []

    for (const fileData of pendingFiles) {
      try {
        // Update status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, uploadStatus: "uploading", uploadProgress: 0 } : f
        ))

        console.log(`🚀 Uploading ${fileData.file.name} (${formatFileSize(fileData.file.size)})`)

        const formData = new FormData()
        formData.append("file", fileData.file) // This is now the compressed file!
        formData.append("galleryId", galleryId)
        formData.append("alt", fileData.alt)
        formData.append("caption", fileData.caption)

        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => 
            f.id === fileData.id && f.uploadProgress < 90 ? { 
              ...f, 
              uploadProgress: Math.min(f.uploadProgress + 15, 90) 
            } : f
          ))
        }, 300)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (response.ok) {
          const uploadedImage = await response.json()
          uploadedImages.push(uploadedImage)
          
          console.log(`✅ Upload successful: ${fileData.file.name}`)

          // Update status to success
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? { 
              ...f, 
              uploadStatus: "success", 
              uploadProgress: 100,
              uploadedData: uploadedImage
            } : f
          ))
        } else {
          const errorData = await response.json()
          console.error(`❌ Upload failed:`, errorData)
          
          // Update status to error
          setFiles(prev => prev.map(f => 
            f.id === fileData.id ? { 
              ...f, 
              uploadStatus: "error", 
              uploadProgress: 0,
              error: errorData.error || "Upload failed"
            } : f
          ))
        }
      } catch (error) {
        console.error("Upload error:", error)
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { 
            ...f, 
            uploadStatus: "error", 
            uploadProgress: 0,
            error: "Network error"
          } : f
        ))
      }
    }

    setIsUploading(false)
    
    if (uploadedImages.length > 0 && onUploadComplete) {
      onUploadComplete(uploadedImages)
    }
  }

  const clearFiles = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
    setFiles([])
  }

  const getTotalSavings = () => {
    return files.reduce((total, file) => {
      if (file.compressionData) {
        return total + (file.compressionData.originalSize - file.compressionData.newSize)
      }
      return total
    }, 0)
  }

  const pendingFiles = files.filter(f => f.uploadStatus === "pending")
  const compressingFiles = files.filter(f => f.uploadStatus === "compressing")
  const totalSavings = getTotalSavings()

  return (
    <div className="space-y-6">
      {/* Compression Settings */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Compress className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">Smart Compression</Label>
              <Badge variant="secondary">For Cloudinary 10MB Limit</Badge>
            </div>
            <Switch
              checked={autoCompress}
              onCheckedChange={setAutoCompress}
              disabled={isUploading || compressingFiles.length > 0}
            />
          </div>
          
          {autoCompress && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1 text-sm">
                  <p><strong>🎯 Target:</strong> Under 8MB per image</p>
                  <p><strong>📏 Max size:</strong> 1920×1080 pixels</p>
                  <p><strong>🔧 Quality:</strong> 80% (optimized for web)</p>
                  <p><strong>⚡ Format:</strong> JPEG (best for photos)</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {totalSavings > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <Check className="h-4 w-4" />
                <span className="font-medium">
                  💾 Total Space Saved: {formatFileSize(totalSavings)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Dropzone */}
      {files.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isUploading 
              ? "border-gray-300 bg-gray-50 cursor-not-allowed" 
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              📸 Drop your photography here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Large images will be automatically compressed for Cloudinary
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supports JPEG, PNG, WebP • {maxFiles - files.length} slots remaining
            </p>
          </div>
        </div>
      )}

      {/* Files Preview */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Upload Queue ({files.length})</h3>
            <div className="flex items-center gap-2">
              {compressingFiles.length > 0 && (
                <Badge variant="secondary" className="animate-pulse">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Compressing {compressingFiles.length}...
                </Badge>
              )}
              {pendingFiles.length > 0 && (
                <Badge variant="outline">
                  <Zap className="h-3 w-3 mr-1" />
                  {pendingFiles.length} Ready
                </Badge>
              )}
              <Button variant="outline" onClick={clearFiles} disabled={isUploading}>
                Clear All
              </Button>
              <Button 
                onClick={uploadFiles} 
                disabled={isUploading || pendingFiles.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {pendingFiles.length} Image{pendingFiles.length > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {files.map((fileData) => (
              <Card key={fileData.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    {/* Image Preview */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={fileData.preview}
                        alt="Preview"
                        fill
                        className="object-cover rounded"
                      />
                      <button
                        onClick={() => removeFile(fileData.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 text-xs"
                        disabled={isUploading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    {/* File Details */}
                    <div className="flex-1 space-y-3">
                      {/* File Info */}
                      <div>
                        <p className="font-medium text-sm truncate">{fileData.file.name}</p>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <span>Original: {formatFileSize(fileData.originalFile.size)}</span>
                            {fileData.compressionData && (
                              <>
                                <span>→</span>
                                <span className="text-green-600 font-medium">
                                  {formatFileSize(fileData.compressionData.newSize)}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {(fileData.compressionData.compressionRatio * 100).toFixed(1)}% saved
                                </Badge>
                              </>
                            )}
                          </div>
                          {fileData.compressionData && (
                            <p>📏 {fileData.compressionData.dimensions.width}×{fileData.compressionData.dimensions.height}</p>
                          )}
                        </div>
                      </div>

                      {/* Alt Text */}
                      <div>
                        <Label htmlFor={`alt-${fileData.id}`} className="text-xs">Alt Text</Label>
                        <Input
                          id={`alt-${fileData.id}`}
                          placeholder="Describe the image"
                          value={fileData.alt}
                          onChange={(e) => updateFileData(fileData.id, 'alt', e.target.value)}
                          disabled={isUploading}
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* Caption */}
                      <div>
                        <Label htmlFor={`caption-${fileData.id}`} className="text-xs">Caption</Label>
                        <Textarea
                          id={`caption-${fileData.id}`}
                          placeholder="Image caption (optional)"
                          value={fileData.caption}
                          onChange={(e) => updateFileData(fileData.id, 'caption', e.target.value)}
                          disabled={isUploading}
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {fileData.uploadStatus === "pending" && (
                            <>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-xs text-gray-600">Ready to upload</span>
                              {fileData.file.size > 10 * 1024 * 1024 && (
                                <Badge variant="destructive" className="text-xs">Still over 10MB!</Badge>
                              )}
                            </>
                          )}
                          {fileData.uploadStatus === "compressing" && (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                              <span className="text-xs text-blue-600">Compressing...</span>
                            </>
                          )}
                          {fileData.uploadStatus === "uploading" && (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                              <span className="text-xs text-blue-600">Uploading...</span>
                              <Progress value={fileData.uploadProgress} className="w-16 h-2" />
                            </>
                          )}
                          {fileData.uploadStatus === "success" && (
                            <>
                              <Check className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-green-600">Uploaded successfully!</span>
                            </>
                          )}
                          {fileData.uploadStatus === "error" && (
                            <>
                              <AlertCircle className="h-3 w-3 text-red-600" />
                              <span className="text-xs text-red-600">{fileData.error || "Upload failed"}</span>
                            </>
                          )}
                        </div>

                        {/* Re-compress button for large files */}
                        {fileData.uploadStatus === "pending" && fileData.file.size > 8 * 1024 * 1024 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => recompressFile(fileData.id)}
                            className="h-6 text-xs px-2"
                          >
                            <Compress className="h-3 w-3 mr-1" />
                            Compress More
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}