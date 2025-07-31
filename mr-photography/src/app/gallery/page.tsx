// src/app/gallery/page.tsx - CLEAN VERSION using existing components folder
"use client"

import { useState, useEffect } from "react"
import { GalleryFilters } from "@/components/gallery/GalleryFilters"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"
import { ImageModal } from "@/components/gallery/ImageModal"
import { PaginationControls } from "@/components/gallery/PaginationControls"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface GalleryImage {
  id: string
  title: string
  imageUrl: string
  category: string
  country: string
  loves: number
  galleryId: string
  galleryTitle: string
}

export interface FilterOption {
  value: string
  label: string
}

export default function GalleryPage() {
  // State management
  const [images, setImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [countries, setCountries] = useState<FilterOption[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loadingLove, setLoadingLove] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [imagesPerPage, setImagesPerPage] = useState(15)
  const [totalImages, setTotalImages] = useState(0)
  
  // Modal state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch data on mount and filter changes
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    fetchImages()
  }, [selectedCategory, selectedCountry, currentPage, imagesPerPage])

  const fetchFilterOptions = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('/api/gallery/options/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        if (categoriesData.categories && categoriesData.categories.length > 0) {
          setCategories([
            { value: "all", label: "All Categories" },
            ...categoriesData.categories
          ])
        }
      }

      // Fetch countries
      const countriesResponse = await fetch('/api/gallery/options/countries')
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json()
        if (countriesData.countries && countriesData.countries.length > 0) {
          setCountries([
            { value: "all", label: "All Countries" },
            ...countriesData.countries
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
      toast.error('Failed to load filter options')
    }
  }

  const fetchImages = async () => {
    setLoading(true)
    try {
      const offset = (currentPage - 1) * imagesPerPage
      const params = new URLSearchParams({
        limit: imagesPerPage.toString(),
        offset: offset.toString()
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
        setImages(data.images || data)
        setTotalImages(data.total || data.length)
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

  const handleLoveClick = async (imageId: string) => {
    if (loadingLove === imageId) return

    setLoadingLove(imageId)
    try {
      const response = await fetch(`/api/gallery/image/${imageId}/love`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
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

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsModalOpen(true)
  }

  const resetFilters = () => {
    setSelectedCategory("all")
    setSelectedCountry("all")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImagesPerPageChange = (value: number) => {
    setImagesPerPage(value)
    setCurrentPage(1)
  }

  // Calculate display data
  const totalPages = Math.ceil(totalImages / imagesPerPage)
  const displayImages = images.slice(0, imagesPerPage)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Filters Section */}
        <div className="mb-8">
          <GalleryFilters
            categories={categories}
            countries={countries}
            selectedCategory={selectedCategory}
            selectedCountry={selectedCountry}
            onCategoryChange={setSelectedCategory}
            onCountryChange={setSelectedCountry}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Pagination Controls - Top */}
        <div className="mb-8">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            imagesPerPage={imagesPerPage}
            totalImages={totalImages}
            onPageChange={handlePageChange}
            onImagesPerPageChange={handleImagesPerPageChange}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading gallery...</span>
          </div>
        ) : (
          <>
            {/* Gallery Grid with proper spacing */}
            <div className="mb-12">
              <GalleryGrid
                images={displayImages}
                loadingLove={loadingLove}
                onLoveClick={handleLoveClick}
                onImageClick={handleImageClick}
                imagesPerPage={imagesPerPage}
              />
            </div>

          </>
        )}

        {/* Image Modal */}
        <ImageModal
          images={images}
          selectedIndex={selectedImageIndex}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedImageIndex(null)
          }}
          onIndexChange={setSelectedImageIndex}
        />
      </div>
    </div>
  )
}