"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Eye,
  XCircle,
  Trash2,
  Loader2,
  FileText,
  Plus,
  Tag,
  X,
  RefreshCw,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  url: string
  publicId: string
  alt?: string
  caption?: string
  order: number
  year?: number
  category?: string
  published?: boolean // Image publish status (draft by default)
  createdAt: string
  galleryId: string
  gallery?: {
    id: string
    title: string
    category: string
    country?: string
    published?: boolean
  }
}

// Category color mapping - 20 categories
const categoryColors: Record<string, string> = {
  Nature: "bg-green-500",
  Travel: "bg-blue-500",
  Portrait: "bg-pink-500",
  Sports: "bg-red-500",
  Urban: "bg-purple-500",
  Wildlife: "bg-yellow-500",
  Food: "bg-orange-500",
  Architecture: "bg-indigo-500",
  Abstract: "bg-gray-500",
  Macro: "bg-teal-500",
  Events: "bg-rose-500",
  Other: "bg-gray-400",
  Birds: "bg-cyan-500",
  Ocean: "bg-blue-600",
  Animal: "bg-amber-500",
  Landscape: "bg-emerald-600",
  Street: "bg-slate-600",
  Fashion: "bg-fuchsia-500",
  Wedding: "bg-pink-600",
  Concert: "bg-violet-600",
}

