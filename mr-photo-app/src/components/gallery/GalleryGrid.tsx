


// src/components/gallery/GalleryGrid.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Heart, Loader2, Eye, MapPin } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

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

interface GalleryGridProps {
  images: GalleryImage[]
  loadingLove: string | null
  onLoveClick: (imageId: string) => void
  onImageClick: (index: number) => void
  imagesPerPage: number
}

export function GalleryGrid({
  images,
  loadingLove,
  onLoveClick,
  onImageClick,
  imagesPerPage
}: GalleryGridProps) {
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {images.map((image, index) => (
          <div 
            key={image.id}
            className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-2 transform"
            onClick={() => onImageClick(index)}
          >
            {/* Main Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized={image.imageUrl.includes('cloudinary.com')}
                priority={index < 4}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Badge - Top Right */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                <Badge 
                  variant="secondary" 
                  className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 font-medium shadow-md"
                >
                  {image.category}
                </Badge>
              </div>

              {/* View Icon - Center */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30 shadow-lg">
                  <Eye className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Content Section - Compact */}
            <div className="p-4">
              {/* Title & Location - Single Row */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                  {image.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="capitalize">{image.country}</span>
                  </div>
                  
                  {/* Love Button - Compact */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onLoveClick(image.id)
                    }}
                    disabled={loadingLove === image.id}
                    className={cn(
                      "h-7 px-2 text-xs rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200",
                      "disabled:opacity-50 group/button"
                    )}
                  >
                    {loadingLove === image.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <Heart 
                          className={cn(
                            "h-3 w-3 mr-1 transition-all duration-200",
                            "group-hover/button:text-red-500 group-hover/button:fill-red-500"
                          )} 
                        />
                        <span className="font-medium text-xs">{image.loves}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Indicator (if needed) */}
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