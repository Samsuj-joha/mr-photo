// src/app/admin/gallery/page.tsx - UPDATED with Simple Form Modal
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Loader2
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

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
    if (!confirm(`Are you sure you want to delete "${title}"? This will also delete all images in this gallery. This action cannot be undone.`)) return

    setDeletingId(id)
    
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      })

      let responseData: any = {}
      try {
        const text = await response.text()
        responseData = text ? JSON.parse(text) : {}
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        responseData = { error: 'Failed to parse server response' }
      }

      if (response.ok) {
        const deletedCount = responseData.deletedImages || 0
        const cloudinaryDeleted = responseData.deletedFromCloudinary || 0
        
        if (cloudinaryDeleted < deletedCount && responseData.cloudinaryErrors > 0) {
          toast.warning(`Gallery deleted, but ${responseData.cloudinaryErrors} image(s) failed to delete from Cloudinary`)
        } else {
          toast.success(`Gallery "${title}" deleted successfully${deletedCount > 0 ? ` (${deletedCount} image${deletedCount > 1 ? 's' : ''} removed)` : ''}`)
        }
        
        // Refresh the gallery list
        await fetchGalleries()
      } else {
        console.error('Delete failed:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        })
        
        // Log full error details for debugging
        console.error('Full error response:', JSON.stringify(responseData, null, 2))
        
        // Extract error message with fallbacks
        let errorMsg = responseData.error || responseData.message || `Failed to delete gallery (${response.status})`
        
        // Add Prisma error code if available
        if (responseData.prismaCode) {
          errorMsg += ` [Prisma Error: ${responseData.prismaCode}]`
        }
        
        // Add details in development
        if (responseData.details && process.env.NODE_ENV === 'development') {
          console.error('Error details:', responseData.details)
          if (responseData.details.message) {
            errorMsg += ` - ${responseData.details.message}`
          }
        }
        
        toast.error(errorMsg)
      }
    } catch (error) {
      console.error('Error deleting gallery:', error)
      toast.error('Failed to delete gallery: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setDeletingId(null)
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
        
        <Button 
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push('/admin/gallery/upload')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload Photos
        </Button>
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
                  unoptimized={true}
                  priority={false}
                  onError={(e) => {
                    console.error('Failed to load cover image:', gallery.coverImage)
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
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
                  disabled={deletingId === gallery.id}
                >
                  {deletingId === gallery.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
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
          <Button onClick={() => router.push('/admin/gallery/upload')} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </div>
      )}
    </div>
  )
}