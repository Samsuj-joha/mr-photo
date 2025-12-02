"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { ImageModal } from "@/components/gallery/ImageModal"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export interface GalleryImage {
  id: string
  title: string
  imageUrl: string
  category: string
  country: string
  loves: number
  year?: number
  galleryId: string
  galleryTitle: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<Array<{ value: string; label: string; count: number }>>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalImageCount, setTotalImageCount] = useState(0)

  // Fetch categories with counts
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/gallery/options/categories')
      if (response.ok) {
        const data = await response.json()
        if (data.categories && data.categories.length > 0) {
          // Use count from API if available, otherwise calculate
          const categoriesWithCounts = data.categories.map((cat: { value: string; label: string; count?: number }) => ({
            ...cat,
            count: cat.count || 0
          }))
          setCategories(categoriesWithCounts)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch images
  const fetchImages = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      params.append("limit", "1000") // Get all images for the selected category

      const response = await fetch(`/api/gallery/images?${params}`)
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || data)
        // Store total count from API response
        if (data.total !== undefined) {
          if (selectedCategory === "all") {
            // For "all", use the total from API
            setTotalImageCount(data.total)
          }
          // For specific categories, the count is already shown in the badge
        } else if (selectedCategory === "all") {
          // If no total provided and showing all, use images length as fallback
          const imageArray = data.images || data || []
          setTotalImageCount(imageArray.length)
        }
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

  // Fetch total count for "All Images" when needed
  const fetchTotalCount = async () => {
    try {
      const response = await fetch('/api/gallery/images?limit=1')
      if (response.ok) {
        const data = await response.json()
        if (data.total !== undefined) {
          setTotalImageCount(data.total)
        }
      }
    } catch (error) {
      console.error('Error fetching total count:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchTotalCount() // Get total count for "All Images"
  }, [])

  useEffect(() => {
    fetchImages()
  }, [selectedCategory])

  // Note: Category counts come from the API and should not be overridden
  // The API returns accurate counts for all categories regardless of filter
  // Images are already filtered by the API, so we don't need to filter again
  const filteredImages = images

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Filter by Category Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => {
                setSelectedCategory("all")
                fetchTotalCount() // Refresh total count when switching to "all"
              }}
            >
              All Images ({totalImageCount})
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-pink-500 text-white hover:bg-pink-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No images found</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md cursor-pointer transition-all"
                onClick={() => handleImageClick(index)}
              >
                <div className="relative overflow-hidden bg-gray-100 aspect-auto">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    width={400}
                    height={300}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    unoptimized={image.imageUrl.includes('cloudinary.com')}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-sm line-clamp-2">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        images={filteredImages}
        selectedIndex={selectedImageIndex}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedImageIndex(null)
        }}
        onIndexChange={setSelectedImageIndex}
      />
    </div>
  )
}
