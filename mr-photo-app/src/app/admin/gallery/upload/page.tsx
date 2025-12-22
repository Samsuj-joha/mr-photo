// src/app/admin/gallery/upload/page.tsx - Redesigned to match MagicGallery style
"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  X, 
  Camera,
  Loader2,
  Edit
} from "lucide-react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { ImageEditModal } from "@/components/admin/gallery/ImageEditModal"

interface UploadingImage {
  id: string
  file: File
  preview: string
  fileName: string
  fileSize: string
  status: 'analyzing' | 'uploading' | 'completed' | 'error'
  error?: string
  imageId?: string // Database image ID after upload
  imageUrl?: string // Uploaded image URL
  category?: string // Detected/saved category
}

export default function AdminImageUpload() {
  const router = useRouter()
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  const [editingImageData, setEditingImageData] = useState<{
    imageId: string
    imageUrl: string
    imageTitle?: string
    categories?: string
  } | null>(null)
  
  // Date selection state for album creation
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [publishImmediately, setPublishImmediately] = useState<boolean>(false)

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Upload single image - moved outside to access current state
  const uploadImage = useCallback(async (image: UploadingImage) => {
    try {
      // Update status to uploading
      setUploadingImages(prev =>
        prev.map(img =>
          img.id === image.id ? { ...img, status: 'uploading' } : img
        )
      )

      // Get default gallery
      let defaultGalleryId: string | null = null
      try {
        const galleryRes = await fetch("/api/admin/gallery/default", {
          cache: "no-store",
        })
        if (galleryRes.ok) {
          const galleryData = await galleryRes.json()
          defaultGalleryId = galleryData.id
        }
      } catch (error) {
        console.error("Error fetching default gallery:", error)
      }

      // Prepare form data - USE CURRENT STATE VALUES
      const formData = new FormData()
      formData.append('file', image.file)
      formData.append('year', selectedYear.toString())
      formData.append('month', selectedMonth.toString())
      
      // Debug: Log what we're sending
      console.log(`📤 Uploading image with date: Year=${selectedYear}, Month=${selectedMonth}`)
      const selectedDate = new Date(Date.UTC(selectedYear, selectedMonth - 1, 1, 12, 0, 0))
      console.log(`📤 Constructed date: ${selectedDate.toISOString()}`)
      
      // Create a date string in ISO format for the selected year/month (first day of the month, UTC)
      // Use UTC to avoid timezone issues
      formData.append('date', selectedDate.toISOString())
      formData.append('published', publishImmediately ? 'true' : 'false')
      formData.append('alt', image.fileName.split('.')[0].replace(/[_-]/g, ' '))
      formData.append('title', image.fileName.split('.')[0].replace(/[_-]/g, ' '))
      if (defaultGalleryId) {
        formData.append('galleryId', defaultGalleryId)
      }

      // Upload to server
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        // Mark as completed and store image data
        setUploadingImages(prev =>
          prev.map(img =>
            img.id === image.id 
              ? { 
                  ...img, 
                  status: 'completed',
                  imageId: uploadData.id,
                  imageUrl: uploadData.url,
                  category: uploadData.category
                } 
              : img
          )
        )
        toast.success(`${image.fileName} uploaded successfully`)
      } else {
        const errorData = await uploadResponse.json().catch(() => ({}))
        const errorMessage = errorData.error || errorData.message || 'Upload failed'
        
        setUploadingImages(prev =>
          prev.map(img =>
            img.id === image.id 
              ? { ...img, status: 'error', error: errorMessage } 
              : img
          )
        )
        toast.error(`Failed to upload ${image.fileName}: ${errorMessage}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setUploadingImages(prev =>
        prev.map(img =>
          img.id === image.id 
            ? { ...img, status: 'error', error: errorMessage } 
            : img
        )
      )
      toast.error(`Failed to upload ${image.fileName}: ${errorMessage}`)
    } finally {
      // Check if all images are done
      setUploadingImages(prev => {
        const allDone = prev.every(img => 
          img.status === 'completed' || img.status === 'error'
        )
        if (allDone && prev.length > 0) {
          setIsUploading(false)
          // Auto-redirect after 2 seconds if all successful
          const allSuccess = prev.every(img => img.status === 'completed')
          if (allSuccess) {
            setTimeout(() => {
              router.push('/admin/gallery/manage')
            }, 2000)
          }
        }
        return prev
      })
    }
  }, [selectedYear, selectedMonth, publishImmediately, router])

  // Dropzone configuration
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Create uploading images
    const newImages: UploadingImage[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      status: 'analyzing' as const
    }))

    setUploadingImages(prev => [...prev, ...newImages])
    setIsUploading(true)

    // Start uploading each image
    for (const image of newImages) {
      await uploadImage(image)
    }
  }, [uploadImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    disabled: isUploading
  })

  // Remove image from queue
  const removeImage = (id: string) => {
    setUploadingImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      const updated = prev.filter(img => img.id !== id)
      if (updated.length === 0) {
        setIsUploading(false)
      }
      return updated
    })
  }

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadingImages.forEach(image => {
        URL.revokeObjectURL(image.preview)
      })
    }
  }, [])

  const activeUploads = uploadingImages.filter(img => 
    img.status === 'analyzing' || img.status === 'uploading'
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Upload className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload
        </h1>
      </div>

      {/* Date Selector for Album Creation - Prominent Section */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Album Date (Year & Month):
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (Select when photos were taken)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedMonth}
              onChange={(e) => {
                const newMonth = parseInt(e.target.value)
                console.log(`📅 Month changed: ${selectedMonth} -> ${newMonth}`)
                setSelectedMonth(newMonth)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[140px]"
              disabled={isUploading}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const date = new Date(2000, month - 1, 1)
                return (
                  <option key={month} value={month}>
                    {date.toLocaleString('default', { month: 'long' })}
                  </option>
                )
              })}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => {
                const newYear = parseInt(e.target.value)
                console.log(`📅 Year changed: ${selectedYear} -> ${newYear}`)
                setSelectedYear(newYear)
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 min-w-[100px]"
              disabled={isUploading}
            >
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            id="publishImmediately"
            checked={publishImmediately}
            onChange={(e) => setPublishImmediately(e.target.checked)}
            disabled={isUploading}
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label htmlFor="publishImmediately" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Publish images immediately (appear on gallery site)
          </label>
        </div>
        {!publishImmediately && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
            ℹ️ Images will be saved as drafts. Go to "Manage Images" to publish them and make them visible on the gallery.
          </p>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20"
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Camera className="h-10 w-10 text-gray-400 dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
              Drag & drop or click to select photos
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports JPG, PNG, WebP • Select multiple files at once
            </p>
          </div>
        </div>
      </div>

      {/* Uploading Section */}
      {uploadingImages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Uploading {activeUploads.length} {activeUploads.length === 1 ? 'file' : 'files'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadingImages.map((image) => (
              <div
                key={image.id}
                className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {/* Image Preview */}
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                  <Image
                    src={image.preview}
                    alt={image.fileName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  
                  {/* Analyzing Overlay */}
                  {(image.status === 'analyzing' || image.status === 'uploading') && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 rounded-full border-4 border-pink-500/30"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-pink-500 animate-spin"></div>
                        </div>
                        <p className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                          Analyzing...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Success Overlay */}
                  {image.status === 'completed' && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <div className="bg-green-500 rounded-full p-2">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Error Overlay */}
                  {image.status === 'error' && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                      <div className="bg-red-500 rounded-full p-2">
                        <X className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                    }}
                    className="absolute top-2 right-2 h-8 w-8 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-colors z-10"
                    disabled={image.status === 'uploading'}
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>

                {/* File Info */}
                <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                      {image.fileName}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {image.fileSize}
                  </p>
                  {image.status === 'error' && image.error && (
                    <p className="text-xs text-red-500 truncate mt-1">
                      {image.error}
                    </p>
                  )}
                  {image.status === 'completed' && image.imageId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() => {
                        if (image.imageId && image.imageUrl) {
                          setEditingImageData({
                            imageId: image.imageId,
                            imageUrl: image.imageUrl,
                            imageTitle: image.fileName,
                            categories: image.category
                          })
                          setEditingImageId(image.imageId)
                        }
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - Only show when no images */}
      {uploadingImages.length === 0 && !isUploading && (
        <div className="text-center py-12">
          <Camera className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No files selected. Drag and drop or click to upload photos.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {editingImageData && (
        <ImageEditModal
          imageId={editingImageData.imageId}
          imageUrl={editingImageData.imageUrl}
          imageTitle={editingImageData.imageTitle}
          categories={editingImageData.categories}
          isOpen={editingImageId === editingImageData.imageId}
          onClose={() => {
            setEditingImageId(null)
            setEditingImageData(null)
          }}
        />
      )}
    </div>
  )
}
