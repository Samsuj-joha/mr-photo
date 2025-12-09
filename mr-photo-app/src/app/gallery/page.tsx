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

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch images
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("limit", "1000") // Get all images

      const response = await fetch(`/api/gallery/images?${params}`)
      if (response.ok) {
        const data = await response.json()
        setImages(data.images || data)
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

  // Note: Category counts come from the API and should not be overridden
  // The API returns accurate counts for all categories regardless of filter
  // Images are already filtered by the API, so we don't need to filter again
  const filteredImages = images

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

  // Group images by category
  const imagesByCategory = useMemo(() => {
    const categoryMap: Record<string, GalleryImage[]> = {}
    
    filteredImages.forEach(image => {
      // Handle comma-separated categories
      const categories = image.category
        ? image.category.split(',').map(c => c.trim()).filter(c => c.length > 0)
        : ['Others']
      
      categories.forEach(cat => {
        if (!categoryMap[cat]) {
          categoryMap[cat] = []
        }
        categoryMap[cat].push(image)
      })
    })
    
    // Sort categories alphabetically
    const sortedCategories: Record<string, GalleryImage[]> = {}
    Object.keys(categoryMap)
      .sort()
      .forEach(key => {
        sortedCategories[key] = categoryMap[key]
      })
    
    return sortedCategories
  }, [filteredImages])

  // Flatten all images for modal navigation
  const allImagesForModal = useMemo(() => {
    return filteredImages
  }, [filteredImages])

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
            {Object.keys(albumsByYearMonth).length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Albums</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Object.entries(albumsByYearMonth).map(([yearMonth, albumImages]) => {
                    const coverImage = albumImages[0]
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
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2 shadow-md group-hover:shadow-xl transition-shadow">
                          <Image
                            src={coverImage.imageUrl}
                            alt={yearMonth}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized={coverImage.imageUrl.includes('cloudinary.com')}
                          />
                          {albumImages.length > 1 && (
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
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

            {/* Categories with Images */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Categories</h2>
              <div className="space-y-8">
                {Object.entries(imagesByCategory).map(([category, categoryImages]) => (
                  <div key={category}>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      {category} <span className="text-gray-500 text-base font-normal">({categoryImages.length})</span>
                    </h3>
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4">
                      {categoryImages.map((image) => (
                        <div
                          key={image.id}
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
                ))}
              </div>
            </div>
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
