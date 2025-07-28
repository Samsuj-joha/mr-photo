"use client"

import { useState, useEffect } from "react"
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
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Star,
  MoreHorizontal,
} from "lucide-react"
import Image from "next/image"

// Sample data - replace with real data from your API
const sampleGalleries = [
  {
    id: 1,
    title: "Wedding Collection",
    description: "Beautiful wedding moments captured",
    category: "wedding",
    imageCount: 45,
    featured: true,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=200&fit=crop",
    createdAt: "2024-01-15",
    views: 1240,
  },
  {
    id: 2,
    title: "Portrait Sessions",
    description: "Professional portrait photography",
    category: "portrait",
    imageCount: 32,
    featured: false,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
    createdAt: "2024-01-10",
    views: 856,
  },
  {
    id: 3,
    title: "Nature Photography",
    description: "Stunning landscapes and nature shots",
    category: "nature",
    imageCount: 28,
    featured: true,
    published: false,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    createdAt: "2024-01-08",
    views: 423,
  },
  {
    id: 4,
    title: "Corporate Events",
    description: "Professional corporate event photography",
    category: "corporate",
    imageCount: 67,
    featured: false,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop",
    createdAt: "2024-01-05",
    views: 632,
  },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "nature", label: "Nature" },
  { value: "corporate", label: "Corporate" },
  { value: "fashion", label: "Fashion" },
  { value: "street", label: "Street" },
]

export default function AdminGallery() {
  const [galleries, setGalleries] = useState(sampleGalleries)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Filter galleries based on search and category
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gallery.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || gallery.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
            <Button className="mt-4 sm:mt-0 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Gallery
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
              <DialogDescription>
                Add a new photo gallery to showcase your work
              </DialogDescription>
            </DialogHeader>
            <CreateGalleryForm onClose={() => setIsCreateModalOpen(false)} />
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
                <p className="text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold">{galleries.reduce((acc, g) => acc + g.views, 0)}</p>
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
              <Image
                src={gallery.coverImage}
                alt={gallery.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
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
                    {gallery.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {gallery.category}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {gallery.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <span>{gallery.imageCount} photos</span>
                <span>{gallery.views} views</span>
                <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
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
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Gallery
          </Button>
        </div>
      )}
    </div>
  )
}

// Create Gallery Form Component
function CreateGalleryForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    featured: false,
    published: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement gallery creation logic
    console.log("Creating gallery:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Gallery Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter gallery title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter gallery description"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.slice(1).map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Gallery
        </Button>
      </div>
    </form>
  )
}