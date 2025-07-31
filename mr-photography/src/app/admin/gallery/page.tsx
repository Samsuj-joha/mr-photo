// src/app/admin/gallery/page.tsx - UPDATED with Simple Form Modal
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Star,
  Camera,
  Loader2,
  X
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"

interface Gallery {
  id: string
  title: string
  description: string
  category: string
  country?: string
  imageCount: number
  featured: boolean
  published: boolean
  coverImage: string
  createdAt: string
  updatedAt: string
}

export default function AdminGallery() {
  const router = useRouter()
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch galleries from API
  const fetchGalleries = async () => {
    try {
      const response = await fetch('/api/gallery')
      if (response.ok) {
        const data = await response.json()
        setGalleries(data)
      } else {
        toast.error('Failed to fetch galleries')
      }
    } catch (error) {
      console.error('Error fetching galleries:', error)
      toast.error('Failed to fetch galleries')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGalleries()
  }, [])

  // Delete gallery
  const deleteGallery = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also delete all images in this gallery.`)) return

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Gallery deleted successfully')
        fetchGalleries()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete gallery')
      }
    } catch (error) {
      console.error('Error deleting gallery:', error)
      toast.error('Failed to delete gallery')
    }
  }

  // Navigate to gallery images page
  const viewGallery = (id: string) => {
    router.push(`/admin/gallery/${id}`)
  }

  // Get unique categories for filter
  const categories = [
    { value: "all", label: "All Categories" },
    ...Array.from(new Set(galleries.map(g => g.category))).map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ]

  // Filter galleries based on search and category
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gallery.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || gallery.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gallery Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your photo galleries and collections
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
              <DialogDescription>
                Fill in the details and upload images for your new gallery
              </DialogDescription>
            </DialogHeader>
            <CreateGalleryForm 
              onClose={() => setIsCreateModalOpen(false)} 
              onSuccess={fetchGalleries}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Total Galleries</p>
                <p className="text-2xl font-bold">{galleries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Photos</p>
                <p className="text-2xl font-bold">{galleries.reduce((acc, g) => acc + g.imageCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-2xl font-bold">{galleries.filter(g => g.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-2xl font-bold">{galleries.filter(g => g.published).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search galleries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      }`}>
        {filteredGalleries.map((gallery) => (
          <Card key={gallery.id} className="group hover:shadow-lg transition-all duration-200">
            <div className="relative overflow-hidden">
              {gallery.coverImage ? (
                <Image
                  src={gallery.coverImage}
                  alt={gallery.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  unoptimized={gallery.coverImage.includes('cloudinary.com')}
                  onError={(e) => {
                    console.error('Failed to load cover image:', gallery.coverImage)
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">No cover image</p>
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-2">
                {gallery.featured && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant={gallery.published ? "default" : "secondary"}>
                  {gallery.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {gallery.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="capitalize">{gallery.category}</span>
                    {gallery.country && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{gallery.country}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {gallery.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span>{gallery.imageCount} photos</span>
                <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => viewGallery(gallery.id)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`/gallery/${gallery.id}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => deleteGallery(gallery.id, gallery.title)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGalleries.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No galleries found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first gallery"
            }
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Gallery
          </Button>
        </div>
      )}
    </div>
  )
}

// Simple Create Gallery Form Component
function CreateGalleryForm({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    title: "",
    country: "",
    category: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Dropzone for image upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      return true
    })

    setSelectedFiles(prev => [...prev, ...validFiles])
    
    validFiles.forEach(file => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.success(`${file.name} selected (${sizeMB} MB)`)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff']
    },
    multiple: true
  })

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!formData.country.trim()) {
      toast.error('Country is required')
      return
    }
    if (!formData.category.trim()) {
      toast.error('Category is required')
      return
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setIsSubmitting(true)
    setUploading(true)
    
    try {
      // Step 1: Create gallery
      const galleryResponse = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category.trim().toLowerCase(),
          country: formData.country.trim().toLowerCase(),
          featured: false,
          published: true,
        }),
      })

      if (!galleryResponse.ok) {
        const error = await galleryResponse.json()
        throw new Error(error.error || 'Failed to create gallery')
      }

      const gallery = await galleryResponse.json()

      // Step 2: Upload images to the gallery
      let uploadSuccessCount = 0
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setUploadProgress(((i + 1) / selectedFiles.length) * 100)

        const uploadFormData = new FormData()
        uploadFormData.append('file', file)
        uploadFormData.append('galleryId', gallery.id)
        uploadFormData.append('title', file.name.split('.')[0].replace(/[_-]/g, ' '))
        uploadFormData.append('alt', file.name.split('.')[0].replace(/[_-]/g, ' '))

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          uploadSuccessCount++
          toast.success(`${file.name} uploaded successfully`)
        } else {
          const error = await uploadResponse.json()
          console.error(`Failed to upload ${file.name}:`, error)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      if (uploadSuccessCount > 0) {
        toast.success(`🎉 Gallery created! ${uploadSuccessCount}/${selectedFiles.length} images uploaded successfully`)
        
        // Reset form
        setFormData({ title: "", country: "", category: "", description: "" })
        setSelectedFiles([])
        setUploadProgress(0)
        
        // Refresh galleries and close modal
        onSuccess()
        onClose()
      } else {
        toast.error('Gallery created but no images were uploaded')
      }
      
    } catch (error) {
      console.error('Error creating gallery:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create gallery')
    } finally {
      setIsSubmitting(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Creating gallery and uploading images... ({Math.round(uploadProgress)}%)
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <Label htmlFor="title">Gallery Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter gallery title"
          required
          disabled={isSubmitting}
        />
      </div>

      {/* Country and Category in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country Name *</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. Bangladesh, India, USA"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. wedding, nature, portrait"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      {/* Description */}
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter gallery description"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* Image Upload */}
      <div>
        <Label>Upload Images *</Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors mt-2 ${
            isDragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 hover:border-gray-400"
          } ${isSubmitting ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} disabled={isSubmitting} />
          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive
                ? "Drop the images here..."
                : "Drag & drop images here, or click to select"}
            </p>
            <p className="text-xs text-gray-500">
              Any size images • JPG, PNG, GIF, WebP supported
            </p>
          </div>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Selected Images ({selectedFiles.length})</p>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          className="flex-1"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting || !formData.title || !formData.country || !formData.category || selectedFiles.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            `Create Gallery & Upload ${selectedFiles.length} Images`
          )}
        </Button>
      </div>
    </form>
  )
}