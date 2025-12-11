"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageEditModalProps {
  imageId: string
  imageUrl: string
  imageTitle?: string
  categories?: string
  isOpen: boolean
  onClose: () => void
}

// Category color mapping - 20 categories
const categoryColors: Record<string, string> = {
  Nature: "bg-green-500",
  Travel: "bg-blue-500",
  Portrait: "bg-pink-500",
  Sports: "bg-red-500",
  Urban: "bg-purple-500",
  Wildlife: "bg-yellow-500",
  Food: "bg-orange-500",
  Architecture: "bg-indigo-500",
  Abstract: "bg-gray-500",
  Macro: "bg-teal-500",
  Events: "bg-rose-500",
  Other: "bg-gray-400",
  Birds: "bg-cyan-500",
  Ocean: "bg-blue-600",
  Animal: "bg-amber-500",
  Landscape: "bg-emerald-600",
  Street: "bg-slate-600",
  Fashion: "bg-fuchsia-500",
  Wedding: "bg-pink-600",
  Concert: "bg-violet-600",
}

// Default 20 categories
const DEFAULT_CATEGORIES = [
  "Nature", "Travel", "Portrait", "Sports", "Urban", 
  "Wildlife", "Food", "Architecture", "Abstract", "Macro",
  "Events", "Birds", "Ocean", "Animal", "Landscape",
  "Street", "Fashion", "Wedding", "Concert", "Other"
]

export function ImageEditModal({
  imageId,
  imageUrl,
  imageTitle: initialImageTitle,
  categories: initialCategories,
  isOpen,
  onClose,
}: ImageEditModalProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageTitle, setImageTitle] = useState(initialImageTitle)
  const [categories, setCategories] = useState(initialCategories)
  const [allCategories, setAllCategories] = useState<string[]>(DEFAULT_CATEGORIES)

  // Fetch latest image data and categories when modal opens
  useEffect(() => {
    if (isOpen && imageId) {
      fetchImageData()
      fetchAllCategories()
    }
  }, [isOpen, imageId])

  const fetchAllCategories = async () => {
    try {
      const response = await fetch('/api/gallery/options/categories')
      if (response.ok) {
        const data = await response.json()
        const fetchedCategories = data.categories || []
        const categoryNames = fetchedCategories.map((cat: any) => cat.value || cat.label || cat)
        const combined = [...new Set([...DEFAULT_CATEGORIES, ...categoryNames])]
        setAllCategories(combined.slice(0, 20))
      } else {
        setAllCategories(DEFAULT_CATEGORIES)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setAllCategories(DEFAULT_CATEGORIES)
    }
  }

  const fetchImageData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gallery/image/${imageId}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data.category || initialCategories || "")
        setImageTitle(data.alt || data.caption || initialImageTitle || "")
      }
    } catch (error) {
      console.error("Error fetching image data:", error)
      // Fallback to initial values if fetch fails
      setCategories(initialCategories || "")
      setImageTitle(initialImageTitle || "")
    } finally {
      setLoading(false)
    }
  }

  // Parse categories from comma-separated string
  const categoryList = categories
    ? categories.split(",").map((cat) => cat.trim()).filter((cat) => cat.length > 0)
    : []

  // Toggle category - add if not present, remove if present
  const toggleCategory = async (category: string) => {
    const currentCategories = (categories || "")
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0)
    
    const trimmedCategory = category.trim()
    const isAssigned = currentCategories.includes(trimmedCategory)
    
    let newCategories: string[]
    if (isAssigned) {
      // Remove category
      newCategories = currentCategories.filter(c => c !== trimmedCategory)
    } else {
      // Add category
      newCategories = [...currentCategories, trimmedCategory]
    }

    const categoryString = newCategories.join(", ")
    
    try {
      const response = await fetch('/api/admin/images/update-category', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageId, category: categoryString })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        // Update local state immediately
        setCategories(categoryString)
        setSelectedCategory(trimmedCategory)
        
        toast.success(isAssigned ? `Removed "${trimmedCategory}" category` : `Added "${trimmedCategory}" category`)
        
        // Scroll to image and highlight
        if (imageRef.current) {
          imageRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          })
          
          imageRef.current.style.transition = "box-shadow 0.3s ease"
          imageRef.current.style.boxShadow = isAssigned 
            ? "0 0 30px rgba(239, 68, 68, 0.6)" 
            : "0 0 30px rgba(34, 197, 94, 0.6)"
          
          setTimeout(() => {
            if (imageRef.current) {
              imageRef.current.style.boxShadow = ""
            }
            setSelectedCategory(null)
          }, 2000)
        }
      } else {
        toast.error(data.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error toggling category:', error)
      toast.error('Failed to update category')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              {/* Image Display */}
              <div
                ref={imageRef}
                className="relative w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-800 transition-all duration-300"
              >
                <div className="relative aspect-auto min-h-[400px] flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt={imageTitle || "Image"}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain max-h-[60vh]"
                    unoptimized={imageUrl.includes('cloudinary.com')}
                  />
                </div>
              </div>

              {/* Label Title */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Label
                </h2>
              </div>

              {/* Categories List - Show all 20 categories */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Categories:
                </p>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category, index) => {
                    const trimmedCategory = category.trim()
                    const isSelected = selectedCategory === trimmedCategory
                    const isAssigned = categoryList.includes(trimmedCategory)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => toggleCategory(trimmedCategory)}
                        className={`transition-all duration-200 transform ${
                          isSelected ? "scale-110 ring-2 ring-blue-500" : "hover:scale-105"
                        } ${isAssigned ? "ring-2 ring-green-500 ring-offset-1" : ""}`}
                        title={isAssigned ? `Click to remove "${trimmedCategory}"` : `Click to add "${trimmedCategory}"`}
                      >
                        <Badge
                          className={`text-sm font-medium px-4 py-2 cursor-pointer shadow-sm ${
                            categoryColors[trimmedCategory] || "bg-gray-500"
                          } text-white hover:opacity-90 ${isAssigned ? "opacity-100" : "opacity-70"}`}
                        >
                          {trimmedCategory}
                          {isAssigned && <span className="ml-1">✓</span>}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Click on any category to add or remove it from this image
                  </p>
                  {categoryList.length > 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {categoryList.length} category{categoryList.length > 1 ? 'ies' : ''} assigned to this image
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      No categories assigned yet
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

