"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2, Check, AlertCircle, Compress } from "lucide-react"
import Image from "next/image"

// CRITICAL: Import compression functions
import { resizeForCloudinary, formatFileSize, needsCompression } from "@/lib/quickResize"

interface ImageUploadProps {
  galleryId?: string  // Made optional to work with home slider
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

export function ImageUpload({ galleryId, onUploadComplete, maxFiles = 10 }: ImageUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const processFileWithCompression = async (file: File, fileId: string) => {
    console.log(`🔄 Processing ${file.name} (${formatFileSize(file.size)})...`)
    
    try {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, uploadStatus: "compressing" } : f))

      if (await needsCompression(file)) {
        console.log(`🗜️ Compressing ${file.name}...`)
        const compressionResult = await resizeForCloudinary(file)
        
        setFiles(prev => prev.map(f => f.id === fileId ? {
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
        } : f))
      } else {
        console.log(`✅ File ${file.name} is already optimized`)
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, uploadStatus: "pending" } : f))
      }
    } catch (error) {
      console.error(`❌ Compression failed for ${file.name}:`, error)
      setFiles(prev => prev.map(f => f.id === fileId ? { 
        ...f, uploadStatus: "pending", error: "Compression failed, using original file"
      } : f))
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    console.log(`📂 Selected ${selectedFiles.length} files`)
    
    const newFiles = selectedFiles.map(file => ({
      id: generateFileId(),
      file, originalFile: file,
      preview: URL.createObjectURL(file),
      uploadProgress: 0, uploadStatus: "compressing" as const,
      alt: "", caption: "",
    }))

    setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles))
    for (const newFile of newFiles) {
      await processFileWithCompression(newFile.originalFile, newFile.id)
    }
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'))
    
    const fakeEvent = { target: { files: imageFiles } } as React.ChangeEvent<HTMLInputElement>
    handleFileSelect(fakeEvent)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const uploadFiles = async () => {
    setIsUploading(true)
    const pendingFiles = files.filter(f => f.uploadStatus === "pending")
    const uploadedImages = []

    console.log(`🚀 Starting upload of ${pendingFiles.length} files`)

    for (const fileData of pendingFiles) {
      try {
        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, uploadStatus: "uploading", uploadProgress: 0 } : f))
        console.log(`⬆️ Uploading: ${fileData.file.name} (${formatFileSize(fileData.file.size)})`)

        const formData = new FormData()
        formData.append("file", fileData.file) // This is now compressed!
        
        // Only add galleryId if provided (works with home slider)
        if (galleryId) {
          formData.append("galleryId", galleryId)
        }
        
        formData.append("alt", fileData.alt)
        formData.append("caption", fileData.caption)

        const response = await fetch("/api/upload", { method: "POST", body: formData })

        if (response.ok) {
          const uploadedImage = await response.json()
          uploadedImages.push(uploadedImage)
          console.log(`✅ Upload successful: ${fileData.file.name}`)
          setFiles(prev => prev.map(f => f.id === fileData.id ? { 
            ...f, uploadStatus: "success", uploadProgress: 100, uploadedData: uploadedImage
          } : f))
        } else {
          const errorData = await response.json()
          console.error(`❌ Upload failed:`, errorData)
          setFiles(prev => prev.map(f => f.id === fileData.id ? { 
            ...f, uploadStatus: "error", uploadProgress: 0, error: errorData.error || "Upload failed"
          } : f))
        }
      } catch (error) {
        console.error("Upload error:", error)
        setFiles(prev => prev.map(f => f.id === fileData.id ? { 
          ...f, uploadStatus: "error", uploadProgress: 0, error: "Network error"
        } : f))
      }
    }

    setIsUploading(false)
    if (uploadedImages.length > 0 && onUploadComplete) {
      onUploadComplete(uploadedImages)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId)
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.preview)
      return prev.filter(f => f.id !== fileId)
    })
  }

  const updateFileData = (fileId: string, field: 'alt' | 'caption', value: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, [field]: value } : f))
  }

  const clearFiles = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
    setFiles([])
  }

  const pendingFiles = files.filter(f => f.uploadStatus === "pending")
  const compressingFiles = files.filter(f => f.uploadStatus === "compressing")

  return (
    <div className="space-y-6">
      {/* Compression Status */}
      {compressingFiles.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">🗜️ Compressing {compressingFiles.length} file(s)...</span>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />

      {/* Dropzone */}
      {files.length < maxFiles && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isUploading ? "border-gray-300 bg-gray-50 cursor-not-allowed" : "border-gray-300 hover:border-blue-400"
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div>
            <p className="text-lg text-gray-600 mb-2">📸 Drop your photography here</p>
            <p className="text-sm text-gray-500">
              <Compress className="inline h-4 w-4 mr-1" />Large images will be automatically compressed
            </p>
          </div>
        </div>
      )}

      {/* Files Preview */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Upload Queue ({files.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFiles} disabled={isUploading}>Clear All</Button>
              <Button onClick={uploadFiles} disabled={isUploading || pendingFiles.length === 0}>
                {isUploading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</> : 
                `Upload ${pendingFiles.length} Image${pendingFiles.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {files.map((fileData) => (
              <Card key={fileData.id}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image src={fileData.preview} alt="Preview" fill className="object-cover rounded" />
                      <button onClick={() => removeFile(fileData.id)} disabled={isUploading}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium text-sm truncate">{fileData.file.name}</p>
                        <div className="text-xs text-gray-500">
                          <span>Original: {formatFileSize(fileData.originalFile.size)}</span>
                          {fileData.compressionData && (
                            <span className="text-green-600"> → {formatFileSize(fileData.compressionData.newSize)} ({(fileData.compressionData.compressionRatio * 100).toFixed(1)}% saved)</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Alt Text</Label>
                        <Input placeholder="Describe the image" value={fileData.alt} 
                          onChange={(e) => updateFileData(fileData.id, 'alt', e.target.value)} 
                          disabled={isUploading} className="h-8 text-xs" />
                      </div>

                      <div>
                        <Label className="text-xs">Caption</Label>
                        <Textarea placeholder="Image caption" value={fileData.caption} rows={2}
                          onChange={(e) => updateFileData(fileData.id, 'caption', e.target.value)} 
                          disabled={isUploading} className="text-xs" />
                      </div>

                      <div className="flex items-center gap-2">
                        {fileData.uploadStatus === "compressing" && (
                          <><Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-xs text-blue-600">Compressing...</span></>
                        )}
                        {fileData.uploadStatus === "pending" && (
                          <><div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Ready to upload</span></>
                        )}
                        {fileData.uploadStatus === "uploading" && (
                          <><Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-xs text-blue-600">Uploading...</span></>
                        )}
                        {fileData.uploadStatus === "success" && (
                          <><Check className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">Uploaded!</span></>
                        )}
                        {fileData.uploadStatus === "error" && (
                          <><AlertCircle className="h-3 w-3 text-red-600" />
                          <span className="text-xs text-red-600">{fileData.error || "Upload failed"}</span></>
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