// File: src/components/admin/portfolio/AdminPortfolio.tsx
// Main portfolio management component for admin panel

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MoreHorizontal,
  Upload,
  Image as ImageIcon,
  X
} from "lucide-react"
import Image from "next/image"

interface Portfolio {
  id: number
  title: string
  gallery: string
  coverImage: string
  description: string
  createdAt: string
  views: number
}

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Fetch portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch('/api/admin/portfolios')
        if (response.ok) {
          const data = await response.json()
          setPortfolios(data)
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  // Filter portfolios
  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || portfolio.gallery === selectedCategory
    return matchesSearch && matchesCategory
  })

  const CreatePortfolioForm = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: "",
      description: "",
      image: null as File | null,
      gallery: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const galleryOptions = [
      { value: "portraits", label: "Portraits" },
      { value: "landscape", label: "Landscape" },
      { value: "abstract", label: "Abstract" }
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
        newErrors.gallery = "Gallery filter is required"
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

      try {
        // Create FormData for file upload
        const portfolioFormData = new FormData()
        portfolioFormData.append('title', formData.title)
        portfolioFormData.append('description', formData.description)
        portfolioFormData.append('gallery', formData.gallery)
        
        if (formData.image) {
          portfolioFormData.append('image', formData.image)
        }

        const response = await fetch('/api/admin/portfolios', {
          method: 'POST',
          body: portfolioFormData,
        })

        if (response.ok) {
          const newPortfolio = await response.json()
          setPortfolios([...portfolios, newPortfolio])
          onClose()
        }
      } catch (error) {
        console.error('Error creating portfolio:', error)
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
          <Label htmlFor="image">Image Upload *</Label>
          <div className="mt-2">
            {!imagePreview ? (
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Click to upload image
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ) : (
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
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-500 mt-1">{errors.image}</p>
          )}
        </div>

        {/* Gallery Filter Field */}
        <div>
          <Label htmlFor="gallery">Gallery Filter *</Label>
          <Select 
            value={formData.gallery} 
            onValueChange={(value) => handleInputChange("gallery", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.gallery ? "border-red-500" : ""}>
              <SelectValue placeholder="Select gallery type" />
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
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

  const handleDeletePortfolio = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        const response = await fetch(`/api/admin/portfolios/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setPortfolios(portfolios.filter(p => p.id !== id))
        }
      } catch (error) {
        console.error('Error deleting portfolio:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your portfolio projects and showcase your best work
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Add a new portfolio project to showcase your work
              </DialogDescription>
            </DialogHeader>
            <CreatePortfolioForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold">{portfolios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Galleries</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold">{portfolios.reduce((acc, p) => acc + p.views, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search portfolios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Galleries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Galleries</SelectItem>
            <SelectItem value="portraits">Portraits</SelectItem>
            <SelectItem value="landscape">Landscape</SelectItem>
            <SelectItem value="abstract">Abstract</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Grid */}
      {filteredPortfolios.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPortfolios.map((portfolio) => (
            <Card key={portfolio.id} className="group hover:shadow-lg transition-all duration-200">
              <div className="relative overflow-hidden">
                <Image
                  src={portfolio.coverImage || '/placeholder-image.jpg'}
                  alt={portfolio.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  <Badge variant="outline" className="capitalize bg-white/90">
                    {portfolio.gallery}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {portfolio.title}
                    </h3>
                    <p className="text-xs text-gray-400 capitalize">
                      {portfolio.gallery}
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {portfolio.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(portfolio.createdAt).toLocaleDateString()}
                  </div>
                  <span>{portfolio.views} views</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeletePortfolio(portfolio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No portfolios found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first portfolio project."
            }
          </p>
          {!searchQuery && selectedCategory === "all" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Portfolio
            </Button>
          )}
        </div>
      )}
    </div>
  )
}