// src/app/gallery/page.tsx - UPDATED for 3 rows x 5 images layout
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Camera, Heart, ChevronDown, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  title: string
  imageUrl: string
  category: string
  country: string
  loves: number
  galleryId: string
  galleryTitle: string
}

interface FilterOption {
  value: string
  label: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [countries, setCountries] = useState<FilterOption[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingLove, setLoadingLove] = useState<string | null>(null)

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  // Fetch images when filters change
  useEffect(() => {
    fetchImages()
  }, [selectedCategory, selectedCountry])

  const fetchFilterOptions = async () => {
    try {
      console.log("🔄 Fetching filter options...")
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/gallery/options/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        console.log("📂 Categories response:", categoriesData)
        
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          setCategories([
            { value: "all", label: "All Categories" },
            ...categoriesData.categories
          ])
          console.log("✅ Categories loaded:", categoriesData.categories.length)
        } else {
          console.log("⚠️ No categories found in response")
        }
      } else {
        console.error("❌ Categories API failed:", categoriesResponse.status)
      }

      // Fetch countries
      const countriesResponse = await fetch('/api/gallery/options/countries')
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json()
        console.log("🌍 Countries response:", countriesData)
        
        if (countriesData.countries && countriesData.countries.length > 0) {
          setCountries([
            { value: "all", label: "All Countries" },
            ...countriesData.countries
          ])
          console.log("✅ Countries loaded:", countriesData.countries.length)
        } else {
          console.log("⚠️ No countries found in response")
        }
      } else {
        console.error("❌ Countries API failed:", countriesResponse.status)
      }
    } catch (error) {
      console.error('❌ Error fetching filter options:', error)
      toast.error('Failed to load filter options')
    }
  }

  const fetchImages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: "15", // 3 rows × 5 images
        offset: "0"
      })
      
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      
      if (selectedCountry !== "all") {
        params.append("country", selectedCountry)
      }

      const response = await fetch(`/api/gallery/images?${params}`)
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        toast.error('Failed to load images')
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      toast.error('Failed to load images')
    } finally {
      setLoading(false)
    }
  }

  // Handle love click with API call
  const handleLoveClick = async (imageId: string) => {
    if (loadingLove === imageId) return

    setLoadingLove(imageId)
    try {
      const response = await fetch(`/api/gallery/image/${imageId}/love`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        
        // Update the local state
        setImages(prev => 
          prev.map(image => 
            image.id === imageId 
              ? { ...image, loves: data.loves }
              : image
          )
        )
        
        toast.success('❤️ Loved!')
      } else {
        toast.error('Failed to add love')
      }
    } catch (error) {
      console.error('Error adding love:', error)
      toast.error('Failed to add love')
    } finally {
      setLoadingLove(null)
    }
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all")
    setSelectedCountry("all")
  }

  // Prepare images for 3 rows of 5
  const displayImages = images.slice(0, 15)
  const rows = [
    displayImages.slice(0, 5),
    displayImages.slice(5, 10),
    displayImages.slice(10, 15)
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        


        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 ">
          {/* All Images Button */}
          <Button 
            variant={selectedCategory === "all" && selectedCountry === "all" ? "default" : "outline"}
            onClick={resetFilters}
            className={`${
              selectedCategory === "all" && selectedCountry === "all" 
                ? "bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white" 
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Images
          </Button>

          {/* Country Dropdown */}
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Select Country" />

            </SelectTrigger>
            <SelectContent>
              {countries.length > 0 ? (
                countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading countries...
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Category Dropdown */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading" disabled>
                  Loading categories...
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
              Category: {categories.find(c => c.value === selectedCategory)?.label}
            </Badge>
          )}
          {selectedCountry !== "all" && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
              Country: {countries.find(c => c.value === selectedCountry)?.label}
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading gallery...</span>
          </div>
        ) : (
          <>
            {/* Gallery Grid - 3 rows of 5 small images */}
            <div className="space-y-4">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {row.map((image) => (
                    <div 
                      key={image.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                    >
                      {/* Small Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={image.imageUrl}
                          alt={image.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          unoptimized={image.imageUrl.includes('cloudinary.com')}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Category Badge */}
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs px-1 py-0.5">
                            {image.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content Section - Title Left, Icons Right */}
                      <div className="p-2">
                        <div className="flex items-center justify-between">
                          {/* Title on Left */}
                          <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
                            {image.title}
                          </h3>
                          
                          {/* Icons on Right */}
                          <div className="flex items-center gap-1.5">
                            {/* DSLR Camera Icon */}
                            <div className="flex items-center">
                              <Camera className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                            </div>
                            
                            {/* Love Icon with Count */}
                            <button
                              onClick={() => handleLoveClick(image.id)}
                              disabled={loadingLove === image.id}
                              className="flex items-center gap-0.5 hover:text-red-500 transition-colors duration-200 group disabled:opacity-50"
                            >
                              {loadingLove === image.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Heart 
                                  className="h-3 w-3 text-gray-500 dark:text-gray-400 group-hover:text-red-500 group-hover:fill-current transition-all duration-200" 
                                />
                              )}
                              <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-red-500">
                                {image.loves}
                              </span>
                            </button>
                          </div>
                        </div>
                        
                        {/* Country Info */}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">
                          {image.country}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {displayImages.length === 0 && (
              <div className="text-center py-16">
                <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No images found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your filter criteria to see more results.
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Reset Filters
                </Button>
              </div>
            )}

           
          </>
        )}
      </div>
    </div>
  )
}