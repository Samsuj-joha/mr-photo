"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
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
  createdAt?: string
  galleryId: string
  galleryTitle: string
}

// Helper function to capitalize first letter of category names
const capitalizeCategory = (category: string): string => {
  if (!category) return category
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

// Helper function to normalize category names (merge duplicates like "portraits" -> "portrait")
const normalizeCategory = (category: string): string => {
  if (!category) return category
  const normalized = category.trim().toLowerCase()
  
  // Normalize plural forms to singular
  const normalizations: Record<string, string> = {
    'portraits': 'portrait',
    'animals': 'animal',
    'birds': 'bird',
    'events': 'event',
    'sports': 'sport',
  }
  
  return normalizations[normalized] || normalized
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Fetch images with pagination - load more as needed
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("limit", "200") // Load 200 images initially (enough for most use cases)
      params.append("offset", "0")

      const response = await fetch(`/api/gallery/images?${params}`, {
        // Use cache: 'no-store' to ensure we get the latest published images
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        const imagesList = data.images || data
        setImages(imagesList)
        
        // Debug: Log what images we received
        if (process.env.NODE_ENV === 'development') {
          console.log(`📸 Fetched ${imagesList.length} images from API`)
          const years = new Set(imagesList.map((img: GalleryImage) => {
            const date = img.createdAt ? new Date(img.createdAt) : (img.year ? new Date(img.year, 0, 1) : new Date())
            return date.getFullYear()
          }))
          const sortedYears = Array.from(years).map(y => Number(y)).sort((a, b) => b - a)
          console.log(`📅 Years found in images:`, sortedYears)
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
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // Filter images by selected category
  const filteredImages = useMemo(() => {
    if (!selectedCategory) return images
    
    return images.filter(image => {
      if (!image.category) return false
      // Handle comma-separated categories
      const categories = image.category.split(',').map(c => c.trim().toLowerCase())
      const normalizedSelected = normalizeCategory(selectedCategory.toLowerCase())
      return categories.some(cat => normalizeCategory(cat) === normalizedSelected)
    })
  }, [images, selectedCategory])

  // Group images by year/month for albums (iPhone-style)
  const albumsByYearMonth = useMemo(() => {
    const albums: Record<string, { images: GalleryImage[]; date: Date }> = {}
    
    filteredImages.forEach(image => {
      const date = image.createdAt ? new Date(image.createdAt) : (image.year ? new Date(image.year, 0, 1) : new Date())
      const year = date.getFullYear()
      const month = date.toLocaleString('default', { month: 'long' })
      const key = `${month} ${year}`
      
      if (!albums[key]) {
        albums[key] = { images: [], date }
      }
      albums[key].images.push(image)
    })
    
    // Sort albums by date (newest first) and convert back to simple record
    const sortedAlbums: Record<string, GalleryImage[]> = {}
    Object.entries(albums)
      .sort((a, b) => b[1].date.getTime() - a[1].date.getTime())
      .forEach(([key, value]) => {
        sortedAlbums[key] = value.images
      })
    
    return sortedAlbums
  }, [filteredImages])

  // Group images by category (using all images, not filtered)
  // Only show categories that have at least one image
  const imagesByCategory = useMemo(() => {
    const categoryMap: Record<string, GalleryImage[]> = {}
    
    // Add images to their categories
    images.forEach(image => {
      // Handle comma-separated categories and deduplicate
      const categories = image.category
        ? Array.from(new Set(image.category.split(',').map(c => c.trim()).filter(c => c.length > 0)))
        : ['Others']
      
      categories.forEach(cat => {
        // Normalize category name (e.g., "portraits" -> "portrait")
        const normalizedCat = normalizeCategory(cat)
        // Use the original capitalized form for display, but group by normalized name
        const displayCat = capitalizeCategory(normalizedCat)
        
        if (!categoryMap[displayCat]) {
          categoryMap[displayCat] = []
        }
        // Only add image if it's not already in this category
        if (!categoryMap[displayCat].some(img => img.id === image.id)) {
          categoryMap[displayCat].push(image)
        }
      })
    })
    
    // Filter out categories with no images and sort alphabetically
    const sortedCategories: Record<string, GalleryImage[]> = {}
    Object.keys(categoryMap)
      .filter(key => categoryMap[key].length > 0) // Only include categories with images
      .sort()
      .forEach(key => {
        sortedCategories[key] = categoryMap[key]
      })
    
    return sortedCategories
  }, [images])

  // Flatten all images for modal navigation (use filtered images when category is selected)
  const allImagesForModal = useMemo(() => {
    return filteredImages
  }, [filteredImages])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category)
    // Scroll to top when category is selected
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleImageClick = (imageId: string) => {
    const index = allImagesForModal.findIndex(img => img.id === imageId)
    if (index !== -1) {
      setSelectedImageIndex(index)
      setIsModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-8">
        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No images found</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Albums by Year/Month (iPhone-style) */}
            {!selectedCategory && Object.keys(albumsByYearMonth).length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Object.entries(albumsByYearMonth).map(([yearMonth, albumImages]) => {
                    // Show 2-3 images on hover
                    const hoverImagesToShow = albumImages.slice(1, Math.min(4, albumImages.length))
                    return (
                      <div
                        key={yearMonth}
                        className="group cursor-pointer"
                        onClick={() => {
                          // Scroll to this album's images or show in modal
                          const firstImageId = albumImages[0].id
                          handleImageClick(firstImageId)
                        }}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2 shadow-md group-hover:shadow-xl transition-shadow">
                          {/* Main cover image - always visible */}
                          <div className="absolute inset-0 z-10 transition-transform duration-300 group-hover:scale-95 group-hover:translate-x-2">
                            <Image
                              src={albumImages[0].imageUrl}
                              alt={yearMonth}
                              fill
                              className="object-cover rounded-lg"
                              unoptimized={albumImages[0].imageUrl.includes('cloudinary.com')}
                            />
                          </div>
                          
                          {/* Overlapping images - visible on hover */}
                          {albumImages.length > 1 && hoverImagesToShow.map((image, idx) => {
                            const offset = (idx + 1) * 8 // 8px offset for each image
                            const rotation = idx % 2 === 0 ? -3 : 3 // Alternate rotation
                            const zIndex = hoverImagesToShow.length - idx
                            return (
                              <div
                                key={image.id}
                                className="absolute inset-0 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300"
                                style={{
                                  transform: `translate(${-offset}px, ${offset}px) rotate(${rotation}deg) scale(0.9)`,
                                  zIndex: zIndex,
                                  transitionDelay: `${idx * 50}ms`,
                                }}
                              >
                                <Image
                                  src={image.imageUrl}
                                  alt={`${yearMonth} - ${idx + 2}`}
                                  fill
                                  className="object-cover rounded-lg"
                                  unoptimized={image.imageUrl.includes('cloudinary.com')}
                                />
                              </div>
                            )
                          })}
                          
                          {albumImages.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium shadow-lg z-10">
                              {albumImages.length}
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-sm">{yearMonth}</p>
                          <p className="text-xs text-gray-500">{albumImages.length} {albumImages.length === 1 ? 'photo' : 'photos'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Categories as Albums */}
            {!selectedCategory && Object.keys(imagesByCategory).length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Object.entries(imagesByCategory).map(([category, categoryImages]) => {
                    // Show 2-3 images on hover
                    const hoverImagesToShow = categoryImages.slice(1, Math.min(4, categoryImages.length))
                    return (
                      <div
                        key={category}
                        className="group cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2 shadow-md group-hover:shadow-xl transition-shadow">
                          {/* Main cover image - always visible */}
                          <div className="absolute inset-0 z-10 transition-transform duration-300 group-hover:scale-95 group-hover:translate-x-2">
                            <Image
                              src={categoryImages[0].imageUrl}
                              alt={category}
                              fill
                              className="object-cover rounded-lg"
                              unoptimized={categoryImages[0].imageUrl.includes('cloudinary.com')}
                            />
                          </div>
                          
                          {/* Overlapping images - visible on hover */}
                          {categoryImages.length > 1 && hoverImagesToShow.map((image, idx) => {
                            const offset = (idx + 1) * 8 // 8px offset for each image
                            const rotation = idx % 2 === 0 ? -3 : 3 // Alternate rotation
                            const zIndex = hoverImagesToShow.length - idx
                            return (
                              <div
                                key={image.id}
                                className="absolute inset-0 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300"
                                style={{
                                  transform: `translate(${-offset}px, ${offset}px) rotate(${rotation}deg) scale(0.9)`,
                                  zIndex: zIndex,
                                  transitionDelay: `${idx * 50}ms`,
                                }}
                              >
                                <Image
                                  src={image.imageUrl}
                                  alt={`${category} - ${idx + 2}`}
                                  fill
                                  className="object-cover rounded-lg"
                                  unoptimized={image.imageUrl.includes('cloudinary.com')}
                                />
                              </div>
                            )
                          })}
                          
                          {categoryImages.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium shadow-lg z-10">
                              {categoryImages.length}
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-sm">
                            {category} <span className="text-gray-500 font-normal">({categoryImages.length})</span>
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected Category Images */}
            {selectedCategory && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-2"
                    >
                      ← Back to Categories
                    </button>
                    <h2 className="text-3xl font-bold">
                      {selectedCategory} <span className="text-gray-500 text-xl font-normal">({filteredImages.length})</span>
                    </h2>
                  </div>
                </div>
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                  {filteredImages.map((image, index) => (
                    <div
                      key={`${selectedCategory}-${image.id}-${index}`}
                      className="group break-inside-avoid rounded-lg overflow-hidden cursor-pointer transition-all mb-4"
                      onClick={() => handleImageClick(image.id)}
                    >
                      <div className="relative overflow-hidden bg-gray-100 aspect-auto">
                        <Image
                          src={image.imageUrl}
                          alt={image.title}
                          width={400}
                          height={300}
                          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized={image.imageUrl.includes('cloudinary.com')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        images={allImagesForModal}
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