// Helper function to capitalize first letter of category names
const capitalizeCategory = (category: string): string => {
  if (!category) return category
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

export default function GalleryManagePage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [allCategories, setAllCategories] = useState<string[]>([])
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [reAnalyzing, setReAnalyzing] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; provider: string } | null>(null)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editCategoryValue, setEditCategoryValue] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [isEditView, setIsEditView] = useState(false)
  const [allAvailableCategories, setAllAvailableCategories] = useState<string[]>([])
  const [aiLabels, setAiLabels] = useState<{ label: string; confidence: number }[]>([])
  const [loadingLabels, setLoadingLabels] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Fetch all images from all galleries
  const fetchImages = async () => {
    setLoading(true)
    try {
      // Fetch all galleries first
      const galleriesResponse = await fetch('/api/gallery')
      if (!galleriesResponse.ok) throw new Error('Failed to fetch galleries')
      
      const galleries = await galleriesResponse.json()
      
      // Fetch images from each gallery
      const allImages: GalleryImage[] = []
      for (const gallery of galleries) {
        try {
          const imagesResponse = await fetch(`/api/gallery/${gallery.id}?skipPublishedCheck=true`)
          if (imagesResponse.ok) {
            const galleryData = await imagesResponse.json()
            if (galleryData.images && Array.isArray(galleryData.images)) {
              const galleryImages = galleryData.images.map((img: any) => ({
                ...img,
                galleryId: gallery.id,
                gallery: {
                  id: gallery.id,
                  title: gallery.title,
                  category: gallery.category,
                  country: gallery.country,
                  published: gallery.published,
                }
              }))
              allImages.push(...galleryImages)
            }
          }
        } catch (error) {
          console.error(`Error fetching images for gallery ${gallery.id}:`, error)
        }
      }
      
      setImages(allImages)
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAllCategories(data.categories || [])
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch AI labels for selected image
  const fetchAiLabels = async (imageId: string) => {
    if (!imageId) return
    setLoadingLabels(true)
    try {
      const response = await fetch(`/api/gallery/image/${imageId}`)
      if (response.ok) {
        const data = await response.json()
        setAiLabels(data.aiLabels || [])
      }
    } catch (error) {
      console.error('Error fetching AI labels:', error)
      setAiLabels([])
    } finally {
      setLoadingLabels(false)
    }
  }


  // Fetch all available categories for the Label view
  const fetchAllAvailableCategories = async () => {
    try {
      const response = await fetch('/api/gallery/options/categories')
      if (response.ok) {
        const data = await response.json()
        const categories = data.categories || []
        // Extract category names and add default ones if needed
        const categoryNames = categories.map((cat: any) => cat.value || cat.label || cat)
        // Add default 20 categories if not all present
        const defaultCategories = [
          "Nature", "Travel", "Portrait", "Sports", "Urban", 
          "Wildlife", "Food", "Architecture", "Abstract", "Macro",
          "Events", "Birds", "Ocean", "Animal", "Landscape",
          "Street", "Fashion", "Wedding", "Concert", "Other"
        ]
        const combined = [...new Set([...defaultCategories, ...categoryNames])]
        setAllAvailableCategories(combined.slice(0, 20))
      } else {
        // Fallback to default categories
        const defaultCategories = [
          "Nature", "Travel", "Portrait", "Sports", "Urban", 
          "Wildlife", "Food", "Architecture", "Abstract", "Macro",
          "Events", "Birds", "Ocean", "Animal", "Landscape",
          "Street", "Fashion", "Wedding", "Concert", "Other"
        ]
        setAllAvailableCategories(defaultCategories)
      }
    } catch (error) {
      console.error('Error fetching available categories:', error)
      // Fallback to default categories
      const defaultCategories = [
        "Nature", "Travel", "Portrait", "Sports", "Urban", 
        "Wildlife", "Food", "Architecture", "Abstract", "Macro",
        "Events", "Birds", "Ocean", "Animal", "Landscape",
        "Street", "Fashion", "Wedding", "Concert", "Other"
      ]
      setAllAvailableCategories(defaultCategories)
    }
  }

  // Check API status
  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/admin/settings/image-analysis')
      if (response.ok) {
        const data = await response.json()
        setApiStatus({
          configured: !!(data.clarifaiApiKey || data.googleApiKey || data.azureKey),
          provider: data.activeProvider || 'clarifai'
        })
      }
    } catch (error) {
      console.error('Error checking API status:', error)
    }
  }

  // Re-analyze single image
  const reAnalyzeImage = async (imageId: string) => {
    setReAnalyzing(imageId)
    try {
      const response = await fetch('/api/admin/images/re-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        const categoriesList = data.categories?.join(", ") || data.newCategory
        toast.success(`Image re-analyzed: ${data.oldCategory || 'None'} → ${categoriesList}`)
        await fetchImages()
        await fetchCategories()
      } else {
        toast.error(data.error || data.message || 'Failed to re-analyze image')
        if (data.message?.includes('API key')) {
          toast.info('Please configure your API key in Settings → API tab')
        }
      }
    } catch (error) {
      console.error('Error re-analyzing image:', error)
      toast.error('Failed to re-analyze image')
    } finally {
      setReAnalyzing(null)
    }
  }

  // Update image category manually
  const updateImageCategory = async (imageId: string, category: string) => {
    try {
      const response = await fetch('/api/admin/images/update-category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, category })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success('Category updated successfully')
        await fetchImages()
        await fetchCategories()
        setEditingCategory(null)
        setEditCategoryValue("")
      } else {
        toast.error(data.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    }
  }

  // Toggle category - add if not present, remove if present
  const toggleCategory = async (category: string) => {
    if (!selectedImage) return

    const currentCategories = (selectedImage.category || "")
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0)
    
    const trimmedCategory = category.trim()
    const isAssigned = currentCategories.includes(trimmedCategory)
    
    let newCategories: string[]
    if (isAssigned) {
      // Remove category
      newCategories = currentCategories.filter(c => c !== trimmedCategory)
    } else {
      // Add category
      newCategories = [...currentCategories, trimmedCategory]
    }

    const categoryString = newCategories.join(", ")
    
    try {
      const response = await fetch('/api/admin/images/update-category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId: selectedImage.id, category: categoryString })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        // Update local state immediately for better UX
        setSelectedImage({
          ...selectedImage,
          category: categoryString
        })
        
        toast.success(isAssigned ? `Removed "${trimmedCategory}" category` : `Added "${trimmedCategory}" category`)
        
        // Refresh images list
        await fetchImages()
        await fetchCategories()
        
        // Scroll to image and highlight
        if (imageRef.current) {
          imageRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          })
          
          imageRef.current.style.transition = "box-shadow 0.3s ease"
          imageRef.current.style.boxShadow = isAssigned 
            ? "0 0 30px rgba(239, 68, 68, 0.6)" 
            : "0 0 30px rgba(34, 197, 94, 0.6)"
          
          setTimeout(() => {
            if (imageRef.current) {
              imageRef.current.style.boxShadow = ""
            }
          }, 2000)
        }
      } else {
        toast.error(data.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error toggling category:', error)
      toast.error('Failed to update category')
    }
  }

  // Re-analyze all images
  const reAnalyzeAll = async () => {
    if (!confirm('This will re-analyze all images using AI. This may take a while. Continue?')) {
      return
    }

    setReAnalyzing('all')
    try {
      const response = await fetch('/api/admin/images/re-analyze', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(`Re-analyzed ${data.analyzed} images successfully`)
        await fetchImages()
        await fetchCategories()
      } else {
        toast.error(data.error || data.message || 'Failed to re-analyze images')
        if (data.message?.includes('API key')) {
          toast.info('Please configure your API key in Settings → API tab')
        }
      }
    } catch (error) {
      console.error('Error re-analyzing images:', error)
      toast.error('Failed to re-analyze images')
    } finally {
      setReAnalyzing(null)
    }
  }

  useEffect(() => {
    fetchImages()
    fetchCategories()
    fetchAllAvailableCategories()
    checkApiStatus()
  }, [])

  // Get unique categories from images (use image category first, fallback to gallery category)
  const categories = useMemo(() => {
    const cats = new Set<string>()
    images.forEach(img => {
      // Use image's own category first, fallback to gallery category
      const category = img.category || img.gallery?.category
      if (category) {
        cats.add(category)
      }
    })
    return Array.from(cats).sort()
  }, [images])

  // Filter images
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesSearch = 
        img.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.gallery?.title.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "published" && img.published === true) ||
        (filterStatus === "draft" && img.published !== true)
      
      const matchesCategory = 
        filterCategory === "all" ||
        (img.category || img.gallery?.category) === filterCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [images, searchQuery, filterStatus, filterCategory])

  // Keyboard navigation for admin modal (moved after filteredImages definition)
  useEffect(() => {
    if (!selectedImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentImageIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
          const prevImage = filteredImages[currentImageIndex - 1]
          setSelectedImage(prevImage)
          setIsEditView(false)
          fetchAiLabels(prevImage.id).catch(() => {})
        } else if (e.key === 'ArrowRight' && currentImageIndex < filteredImages.length - 1) {
          const nextImage = filteredImages[currentImageIndex + 1]
          setSelectedImage(nextImage)
          setIsEditView(false)
          fetchAiLabels(nextImage.id).catch(() => {})
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, filteredImages])

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredImages.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredImages.map(img => img.id)))
    }
  }

  // Delete image
  const deleteImage = async (id: string) => {
    setDeletingIds(prev => new Set(prev).add(id))
    try {
      const response = await fetch(`/api/gallery/image/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        toast.success('Image deleted successfully')
        setImages(prev => prev.filter(img => img.id !== id))
        setSelectedIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
        if (selectedImage?.id === id) {
          setSelectedImage(null)
        }
        await fetchImages() // Refresh the list
      } else {
        toast.error('Failed to delete image')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Bulk delete
  const bulkDelete = async () => {
    if (selectedIds.size === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} image(s)?`)) {
      return
    }

    const idsToDelete = Array.from(selectedIds)
    setDeletingIds(new Set(idsToDelete))
    
    try {
      await Promise.all(idsToDelete.map(id => deleteImage(id)))
      toast.success(`${idsToDelete.length} image(s) deleted`)
      setSelectedIds(new Set())
    } catch (error) {
      toast.error('Some images failed to delete')
    } finally {
      setDeletingIds(new Set())
    }
  }

  // Toggle publish status
  const togglePublish = async (image: GalleryImage) => {
    try {
      const newPublishedStatus = !image.published
      const response = await fetch(`/api/gallery/images/${image.id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: newPublishedStatus })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update publish status')
      }

      // Update local state
      setImages(prev => prev.map(img => 
        img.id === image.id ? { ...img, published: newPublishedStatus } : img
      ))

      // Update selected image if it's the one being toggled
      if (selectedImage?.id === image.id) {
        setSelectedImage({ ...selectedImage, published: newPublishedStatus })
      }

      toast.success(newPublishedStatus ? 'Image published successfully!' : 'Image unpublished (draft)')
    } catch (error) {
      console.error('Error toggling publish:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update publish status')
    }
  }

  // Add new category
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setLoadingCategories(true)
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategoryName.trim() })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(`Category "${newCategoryName.trim()}" added successfully`)
        setNewCategoryName("")
        setShowCategoryDialog(false)
        await fetchCategories()
        await fetchImages() // Refresh to show new category
      } else {
        toast.error(data.error || 'Failed to add category')
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
    } finally {
      setLoadingCategories(false)
    }
  }

  // Delete category
  const deleteCategory = async (category: string) => {
    if (!confirm(`Are you sure you want to delete category "${category}"? This will only work if no galleries, images, or portfolios use it.`)) {
      return
    }

    setLoadingCategories(true)
    try {
      const response = await fetch(`/api/admin/categories?category=${encodeURIComponent(category)}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(`Category "${category}" removed successfully`)
        await fetchCategories()
        await fetchImages()
      } else {
        toast.error(data.error || data.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    } finally {
      setLoadingCategories(false)
    }
  }

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Images</h1>
          <p className="text-muted-foreground">
            Review, categorize, and publish your photos ({images.length} total)
          </p>
          {apiStatus && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={apiStatus.configured ? "default" : "destructive"}>
                {apiStatus.configured ? `✓ AI API Configured (${apiStatus.provider})` : "⚠ No API Key"}
              </Badge>
              {!apiStatus.configured && (
                <span className="text-xs text-muted-foreground">
                  Go to Settings → API to configure
                </span>
              )}
            </div>
          )}
        </div>
        {apiStatus?.configured && (
          <Button 
            onClick={reAnalyzeAll} 
            disabled={reAnalyzing === 'all'}
            variant="outline"
            className="flex items-center gap-2"
          >
            {reAnalyzing === 'all' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Re-analyzing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Re-analyze All with AI
              </>
            )}
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {capitalizeCategory(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => setShowCategoryDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <Tag className="h-4 w-4" />
            Manage Categories
          </Button>
        </div>
      </Card>

      {/* Category Management Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Manage Categories
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add New Category */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter new category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCategory()
                  }
                }}
              />
              <Button onClick={addCategory} disabled={loadingCategories || !newCategoryName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Categories List */}
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-3">All Categories ({allCategories.length})</h3>
              {allCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories found. Add one above.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1"
                    >
                      <span>{capitalizeCategory(cat)}</span>
                      <button
                        onClick={() => deleteCategory(cat)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                        disabled={loadingCategories}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted">
              <tr>
                <th className="p-4 text-left w-10">
                  <Checkbox
                    checked={selectedIds.size === filteredImages.length && filteredImages.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 text-left w-16">Image</th>
                <th className="p-4 text-left flex-1">Title</th>
                <th className="p-4 text-left w-40">Category</th>
                <th className="p-4 text-left w-24">Date</th>
                <th className="p-4 text-left w-24">Status</th>
                <th className="p-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredImages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No images found
                  </td>
                </tr>
              ) : (
                filteredImages.map((img) => (
                  <tr key={img.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 w-10">
                      <Checkbox
                        checked={selectedIds.has(img.id)}
                        onCheckedChange={() => toggleSelection(img.id)}
                      />
                    </td>
                    <td className="p-4 w-16">
                      <div 
                        className="relative w-12 h-12 rounded overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(img)}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt || img.caption || "Gallery image"}
                          fill
                          className="object-cover"
                          unoptimized={img.url.includes('cloudinary.com')}
                        />
                      </div>
                    </td>
                    <td 
                      className="p-4 font-medium flex-1 truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setSelectedImage(img)}
                    >
                      {img.alt || img.caption || img.gallery?.title || "Untitled"}
                    </td>
                    <td className="p-4 w-40">
                      <div className="flex flex-wrap gap-1">
                        {(img.category || img.gallery?.category) ? (
                          (img.category || img.gallery?.category)
                            .split(",")
                            .map((cat, idx) => {
                              const trimmedCat = cat.trim()
                              return (
                                <Badge
                                  key={idx}
                                  className={`text-xs text-white ${
                                    categoryColors[trimmedCat] || "bg-gray-500"
                                  }`}
                                >
                                  {capitalizeCategory(trimmedCat)}
                                </Badge>
                              )
                            })
                        ) : (
                          <Badge variant="outline" className="text-xs">Uncategorized</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground w-24 text-sm">
                      {new Date(img.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 w-24">
                      {img.published ? (
                        <Badge className="bg-green-600 text-white">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </td>
                    <td className="p-4 text-right w-20">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            // Set image immediately for instant response
                            setSelectedImage(img)
                            setIsEditView(false)
                            // Fetch AI labels asynchronously without blocking
                            fetchAiLabels(img.id).catch(() => {})
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {img.published ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => togglePublish(img)}
                            title="Unpublish"
                          >
                            <XCircle className="h-4 w-4 text-orange-600" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => togglePublish(img)}
                            title="Publish"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this image?')) {
                              deleteImage(img.id)
                            }
                          }}
                          disabled={deletingIds.has(img.id)}
                        >
                          {deletingIds.has(img.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Image Detail Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => {
        if (!open) {
          setSelectedImage(null)
          setIsEditView(false)
          setAiLabels([])
          setEditingCategory(null)
          setEditCategoryValue("")
        }
      }}>
        <DialogContent className="!max-w-none !w-[calc(100vw-100px)] !max-h-[calc(100vh-100px)] overflow-hidden flex flex-col p-0 gap-0 rounded-none !left-[50px] !top-[50px] !right-[50px] !bottom-[50px] !translate-x-0 !translate-y-0">
          <DialogHeader className="px-3 pt-3 pb-2 border-b">
            <DialogTitle className="text-xl font-bold">
              {selectedImage?.alt || selectedImage?.caption || selectedImage?.gallery?.title || "Image Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (() => {
            const currentImageIndex = filteredImages.findIndex(img => img.id === selectedImage.id)
            const hasPrevious = currentImageIndex > 0
            const hasNext = currentImageIndex < filteredImages.length - 1
            
            const goToPrevious = () => {
              if (hasPrevious) {
                const prevImage = filteredImages[currentImageIndex - 1]
                setSelectedImage(prevImage)
                setIsEditView(false)
                fetchAiLabels(prevImage.id).catch(() => {})
              }
            }
            
            const goToNext = () => {
              if (hasNext) {
                const nextImage = filteredImages[currentImageIndex + 1]
                setSelectedImage(nextImage)
                setIsEditView(false)
                fetchAiLabels(nextImage.id).catch(() => {})
              }
            }
            
            return (
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row relative">
                {/* Navigation buttons */}
                {filteredImages.length > 1 && (
                  <>
                    {hasPrevious && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={goToPrevious}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
                        title="Previous image (←)"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    )}
                    {hasNext && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full h-12 w-12"
                        title="Next image (→)"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    )}
                  </>
                )}
                
                {/* Image Section */}
                <div className="w-full lg:w-[55%] flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-3">
                  <div 
                    ref={imageRef}
                    className="relative bg-black/5 dark:bg-black/20 flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300" 
                    style={{ minHeight: '500px', maxHeight: 'calc(95vh - 200px)' }}
                  >
                    <Image
                      src={selectedImage.url}
                      alt={selectedImage.alt || selectedImage.caption || "Gallery image"}
                      width={1200}
                      height={900}
                      className="max-h-full max-w-full object-contain rounded-lg"
                      loading="eager"
                      priority
                      unoptimized={selectedImage.url.includes('cloudinary.com')}
                    />
                    {/* Preload adjacent images */}
                    {hasPrevious && (
                      <link rel="preload" as="image" href={filteredImages[currentImageIndex - 1].url} />
                    )}
                    {hasNext && (
                      <link rel="preload" as="image" href={filteredImages[currentImageIndex + 1].url} />
                    )}
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="w-full lg:w-[45%] overflow-y-auto flex flex-col bg-white dark:bg-gray-950 p-3 space-y-4 pb-4">
                {isEditView ? (
                  /* Edit View - Show Label and Categories */
                  <div className="space-y-6">
                    {/* Label Title */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Label
                      </h2>
                    </div>

                    {/* AI Labels with Percentages */}
                    {loadingLabels ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                      </div>
                    ) : aiLabels.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {aiLabels.map((labelItem, idx) => {
                            const trimmedLabel = labelItem.label.trim()
                            const confidencePercent = Math.round(labelItem.confidence * 100)
                            const imageCategories = (selectedImage.category || selectedImage.gallery?.category || "")
                              .split(",")
                              .map(c => c.trim())
                            const isAssigned = imageCategories.includes(trimmedLabel)
                            
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleCategory(trimmedLabel)}
                                className={`transition-all duration-200 hover:scale-105 ${
                                  isAssigned ? "ring-2 ring-green-500 ring-offset-2" : ""
                                }`}
                                title={isAssigned ? `Click to remove "${trimmedLabel}"` : `Click to add "${trimmedLabel}"`}
                              >
                                  <Badge
                                    className={`text-sm font-medium px-3 py-1.5 cursor-pointer shadow-sm ${
                                      categoryColors[trimmedLabel] || "bg-gray-500"
                                    } text-white hover:opacity-90 ${isAssigned ? "opacity-100" : "opacity-70"}`}
                                  >
                                    {capitalizeCategory(trimmedLabel)} {confidencePercent}%
                                    {isAssigned && <span className="ml-1">✓</span>}
                                  </Badge>
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Click on any category to add or remove it from this image
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {(() => {
                            const assigned = (selectedImage.category || selectedImage.gallery?.category || "")
                              .split(",")
                              .map(c => c.trim())
                              .filter(c => c.length > 0)
                            return assigned.length > 0 
                              ? `${assigned.length} category${assigned.length > 1 ? 'ies' : ''} assigned to this image`
                              : "No categories assigned yet"
                          })()}
                        </p>
                      </div>
                    ) : (
                      /* Fallback: Show all 20 categories if no AI labels */
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                        {allAvailableCategories.length > 0 ? (
                          allAvailableCategories.map((category, idx) => {
                            const trimmedCat = category.trim()
                            // Check if this category is assigned to the image
                            const imageCategories = (selectedImage.category || selectedImage.gallery?.category || "")
                              .split(",")
                              .map(c => c.trim())
                            const isAssigned = imageCategories.includes(trimmedCat)
                            
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleCategory(trimmedCat)}
                                className={`transition-all duration-200 hover:scale-105 ${
                                  isAssigned ? "ring-2 ring-green-500 ring-offset-2" : ""
                                }`}
                                title={isAssigned ? `Click to remove "${trimmedCat}"` : `Click to add "${trimmedCat}"`}
                              >
                                <Badge
                                  className={`text-sm font-medium px-4 py-2 cursor-pointer shadow-sm ${
                                    categoryColors[trimmedCat] || "bg-gray-500"
                                  } text-white hover:opacity-90 ${isAssigned ? "opacity-100" : "opacity-70"}`}
                                >
                                  {capitalizeCategory(trimmedCat)}
                                  {isAssigned && <span className="ml-1">✓</span>}
                                </Badge>
                              </button>
                            )
                          })
                        ) : (
                          // Fallback: show default 20 categories
                          [
                            "Nature", "Travel", "Portrait", "Sports", "Urban", 
                            "Wildlife", "Food", "Architecture", "Abstract", "Macro",
                            "Events", "Birds", "Ocean", "Animal", "Landscape",
                            "Street", "Fashion", "Wedding", "Concert", "Other"
                          ].map((category, idx) => {
                            const trimmedCat = category.trim()
                            const imageCategories = (selectedImage.category || selectedImage.gallery?.category || "")
                              .split(",")
                              .map(c => c.trim())
                            const isAssigned = imageCategories.includes(trimmedCat)
                            
                            return (
                              <button
                                key={idx}
                                onClick={() => toggleCategory(trimmedCat)}
                                className={`transition-all duration-200 hover:scale-105 ${
                                  isAssigned ? "ring-2 ring-green-500 ring-offset-2" : ""
                                }`}
                                title={isAssigned ? `Click to remove "${trimmedCat}"` : `Click to add "${trimmedCat}"`}
                              >
                                <Badge
                                  className={`text-sm font-medium px-4 py-2 cursor-pointer shadow-sm ${
                                    categoryColors[trimmedCat] || "bg-gray-500"
                                  } text-white hover:opacity-90 ${isAssigned ? "opacity-100" : "opacity-70"}`}
                                >
                                  {capitalizeCategory(trimmedCat)}
                                  {isAssigned && <span className="ml-1">✓</span>}
                                </Badge>
                              </button>
                            )
                          })
                        )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Click on any category to add or remove it from this image
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {(() => {
                              const assigned = (selectedImage.category || selectedImage.gallery?.category || "")
                                .split(",")
                                .map(c => c.trim())
                                .filter(c => c.length > 0)
                              return assigned.length > 0 
                                ? `${assigned.length} category${assigned.length > 1 ? 'ies' : ''} assigned to this image`
                                : "No categories assigned yet"
                            })()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Normal View - Show all details */
                  <>
                    {/* Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                        {selectedImage.published ? (
                          <Badge className="bg-green-600 text-white px-3 py-1">Published</Badge>
                        ) : (
                          <Badge variant="secondary" className="px-3 py-1">Draft</Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {selectedImage.caption && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <strong className="text-sm font-semibold text-gray-900 dark:text-gray-100 block mb-2">Description:</strong>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{selectedImage.caption}</p>
                      </div>
                    )}

                    {/* Categories */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between mb-3">
                        <strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">Categories:</strong>
                        {editingCategory === selectedImage.id ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(null)
                              setEditCategoryValue("")
                            }}
                            className="h-8"
                          >
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(selectedImage.id)
                              setEditCategoryValue(selectedImage.category || "")
                            }}
                            className="h-8"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                      {editingCategory === selectedImage.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editCategoryValue}
                            onChange={(e) => setEditCategoryValue(e.target.value)}
                            placeholder="Enter categories (comma-separated for multiple)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateImageCategory(selectedImage.id, editCategoryValue)
                              }
                            }}
                            className="h-10"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateImageCategory(selectedImage.id, editCategoryValue)}
                              className="h-9"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(null)
                                setEditCategoryValue("")
                              }}
                              className="h-9"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(selectedImage.category || selectedImage.gallery?.category) ? (
                            (selectedImage.category || selectedImage.gallery?.category)
                              .split(",")
                              .map((cat, idx) => {
                                const trimmedCat = cat.trim()
                                return (
                                  <Badge
                                    key={idx}
                                    className={`text-xs font-medium px-3 py-1.5 text-white shadow-sm ${
                                      categoryColors[trimmedCat] || "bg-gray-500"
                                    }`}
                                  >
                                    {capitalizeCategory(trimmedCat)}
                                  </Badge>
                                )
                              })
                          ) : (
                            <span className="text-muted-foreground text-sm">Uncategorized</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Auto-Detected Categories */}
                    {aiLabels.length > 0 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <strong className="text-sm font-semibold text-gray-900 dark:text-gray-100">Auto-Detected Categories:</strong>
                        </div>
                        {loadingLabels ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {aiLabels.map((labelItem, idx) => {
                              const trimmedLabel = labelItem.label.trim()
                              const confidencePercent = Math.round(labelItem.confidence * 100)
                              const imageCategories = (selectedImage.category || selectedImage.gallery?.category || "")
                                .split(",")
                                .map(c => c.trim())
                              const isAssigned = imageCategories.includes(trimmedLabel)
                              
                              return (
                                <button
                                  key={idx}
                                  onClick={() => toggleCategory(trimmedLabel)}
                                  className={`transition-all duration-200 hover:scale-105 ${
                                    isAssigned ? "ring-2 ring-green-500 ring-offset-2" : ""
                                  }`}
                                  title={isAssigned ? `Click to remove "${trimmedLabel}"` : `Click to add "${trimmedLabel}"`}
                                >
                                  <Badge
                                    className={`text-xs font-medium px-3 py-1.5 cursor-pointer shadow-sm ${
                                      categoryColors[trimmedLabel] || "bg-gray-500"
                                    } text-white hover:opacity-90 ${isAssigned ? "opacity-100" : "opacity-70"}`}
                                  >
                                    {capitalizeCategory(trimmedLabel)} {confidencePercent}%
                                    {isAssigned && <span className="ml-1">✓</span>}
                                  </Badge>
                                </button>
                              )
                            })}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                          Click on any category to add or remove it from this image
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* File Information */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <strong className="text-sm font-semibold text-gray-900 dark:text-gray-100 block mb-3">File Information:</strong>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground min-w-[80px]">Filename:</span>
                      <span className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all">
                        {selectedImage.alt || selectedImage.caption || selectedImage.gallery?.title || "Untitled"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground min-w-[80px]">Type:</span>
                      <span className="text-gray-900 dark:text-gray-100">image/jpeg</span>
                    </div>
                  </div>
                </div>

                {/* Photo Metadata */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <strong className="text-sm font-semibold text-gray-900 dark:text-gray-100 block mb-3">Photo Metadata:</strong>
                  <div className="space-y-2.5 text-sm">
                    {selectedImage.year && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[100px]">Date Taken:</span>
                        <span className="text-gray-900 dark:text-gray-100">Jan {selectedImage.year}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground min-w-[100px]">Uploaded:</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {new Date(selectedImage.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {selectedImage.gallery?.title && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[100px]">Gallery:</span>
                        <span className="text-gray-900 dark:text-gray-100">{selectedImage.gallery.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 pb-2 border-t border-gray-200 dark:border-gray-800 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1 h-11 font-medium"
                    onClick={() => {
                      const newEditView = !isEditView
                      setIsEditView(newEditView)
                      // Fetch AI labels when entering edit view
                      if (newEditView && selectedImage) {
                        fetchAiLabels(selectedImage.id)
                      }
                    }}
                  >
                    {isEditView ? "Back to Details" : "Edit"}
                  </Button>
                  <Button
                    variant={selectedImage.published ? "outline" : "default"}
                    className={`flex-1 h-11 font-medium ${selectedImage.published ? "" : "bg-green-600 hover:bg-green-700 text-white"}`}
                    onClick={() => togglePublish(selectedImage)}
                  >
                    {selectedImage.published ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publish
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 h-11 font-medium"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this image?')) {
                        deleteImage(selectedImage.id)
                        setSelectedImage(null)
                      }
                    }}
                    disabled={deletingIds.has(selectedImage.id)}
                  >
                    {deletingIds.has(selectedImage.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            )
          })()}
        </DialogContent>
      </Dialog>

    </div>
  )
}
