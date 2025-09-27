// src/components/admin/portfolio/CreatePortfolioForm.tsx
// Enhanced portfolio creation form with TIFF support and upload progress

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileImage,
  Zap
} from "lucide-react"

interface Portfolio {
  id: string
  title: string
  description: string
  gallery: string
  coverImage: string
  createdAt: string
  views: number
}

interface CreatePortfolioFormProps {
  onClose: () => void
  onPortfolioCreated: (portfolio: Portfolio) => void
}

interface UploadProgress {
  stage: string
  progress: number
  message: string
  details?: any
}

export default function CreatePortfolioForm({ onClose, onPortfolioCreated }: CreatePortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    gallery: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<any>(null)

  const galleryOptions = [
    { value: "portraits", label: "Portraits" },
    { value: "landscape", label: "Landscape" },
    { value: "abstract", label: "Abstract" },
    { value: "wedding", label: "Wedding" },
    { value: "street", label: "Street Photography" },
    { value: "commercial", label: "Commercial" }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    
    if (!formData.image) {
      newErrors.image = "Image is required"
    }
    
    if (!formData.gallery) {
      newErrors.gallery = "Gallery category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setUploadProgress({
      stage: "preparing",
      progress: 0,
      message: "Preparing upload..."
    })

    try {
      // Create FormData for file upload
      const portfolioFormData = new FormData()
      portfolioFormData.append('title', formData.title)
      portfolioFormData.append('description', formData.description)
      portfolioFormData.append('gallery', formData.gallery)
      
      if (formData.image) {
        portfolioFormData.append('image', formData.image)
        
        // Show file analysis
        const isTiff = formData.image.type === 'image/tiff' || 
                      formData.image.type === 'image/tif' || 
                      formData.image.name.toLowerCase().endsWith('.tif') || 
                      formData.image.name.toLowerCase().endsWith('.tiff')
        
        const isLarge = formData.image.size > 10 * 1024 * 1024
        const fileSizeMB = (formData.image.size / (1024 * 1024)).toFixed(2)
        
        if (isTiff) {
          setUploadProgress({
            stage: "converting",
            progress: 20,
            message: `Converting TIFF file (${fileSizeMB}MB) to JPEG...`,
            details: { originalFormat: "TIFF", targetFormat: "JPEG" }
          })
        } else if (isLarge) {
          setUploadProgress({
            stage: "optimizing",
            progress: 20,
            message: `Optimizing large file (${fileSizeMB}MB)...`,
            details: { originalSize: fileSizeMB + "MB" }
          })
        } else {
          setUploadProgress({
            stage: "uploading",
            progress: 30,
            message: "Uploading to cloud storage..."
          })
        }
      }

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (!prev) return null
          const newProgress = Math.min(prev.progress + 15, 85)
          
          if (prev.stage === "converting" && newProgress > 50) {
            return {
              stage: "uploading",
              progress: newProgress,
              message: "Uploading converted image to cloud..."
            }
          }
          
          if (prev.stage === "optimizing" && newProgress > 50) {
            return {
              stage: "uploading",
              progress: newProgress,
              message: "Uploading optimized image to cloud..."
            }
          }
          
          return {
            ...prev,
            progress: newProgress
          }
        })
      }, 800)

      const response = await fetch('/api/admin/portfolios', {
        method: 'POST',
        body: portfolioFormData,
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const newPortfolio = await response.json()
        
        setUploadProgress({
          stage: "complete",
          progress: 100,
          message: newPortfolio.message || "Portfolio created successfully!",
          details: newPortfolio.uploadDetails
        })

        setUploadSuccess(newPortfolio)
        
        // Add to parent component's list
        onPortfolioCreated(newPortfolio)
        
        // Close after a short delay to show success
        setTimeout(() => {
          onClose()
        }, 2000)
        
      } else {
        const errorData = await response.json()
        clearInterval(progressInterval)
        
        setUploadProgress({
          stage: "error",
          progress: 0,
          message: errorData.message || "Upload failed",
          details: errorData.details
        })
      }
    } catch (error) {
      console.error('Error creating portfolio:', error)
      setUploadProgress({
        stage: "error",
        progress: 0,
        message: "Network error occurred",
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Clear error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }))
      }
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB'
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getFileTypeInfo = (file: File) => {
    const isTiff = file.type === 'image/tiff' || 
                  file.type === 'image/tif' || 
                  file.name.toLowerCase().endsWith('.tif') || 
                  file.name.toLowerCase().endsWith('.tiff')
    
    const isLarge = file.size > 10 * 1024 * 1024
    
    return { isTiff, isLarge }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter portfolio title"
          className={errors.title ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Describe your portfolio project..."
          rows={4}
          className={errors.description ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      {/* Image Upload Field */}
      <div>
        <Label htmlFor="image">Portfolio Cover Image *</Label>
        <div className="mt-2">
          {!imagePreview ? (
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Click to upload portfolio image
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PNG, JPG, TIFF, WebP up to 50MB
                  </span>
                  <span className="mt-1 block text-xs text-blue-600">
                    ✨ TIFF files will be automatically converted to JPEG
                  </span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.tif,.tiff"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* File Info */}
              {formData.image && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <FileImage className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{formData.image.name}</span>
                    </div>
                    <span className="text-gray-500">{formatFileSize(formData.image.size)}</span>
                  </div>
                  
                  {(() => {
                    const { isTiff, isLarge } = getFileTypeInfo(formData.image!)
                    return (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {isTiff && (
                          <div className="flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            <Zap className="h-3 w-3 mr-1" />
                            Will convert TIFF → JPEG
                          </div>
                        )}
                        {isLarge && (
                          <div className="flex items-center text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                            <Zap className="h-3 w-3 mr-1" />
                            Will optimize large file
                          </div>
                        )}
                        {!isTiff && !isLarge && (
                          <div className="flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ready to upload
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image}</p>
        )}
      </div>

      {/* Gallery Category Field */}
      <div>
        <Label htmlFor="gallery">Gallery Category *</Label>
        <Select 
          value={formData.gallery} 
          onValueChange={(value) => handleInputChange("gallery", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className={errors.gallery ? "border-red-500" : ""}>
            <SelectValue placeholder="Select gallery category" />
          </SelectTrigger>
          <SelectContent>
            {galleryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.gallery && (
          <p className="text-sm text-red-500 mt-1">{errors.gallery}</p>
        )}
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <Alert className={`${
          uploadProgress.stage === "error" ? "border-red-500 bg-red-50 dark:bg-red-950" :
          uploadProgress.stage === "complete" ? "border-green-500 bg-green-50 dark:bg-green-950" :
          "border-blue-500 bg-blue-50 dark:bg-blue-950"
        }`}>
          <div className="flex items-center space-x-2">
            {uploadProgress.stage === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : uploadProgress.stage === "complete" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            )}
            <AlertDescription className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{uploadProgress.message}</span>
                  <span className="text-sm text-gray-500">{uploadProgress.progress}%</span>
                </div>
                
                {uploadProgress.stage !== "error" && uploadProgress.stage !== "complete" && (
                  <Progress value={uploadProgress.progress} className="w-full" />
                )}
                
                {uploadProgress.details && uploadProgress.stage === "complete" && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {uploadProgress.details.wasConverted && (
                      <div>✅ Converted from {uploadProgress.details.originalFormat} to {uploadProgress.details.finalFormat}</div>
                    )}
                    {uploadProgress.details.wasOptimized && (
                      <div>🎯 Optimized: {(uploadProgress.details.originalSize / 1024 / 1024).toFixed(2)}MB → {(uploadProgress.details.finalSize / 1024 / 1024).toFixed(2)}MB</div>
                    )}
                    {uploadProgress.details.dimensions && (
                      <div>📐 Dimensions: {uploadProgress.details.dimensions}</div>
                    )}
                  </div>
                )}
                
                {uploadProgress.details && uploadProgress.stage === "error" && (
                  <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                    {typeof uploadProgress.details === 'string' ? uploadProgress.details : JSON.stringify(uploadProgress.details)}
                  </div>
                )}
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Form Buttons */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || uploadProgress?.stage === "complete"}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              {uploadProgress?.stage === "converting" ? "Converting..." :
               uploadProgress?.stage === "optimizing" ? "Optimizing..." :
               uploadProgress?.stage === "uploading" ? "Uploading..." :
               "Processing..."}
            </div>
          ) : uploadProgress?.stage === "complete" ? (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Created Successfully!
            </div>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </>
          )}
        </Button>
      </div>
    </form>
  )
}