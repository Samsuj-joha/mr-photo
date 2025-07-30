// src/components/admin/EnhancedImageUpload.tsx
"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileImage, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface UploadedImage {
  id?: string
  url: string
  publicId?: string
  alt?: string
  caption?: string
  uploadDetails?: {
    size: number
    sizeInMB: string
    dimensions: string
    format: string
  }
}

interface EnhancedImageUploadProps {
  galleryId?: string
  onUploadComplete?: (image: UploadedImage) => void
  onUploadStart?: () => void
  multiple?: boolean
  maxFiles?: number
}

export function EnhancedImageUpload({
  galleryId,
  onUploadComplete,
  onUploadStart,
  multiple = false,
  maxFiles = 10
}: EnhancedImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [currentFile, setCurrentFile] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      // Accept any image type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      return true
    })

    if (multiple) {
      setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles))
    } else {
      setSelectedFiles(validFiles.slice(0, 1))
    }

    validFiles.forEach(file => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.success(`${file.name} selected (${sizeMB} MB)`)
    })
  }, [multiple, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg']
    },
    multiple,
    maxFiles: multiple ? maxFiles : 1
  })

  const uploadFile = async (file: File, alt: string = "", caption: string = "") => {
    const formData = new FormData()
    formData.append('file', file)
    if (galleryId) formData.append('galleryId', galleryId)
    formData.append('alt', alt)
    formData.append('caption', caption)

    setCurrentFile(file.name)
    
    // Simulate progress for user feedback
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 500)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      return result
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload")
      return
    }

    setUploading(true)
    onUploadStart?.()
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadProgress(0)
        
        const result = await uploadFile(file)
        
        setUploadedImages(prev => [...prev, result])
        onUploadComplete?.(result)
        
        const sizeMB = result.uploadDetails?.sizeInMB || (file.size / (1024 * 1024)).toFixed(2)
        toast.success(`${file.name} uploaded successfully (${sizeMB} MB)`)
      }
      
      setSelectedFiles([])
      setUploadProgress(0)
      setCurrentFile("")
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop the images here..."
                  : "Drag & drop images here, or click to select"}
              </p>
              <p className="text-sm text-gray-500">
                Any size images accepted • Supports: JPG, PNG, GIF, WebP, and more
              </p>
              {multiple && (
                <p className="text-sm text-gray-400">
                  Select up to {maxFiles} files
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Selected Files</h3>
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileImage className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">
                  Uploading {currentFile}...
                </span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-500">
                {uploadProgress.toFixed(0)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <Button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full"
          size="lg"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
            </>
          )}
        </Button>
      )}

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Uploaded Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt || "Uploaded image"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {image.uploadDetails && (
                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Size: {image.uploadDetails.sizeInMB} MB</p>
                      <p>Dimensions: {image.uploadDetails.dimensions}</p>
                      <p>Format: {image.uploadDetails.format.toUpperCase()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}