"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2,
  Check,
  AlertCircle 
} from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  galleryId: string
  onUploadComplete?: (images: any[]) => void
  maxFiles?: number
}

interface UploadFile {
  file: File
  preview: string
  uploadProgress: number
  uploadStatus: "pending" | "uploading" | "success" | "error"
  uploadedData?: any
  alt: string
  caption: string
}

export function ImageUpload({ 
  galleryId, 
  onUploadComplete, 
  maxFiles = 10 
}: ImageUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    const newFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
      uploadStatus: "pending" as const,
      alt: "",
      caption: "",
    }))

    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'))
    
    const newFiles = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0,
      uploadStatus: "pending" as const,
      alt: "",
      caption: "",
    }))

    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const updateFileData = (index: number, field: 'alt' | 'caption', value: string) => {
    setFiles(prev => {
      const newFiles = [...prev]
      newFiles[index] = { ...newFiles[index], [field]: value }
      return newFiles
    })
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const uploadedImages: any[] = []

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i]
      
      // Update status to uploading
      setFiles(prev => {
        const newFiles = [...prev]
        newFiles[i] = { ...newFiles[i], uploadStatus: "uploading", uploadProgress: 0 }
        return newFiles
      })

      try {
        const formData = new FormData()
        formData.append("file", fileData.file)
        formData.append("galleryId", galleryId)
        formData.append("alt", fileData.alt)
        formData.append("caption", fileData.caption)

        // Simulate progress
        const progressInterval = setInterval(() => {
          setFiles(prev => {
            const newFiles = [...prev]
            if (newFiles[i] && newFiles[i].uploadProgress < 90) {
              newFiles[i] = { 
                ...newFiles[i], 
                uploadProgress: Math.min(newFiles[i].uploadProgress + 15, 90) 
              }
            }
            return newFiles
          })
        }, 300)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        clearInterval(progressInterval)

        if (response.ok) {
          const uploadedImage = await response.json()
          uploadedImages.push(uploadedImage)

          // Update status to success
          setFiles(prev => {
            const newFiles = [...prev]
            newFiles[i] = { 
              ...newFiles[i], 
              uploadStatus: "success", 
              uploadProgress: 100,
              uploadedData: uploadedImage
            }
            return newFiles
          })
        } else {
          // Update status to error
          setFiles(prev => {
            const newFiles = [...prev]
            newFiles[i] = { ...newFiles[i], uploadStatus: "error", uploadProgress: 0 }
            return newFiles
          })
        }
      } catch (error) {
        console.error("Upload error:", error)
        setFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = { ...newFiles[i], uploadStatus: "error", uploadProgress: 0 }
          return newFiles
        })
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

  return (
    <div className="space-y-6">
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
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Drag & drop images here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Support for JPEG, PNG, WebP, GIF (max {maxFiles} files)
            </p>
          </div>
        </div>
      )}

      {/* File Preview */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Selected Images ({files.length})</h3>
            <div className="space-x-2">
              <Button variant="outline" onClick={clearFiles} disabled={isUploading}>
                Clear All
              </Button>
              <Button onClick={uploadFiles} disabled={isUploading || files.length === 0}>
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {files.map((fileData, index) => (
              <Card key={index} className="overflow-hidden">
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
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        disabled={isUploading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    {/* File Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium text-sm truncate">{fileData.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {/* Alt Text */}
                      <div>
                        <Label htmlFor={`alt-${index}`} className="text-xs">Alt Text</Label>
                        <Input
                          id={`alt-${index}`}
                          placeholder="Describe the image"
                          value={fileData.alt}
                          onChange={(e) => updateFileData(index, 'alt', e.target.value)}
                          disabled={isUploading}
                          className="h-8 text-xs"
                        />
                      </div>

                      {/* Caption */}
                      <div>
                        <Label htmlFor={`caption-${index}`} className="text-xs">Caption</Label>
                        <Textarea
                          id={`caption-${index}`}
                          placeholder="Image caption (optional)"
                          value={fileData.caption}
                          onChange={(e) => updateFileData(index, 'caption', e.target.value)}
                          disabled={isUploading}
                          rows={2}
                          className="text-xs"
                        />
                      </div>

                      {/* Upload Status */}
                      {fileData.uploadStatus !== "pending" && (
                        <div className="space-y-2">
                          {fileData.uploadStatus === "uploading" && (
                            <div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Uploading...</span>
                                <span>{fileData.uploadProgress}%</span>
                              </div>
                              <Progress value={fileData.uploadProgress} className="h-1" />
                            </div>
                          )}
                          
                          {fileData.uploadStatus === "success" && (
                            <div className="flex items-center text-green-600 text-xs">
                              <Check className="h-3 w-3 mr-1" />
                              Upload complete
                            </div>
                          )}
                          
                          {fileData.uploadStatus === "error" && (
                            <div className="flex items-center text-red-600 text-xs">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Upload failed
                            </div>
                          )}
                        </div>
                      )}
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