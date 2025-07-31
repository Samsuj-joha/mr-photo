// src/app/admin/gallery/upload/page.tsx (Updated with Add Option functionality)
"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  ArrowLeft,
  Plus,
  Camera
} from "lucide-react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { AddOptionModal } from "@/components/admin/AddOptionModal"

interface ImageUpload {
  id: string
  file: File
  preview: string
  title: string
  category: string
  country: string
  alt: string
}

interface FilterOption {
  value: string
  label: string
}

export default function AdminImageUpload() {
  const router = useRouter()
  const [images, setImages] = useState<ImageUpload[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Dynamic data from API
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [countries, setCountries] = useState<FilterOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)

  // Modal states
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false)
  const [addCountryModalOpen, setAddCountryModalOpen] = useState(false)

  // Fetch dynamic categories and countries on component mount
  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    setLoadingOptions(true)
    try {
      // Fetch existing categories from database
      const categoriesResponse = await fetch('/api/gallery/options/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      }

      // Fetch existing countries from database
      const countriesResponse = await fetch('/api/gallery/options/countries')
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json()
        setCountries(countriesData.countries || [])
      }
    } catch (error) {
      console.error('Error fetching options:', error)
      toast.error('Failed to load form options')
    } finally {
      setLoadingOptions(false)
    }
  }

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.')[0].replace(/[_-]/g, ' '),
      category: "",
      country: "",
      alt: file.name.split('.')[0].replace(/[_-]/g, ' ')
    }))

    setImages(prev => [...prev, ...newImages])
    
    newImages.forEach(image => {
      const sizeMB = (image.file.size / (1024 * 1024)).toFixed(2)
      toast.success(`${image.file.name} added (${sizeMB} MB)`)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff']
    },
    multiple: true
  })

  // Remove image from upload queue
  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      const removed = prev.find(img => img.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }

  // Update image details
  const updateImage = (id: string, field: keyof ImageUpload, value: string) => {
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, [field]: value } : img
      )
    )
  }

  // Handle category selection
  const handleCategoryChange = (imageId: string, value: string) => {
    if (value === "new_category") {
      setAddCategoryModalOpen(true)
    } else {
      updateImage(imageId, 'category', value)
    }
  }

  // Handle country selection
  const handleCountryChange = (imageId: string, value: string) => {
    if (value === "new_country") {
      setAddCountryModalOpen(true)
    } else {
      updateImage(imageId, 'country', value)
    }
  }

  // Handle successful addition of new category
  const handleNewCategorySuccess = (newCategory: FilterOption) => {
    setCategories(prev => [...prev, newCategory])
    toast.success(`Category "${newCategory.label}" added successfully`)
  }

  // Handle successful addition of new country
  const handleNewCountrySuccess = (newCountry: FilterOption) => {
    setCountries(prev => [...prev, newCountry])
    toast.success(`Country "${newCountry.label}" added successfully`)
  }

  // Validate form data
  const validateImages = () => {
    const errors: string[] = []
    
    if (images.length === 0) {
      errors.push("Please select at least one image")
    }

    images.forEach((image, index) => {
      if (!image.title.trim()) {
        errors.push(`Image ${index + 1}: Title is required`)
      }
      if (!image.category) {
        errors.push(`Image ${index + 1}: Category is required`)
      }
      if (!image.country) {
        errors.push(`Image ${index + 1}: Country is required`)
      }
    })

    return errors
  }

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateImages()
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      let successCount = 0
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        setUploadProgress(((i + 1) / images.length) * 100)

        // Create gallery first if it doesn't exist for this category/country combo
        const galleryResponse = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `${image.category.charAt(0).toUpperCase() + image.category.slice(1)} - ${image.country.charAt(0).toUpperCase() + image.country.slice(1)}`,
            description: `${image.category} photography from ${image.country}`,
            category: image.category,
            country: image.country,
            featured: false,
            published: true,
          }),
        })

        let galleryId
        if (galleryResponse.ok) {
          const gallery = await galleryResponse.json()
          galleryId = gallery.id
        } else {
          toast.error(`Failed to create/find gallery for ${image.title}`)
          continue
        }

        // Upload image to Cloudinary
        const formData = new FormData()
        formData.append('file', image.file)
        formData.append('galleryId', galleryId)
        formData.append('alt', image.alt)
        formData.append('title', image.title)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          successCount++
          toast.success(`${image.title} uploaded successfully`)
        } else {
          const error = await uploadResponse.json()
          toast.error(`Failed to upload ${image.title}: ${error.error}`)
        }
      }

      if (successCount > 0) {
        toast.success(`🎉 ${successCount}/${images.length} images uploaded successfully!`)
        setImages([]) // Clear the form
        
        // Refresh options in case new categories/countries were created
        await fetchOptions()
        
        // Navigate back to gallery
        setTimeout(() => {
          router.push('/admin/gallery')
        }, 1500)
      }

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loadingOptions) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Loading form options...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/gallery')}
            disabled={uploading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Images
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add new images to your photography gallery
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">
                  Uploading images... ({Math.round(uploadProgress)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Please wait while we upload your images to the gallery
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Select Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 hover:border-gray-400"
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} disabled={uploading} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragActive
                  ? "Drop the images here..."
                  : "Drag & drop images here, or click to select"}
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, GIF, WebP • Any size accepted
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Images */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Images ({images.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {images.map((image) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start space-x-4">
                    {/* Image Preview */}
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={image.preview}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        disabled={uploading}
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Image Details Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div>
                        <Label htmlFor={`title-${image.id}`}>Title *</Label>
                        <Input
                          id={`title-${image.id}`}
                          value={image.title}
                          onChange={(e) => updateImage(image.id, 'title', e.target.value)}
                          placeholder="Enter image title"
                          required
                          disabled={uploading}
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <Label htmlFor={`category-${image.id}`}>Category *</Label>
                        <Select 
                          value={image.category} 
                          onValueChange={(value) => handleCategoryChange(image.id, value)}
                          disabled={uploading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="new_category" className="text-blue-600 font-medium">
                              <div className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Category
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Country */}
                      <div>
                        <Label htmlFor={`country-${image.id}`}>Country *</Label>
                        <Select 
                          value={image.country} 
                          onValueChange={(value) => handleCountryChange(image.id, value)}
                          disabled={uploading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                            <SelectItem value="new_country" className="text-blue-600 font-medium">
                              <div className="flex items-center">
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Country
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Alt Text */}
                      <div>
                        <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
                        <Input
                          id={`alt-${image.id}`}
                          value={image.alt}
                          onChange={(e) => updateImage(image.id, 'alt', e.target.value)}
                          placeholder="Alternative text for accessibility"
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{image.file.name}</span>
                    <span>{formatFileSize(image.file.size)}</span>
                  </div>

                  {/* Validation Status */}
                  <div className="flex flex-wrap gap-2">
                    {image.title && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Title
                      </Badge>
                    )}
                    {image.category && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Category
                      </Badge>
                    )}
                    {image.country && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Country
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Section */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to upload {images.length} images</p>
                <p className="text-sm text-gray-500">
                  Make sure all required fields are filled
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={uploading || validateImages().length > 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload All Images
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Upload some images to get started with your gallery
          </p>
        </div>
      )}

      {/* Add Option Modals */}
      <AddOptionModal
        isOpen={addCategoryModalOpen}
        onClose={() => setAddCategoryModalOpen(false)}
        type="category"
        onSuccess={handleNewCategorySuccess}
      />

      <AddOptionModal
        isOpen={addCountryModalOpen}
        onClose={() => setAddCountryModalOpen(false)}
        type="country"
        onSuccess={handleNewCountrySuccess}
      />
    </div>
  )
}