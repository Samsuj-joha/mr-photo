// src/components/gallery/GalleryGrid.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Camera, Heart, Loader2 } from "lucide-react"
import Image from "next/image"

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
      <div className="text-center py-16">
        <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No images found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Try adjusting your filter criteria to see more results.
        </p>
      </div>
    )
  }

  // Always show 5 images per row as default
  const imagesPerRow = 5
  
  // Split images into rows of 5
  const rows = []
  for (let i = 0; i < images.length; i += imagesPerRow) {
    rows.push(images.slice(i, i + imagesPerRow))
  }

  return (
    <div className="space-y-6">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {row.map((image, imageIndex) => {
            const absoluteIndex = rowIndex * imagesPerRow + imageIndex
            return (
              <div 
                key={image.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => onImageClick(absoluteIndex)}
              >
                {/* Image Container */}
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
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs px-2 py-1">
                      {image.category}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    {/* Title on Left */}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
                      {image.title}
                    </h3>
                    
                    {/* Icons on Right */}
                    <div className="flex items-center gap-2">
                      {/* DSLR Camera Icon */}
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      
                      {/* Love Icon with Count */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onLoveClick(image.id)
                        }}
                        disabled={loadingLove === image.id}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors duration-200 group disabled:opacity-50"
                      >
                        {loadingLove === image.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart 
                            className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 group-hover:fill-current transition-all duration-200" 
                          />
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-red-500">
                          {image.loves}
                        </span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Country Info */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                    {image.country}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}