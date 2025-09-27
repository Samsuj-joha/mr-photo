// src/app/admin/features/page.tsx - CLEAN VERSION with TIFF Support
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Star,
  Settings,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  FileImage,
  Zap
} from "lucide-react"

interface Feature {
  id: string
  title: string
  description: string
  image?: string | null
  publicId?: string | null
  icon?: string | null
  published: boolean
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

interface UploadProgress {
  stage: string
  progress: number
  message: string
  details?: any
}

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    icon: "",
    published: true,
    featured: false,
    order: 0,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch features
  const fetchFeatures = async () => {
    try {
      setIsPageLoading(true)
      const response = await fetch('/api/admin/features')
      
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setFeatures(data)
        } else {
          setFeatures([])
        }
      } else {
        setFeatures([])
      }
    } catch (error) {
      console.error('Error fetching features:', error)
      setFeatures([])
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatures()
  }, [])

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateFeature = () => {
    setEditingFeature(null)
    setFormData({
      title: "",
      description: "",
      image: null,
      icon: "",
      published: true,
      featured: false,
      order: features.length + 1,
    })
    setImagePreview(null)
    setErrors({})
    setUploadProgress(null)
    setIsDialogOpen(true)
  }

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature)
    setFormData({
      title: feature.title,
      description: feature.description,
      image: null,
      icon: feature.icon || "",
      published: feature.published,
      featured: feature.featured,
      order: feature.order,
    })
    setImagePreview(feature.image || null)
    setErrors({})
    setUploadProgress(null)
    setIsDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: "" }))
      }
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setImagePreview(editingFeature?.image || null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

  const handleSaveFeature = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setUploadProgress({
      stage: "preparing",
      progress: 0,
      message: "Preparing to save feature..."
    })
    
    try {
      const saveFormData = new FormData()
      saveFormData.append('title', formData.title.trim())
      saveFormData.append('description', formData.description.trim())
      saveFormData.append('icon', formData.icon || '')
      saveFormData.append('published', formData.published.toString())
      saveFormData.append('featured', formData.featured.toString())
      saveFormData.append('order', formData.order.toString())
      
      if (formData.image) {
        saveFormData.append('image', formData.image)
        
        const { isTiff, isLarge } = getFileTypeInfo(formData.image)
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

      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (!prev) return null
          const newProgress = Math.min(prev.progress + 15, 85)
          
          if (prev.stage === "converting" && newProgress > 50) {
            return {
              stage: "uploading",
              progress: newProgress,
              message: "Uploading converted image..."
            }
          }
          
          if (prev.stage === "optimizing" && newProgress > 50) {
            return {
              stage: "uploading",
              progress: newProgress,
              message: "Uploading optimized image..."
            }
          }
          
          return {
            ...prev,
            progress: newProgress
          }
        })
      }, 800)

      const url = editingFeature ? `/api/admin/features/${editingFeature.id}` : '/api/admin/features'
      const method = editingFeature ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        body: saveFormData,
      })

      clearInterval(progressInterval)

      if (response.ok) {
        const savedFeature = await response.json()
        
        setUploadProgress({
          stage: "complete",
          progress: 100,
          message: savedFeature.message || "Feature saved successfully!",
          details: savedFeature.uploadDetails
        })
        
        await fetchFeatures()
        
        setTimeout(() => {
          setIsDialogOpen(false)
          setEditingFeature(null)
          setFormData({
            title: "",
            description: "",
            image: null,
            icon: "",
            published: true,
            featured: false,
            order: 0,
          })
          setImagePreview(null)
          setUploadProgress(null)
        }, 2000)
        
      } else {
        const errorData = await response.json()
        
        setUploadProgress({
          stage: "error",
          progress: 0,
          message: errorData.message || "Save failed",
          details: errorData.details
        })
      }
    } catch (error) {
      setUploadProgress({
        stage: "error",
        progress: 0,
        message: "Network error occurred",
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFeatures(prev => prev.filter(feature => feature.id !== featureId))
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete feature')
      }
    } catch (error) {
      console.error("Error deleting feature:", error)
      alert('An error occurred while deleting the feature')
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading features...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Features</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your website features and services
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateFeature} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </div>

      {/* Enhanced Info Banner */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <Zap className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Enhanced Upload System:</strong> Supports TIFF files (auto-converted to JPEG), automatic image optimization for large files, and smart compression.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Features</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {features.filter(f => f.published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {features.filter(f => f.featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Images</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {features.filter(f => f.image).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="group hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              {/* Image Display */}
              {feature.image ? (
                <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover rounded-t-lg"
                    onLoad={(e) => {
                      e.currentTarget.style.opacity = '1'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    style={{ 
                      opacity: '0', 
                      transition: 'opacity 0.3s'
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No image</p>
                  </div>
                </div>
              )}
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex space-x-2">
                {feature.featured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant={feature.published ? "default" : "secondary"}>
                  {feature.published ? "Published" : "Draft"}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditFeature(feature)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteFeature(feature.id)}
                    className="h-8 w-8 p-0"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {feature.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={feature.published}
                    onCheckedChange={() => {
                      const updatedFeatures = features.map(f => 
                        f.id === feature.id ? { ...f, published: !f.published } : f
                      )
                      setFeatures(updatedFeatures)
                    }}
                    size="sm"
                  />
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                {feature.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Order: {feature.order}</span>
                <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
              </div>
              
              {/* Image status indicator */}
              <div className="flex items-center justify-between text-xs">
                {feature.image ? (
                  <div className="flex items-center text-green-600">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    <span>Image: ✅ ATTACHED</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400">
                    <ImageIcon className="h-3 w-3 mr-1" />
                    <span>Image: ❌ MISSING</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? "Edit Feature" : "Create New Feature"}
            </DialogTitle>
            <DialogDescription>
              {editingFeature ? "Update feature information" : "Add a new feature. TIFF files will be automatically converted to JPEG."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter feature title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe this feature..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className={errors.description ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Feature Image</Label>
              <div className="mt-2">
                {!imagePreview ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                          Click to upload feature image
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  disabled={isLoading}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  disabled={isLoading}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  placeholder="e.g., camera, image, star"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
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

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveFeature} 
                disabled={isLoading || uploadProgress?.stage === "complete"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    {uploadProgress?.stage === "converting" ? "Converting..." :
                     uploadProgress?.stage === "optimizing" ? "Optimizing..." :
                     uploadProgress?.stage === "uploading" ? "Uploading..." :
                     "Processing..."}
                  </>
                ) : uploadProgress?.stage === "complete" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Saved Successfully!
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {editingFeature ? "Update" : "Create"} Feature
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}