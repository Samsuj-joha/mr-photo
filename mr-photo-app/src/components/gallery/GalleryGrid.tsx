// src/components/gallery/GalleryGrid.tsx - Google Photos/Apple Photos Style
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Heart, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

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

interface GalleryGridProps {
  images: GalleryImage[]
  loadingLove: string | null
  onLoveClick: (imageId: string) => void
  onImageClick: (index: number) => void
  imagesPerPage: number
}

// Helper function to get varied height for masonry effect (Google Photos style)
const getRandomHeight = (index: number) => {
  // More varied heights for better masonry effect
  const heights = [180, 220, 260, 300, 240, 280, 320, 200, 250, 290]
  return heights[index % heights.length]
}

// Fixed category order
const CATEGORY_ORDER = ["Birds", "Animal", "Ocean", "Nature", "Peace in Mind", "Others"] as const

// Normalize category to match fixed categories
const normalizeCategory = (category?: string) => {
  if (!category) {
    return "Others"
  }

  const normalized = category.trim().toLowerCase()
  const match = CATEGORY_ORDER.find(cat => cat.toLowerCase() === normalized)

  return match || "Others"
}

export function GalleryGrid({
  images,
  loadingLove,
  onLoveClick,
  onImageClick,
  imagesPerPage
}: GalleryGridProps) {
  // Group images by normalized category
  const imagesByCategory = useMemo(() => {
    const grouped: Record<string, GalleryImage[]> = {}
    
    images.forEach((image) => {
      const normalizedCategory = normalizeCategory(image.category)
      if (!grouped[normalizedCategory]) {
        grouped[normalizedCategory] = []
      }
      grouped[normalizedCategory].push({
        ...image,
        category: normalizedCategory
      })
    })
    
    // Only include categories that have images, respecting the fixed order
    return CATEGORY_ORDER
      .filter(cat => grouped[cat] && grouped[cat].length > 0)
      .map(category => ({
        category,
        images: grouped[category]
      }))
  }, [images])

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          No images found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Try adjusting your filter criteria to discover amazing photography.
        </p>
      </div>
    )
  }

  // Create a map of image ID to original index for click handler
  const imageIndexMap = useMemo(() => {
    const map = new Map<string, number>()
    images.forEach((image, index) => {
      map.set(image.id, index)
    })
    return map
  }, [images])

  return (
    <div className="space-y-12">
      {imagesByCategory.map(({ category, images: categoryImages }) => (
        <div key={category} className="space-y-4">
          {/* Sticky Category Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 py-4 -mx-4 px-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {category}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {categoryImages.length} {categoryImages.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          {/* Masonry Grid - Google Photos Style */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 space-y-2">
            {categoryImages.map((image) => {
              // Get the original index from the images array
              const currentIndex = imageIndexMap.get(image.id) ?? 0
              const height = getRandomHeight(currentIndex)
              
              return (
                <div
                  key={image.id}
                  className="group relative break-inside-avoid mb-2 rounded-md overflow-hidden cursor-pointer bg-gray-100 dark:bg-gray-900 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => onImageClick(currentIndex)}
                  style={{
                    height: `${height}px`
                  }}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={image.imageUrl.includes('cloudinary.com')}
                    priority={currentIndex < 8}
                  />
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Love Button - Bottom Right */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onLoveClick(image.id)
                      }}
                      disabled={loadingLove === image.id}
                      className={cn(
                        "h-9 px-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 shadow-lg border border-gray-200",
                        "disabled:opacity-50"
                      )}
                    >
                      {loadingLove === image.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Heart 
                            className={cn(
                              "h-4 w-4 mr-2 transition-all duration-200",
                              image.loves > 0 && "fill-red-500 text-red-500"
                            )} 
                          />
                          <span className="font-medium text-sm">{image.loves}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Load More Indicator */}
      {images.length >= imagesPerPage && (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Camera className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Showing {images.length} images
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
