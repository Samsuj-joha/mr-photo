// File: /src/app/gallery/page.tsx

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Grid3x3, 
  List,
  Eye,
  Heart,
  Camera,
  ArrowRight
} from "lucide-react"

// Sample data - Replace with API call later
const sampleGalleries = [
  {
    id: 1,
    title: "Wedding Magic",
    description: "Capturing the most important day of your life",
    category: "wedding",
    imageCount: 45,
    featured: true,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
    createdAt: "2024-01-15",
    views: 1240,
  },
  {
    id: 2,
    title: "Urban Portraits",
    description: "Professional portraits in stunning locations",
    category: "portrait",
    imageCount: 32,
    featured: false,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    createdAt: "2024-01-10",
    views: 856,
  },
  {
    id: 3,
    title: "Nature's Beauty",
    description: "Breathtaking landscapes and nature photography",
    category: "nature",
    imageCount: 28,
    featured: true,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
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
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=400&fit=crop",
    createdAt: "2024-01-05",
    views: 632,
  },
  {
    id: 5,
    title: "Fashion Shoots",
    description: "Creative fashion and modeling photography",
    category: "fashion",
    imageCount: 53,
    featured: true,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=400&fit=crop",
    createdAt: "2024-01-03",
    views: 789,
  },
  {
    id: 6,
    title: "Street Photography",
    description: "Candid moments from city life",
    category: "street",
    imageCount: 41,
    featured: false,
    published: true,
    coverImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
    createdAt: "2024-01-01",
    views: 345,
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

export default function GalleryPage() {
  const [galleries, setGalleries] = useState(sampleGalleries)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(false)

  // Filter galleries based on search and category
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gallery.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || gallery.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Fetch galleries from API (replace sample data later)
  useEffect(() => {
    const fetchGalleries = async () => {
      setIsLoading(true)
      try {
        // const response = await fetch('/api/gallery')
        // const data = await response.json()
        // setGalleries(data)
        
        // For now, use sample data
        setTimeout(() => {
          setGalleries(sampleGalleries)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching galleries:', error)
        setIsLoading(false)
      }
    }

    fetchGalleries()
  }, [])

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
            Photography Gallery
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore my collections of wedding, portrait, nature, and event photography. 
            Each gallery tells a unique story through carefully crafted images.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-12">
          
          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search galleries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
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
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredGalleries.length} of {galleries.length} galleries
            {selectedCategory !== "all" && (
              <span className="ml-2">
                in <Badge variant="secondary">{categories.find(c => c.value === selectedCategory)?.label}</Badge>
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}

        {/* Gallery Grid/List */}
        {!isLoading && (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGalleries.map((gallery) => (
                  <Card key={gallery.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={gallery.coverImage}
                        alt={gallery.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge className="bg-white/90 text-gray-900 capitalize">
                          {gallery.category}
                        </Badge>
                        {gallery.featured && (
                          <Badge className="bg-yellow-500/90 text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                        <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center space-x-1">
                          <Camera className="h-3 w-3" />
                          <span>{gallery.imageCount}</span>
                        </div>
                        <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{gallery.views}</span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 transition-colors">
                        {gallery.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {gallery.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {new Date(gallery.createdAt).toLocaleDateString()}
                        </span>
                        <Button asChild variant="ghost" size="sm" className="group">
                          <Link href={`/gallery/${gallery.id}`}>
                            View Gallery
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredGalleries.map((gallery) => (
                  <Card key={gallery.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative h-48 md:h-32 md:w-48 overflow-hidden">
                        <Image
                          src={gallery.coverImage}
                          alt={gallery.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <Badge className="bg-white/90 text-gray-900 text-xs capitalize">
                            {gallery.category}
                          </Badge>
                          {gallery.featured && (
                            <Badge className="bg-yellow-500/90 text-white text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className="flex-1 p-6">
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 transition-colors">
                              {gallery.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {gallery.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Camera className="h-4 w-4" />
                                <span>{gallery.imageCount} photos</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>{gallery.views} views</span>
                              </div>
                              <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <Button asChild variant="ghost" size="sm" className="group">
                              <Link href={`/gallery/${gallery.id}`}>
                                View Gallery
                                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredGalleries.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No galleries found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Load More Button (for pagination later) */}
        {!isLoading && filteredGalleries.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Galleries
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}