// src/app/admin/gallery/[id]/page.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  Download,
  RefreshCw,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from "react-dropzone"

interface GalleryImage {
  id: string
  url: string
  publicId: string
  alt?: string
  caption?: string
  order: number
  year?: number
  category?: string
  createdAt: string
}

interface Gallery {
  id: string
  title: string
  description: string
  category: string
  featured: boolean
  published: boolean
  images: GalleryImage[]
  imageCount: number
}

interface VerificationResult {
  id: string
  title: string
  imageUrl: string
  publicId: string
  galleryId: string
  galleryTitle: string
  exists: boolean
  status: number | string
  contentType?: string
  isImage?: boolean
  accessControl?: string
  cacheControl?: string
  contentLength?: string
  createdAt: string | Date
  diagnostic?: {
    urlAccessible: boolean
    isImageType: boolean
    hasCors: boolean
    hasContent?: boolean
  }
  error?: string
}

export default function GalleryImagesPage() {
  const router = useRouter()
  const params = useParams()
  const galleryId = params?.id as string
  
  const [gallery, setGallery] = useState<Gallery | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [currentUploadFile, setCurrentUploadFile] = useState<string>("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([])
  const [showVerification, setShowVerification] = useState(false)

  // Fetch gallery details
  const fetchGallery = useCallback(async () => {
    if (!galleryId) return
    
    try {
      // Add cache busting and skip published check for admin panel
      const cacheBuster = `?t=${Date.now()}&skipPublishedCheck=true`
      const response = await fetch(`/api/gallery/${galleryId}${cacheBuster}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setGallery(data)
        console.log('Gallery fetched:', data.images.length, 'images')
      } else if (response.status === 404) {
        toast.error('Gallery not found')
        router.push('/admin/gallery')
      } else {
        toast.error('Failed to fetch gallery')
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      toast.error('Failed to fetch gallery')
    } finally {
      setLoading(false)
    }
  }, [galleryId, router])

  useEffect(() => {
    if (galleryId) {
      fetchGallery()
    }
  }, [galleryId, fetchGallery])

  // Dropzone configuration for any size images
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`)
        return false
      }
      return true
    })

    setSelectedFiles(prev => [...prev, ...validFiles])
    
    validFiles.forEach(file => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast.success(`${file.name} selected (${sizeMB} MB)`)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg']
    },
    multiple: true
  })

  // Upload images to gallery
  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select images to upload")
      return
    }

    setUploading(true)
    setIsUploadModalOpen(false)
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        setCurrentUploadFile(file.name)
        setUploadProgress(((i + 1) / selectedFiles.length) * 100)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('galleryId', galleryId)
        formData.append('alt', file.name.split('.')[0])

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Failed to upload ${file.name}`)
        }

        const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
        toast.success(`${file.name} uploaded successfully (${sizeMB} MB)`)
      }
      
      setSelectedFiles([])
      setUploadProgress(0)
      setCurrentUploadFile("")
      
      // Force refresh gallery data with cache busting
      // Wait a moment for database to update, then refresh
      await new Promise(resolve => setTimeout(resolve, 1500))
      await fetchGallery() // Refresh gallery data
      
      toast.success(`All ${selectedFiles.length} images uploaded successfully!`)
      
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  // Delete image
  const deleteImage = async (imageId: string, imageName: string) => {
    if (!confirm(`Are you sure you want to delete "${imageName}"?`)) return

    try {
      console.log(`🗑️ Attempting to delete image: ${imageId}`)
      const response = await fetch(`/api/gallery/image/${imageId}`, {
        method: 'DELETE',
      })

      const responseData = await response.json().catch(() => ({ error: 'Failed to parse response' }))

      if (response.ok) {
        console.log('✅ Delete successful:', responseData)
        toast.success('Image deleted successfully')
        await fetchGallery()
      } else {
        console.error('❌ Delete failed:', response.status, responseData)
        toast.error(responseData.error || `Failed to delete image (${response.status})`)
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  // Verify images in this gallery against Cloudinary
  const verifyImages = async () => {
    if (!galleryId) return
    setIsVerifying(true)
    setShowVerification(true)
    try {
      const response = await fetch(`/api/admin/gallery/verify?galleryId=${galleryId}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        setVerificationResults(data.results || [])

        const missing = (data.results || []).filter((r: VerificationResult) => !r.exists)
        if (missing.length > 0) {
          alert(`⚠️ Found ${missing.length} missing image${missing.length !== 1 ? 's' : ''} (404 errors) in this gallery.\n\nThese images don't exist in Cloudinary at the stored URLs.\n\nYou can delete them below or use Auto-Cleanup.`)
        } else {
          alert(`✅ All ${data.results?.length || 0} images in this gallery are valid!`)
        }
      } else {
        console.error("Failed to verify gallery images")
        alert("Failed to verify images. Please try again.")
      }
    } catch (error) {
      console.error("Error verifying gallery images:", error)
      alert("Error verifying images. Please check the console.")
    } finally {
      setIsVerifying(false)
    }
  }

  // Auto-clean missing images in this gallery
  const autoCleanupMissing = async () => {
    if (!galleryId) return
    if (!confirm("This will automatically check all images in this gallery and delete any that return 404 (not found). Continue?")) {
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch("/api/admin/gallery/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ galleryId })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.deleted > 0) {
          alert(`✅ Auto-cleanup completed: Deleted ${data.deleted} missing image${data.deleted !== 1 ? 's' : ''} from this gallery`)
          await fetchGallery()
          setVerificationResults([])
          setShowVerification(false)
        } else {
          alert("✅ All images in this gallery are valid. No cleanup needed.")
        }
      } else {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Failed to cleanup: ${error.error}`)
      }
    } catch (error) {
      console.error("Error auto-cleaning gallery images:", error)
      alert("Failed to auto-clean missing images")
    } finally {
      setIsVerifying(false)
    }
  }

  // Delete one broken image from verification list
  const deleteBrokenImage = async (id: string) => {
    await deleteImage(id, "image")
    await fetchGallery()
    setVerificationResults(prev => prev.filter(r => r.id !== id))
  }

  // Bulk delete all missing images from this gallery (requires verification first)
  const deleteAllMissing = async () => {
    const missingIds = verificationResults.filter(r => !r.exists).map(r => r.id)

    if (missingIds.length === 0) {
      alert("No missing images to delete")
      return
    }

    if (!confirm(`Are you sure you want to delete ${missingIds.length} missing image${missingIds.length !== 1 ? 's' : ''} from this gallery?`)) {
      return
    }

    try {
      const response = await fetch("/api/admin/gallery/verify", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: missingIds })
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Successfully deleted ${data.deleted} missing image${data.deleted !== 1 ? 's' : ''}`)
        await fetchGallery()
        setVerificationResults(prev => prev.filter(r => r.exists))
      } else {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        alert(`Failed to delete: ${error.error}`)
      }
    } catch (error) {
      console.error("Error bulk deleting gallery images:", error)
      alert("Failed to delete missing images")
    }
  }

  // Remove selected file before upload
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!gallery) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Gallery not found
        </h3>
        <Button onClick={() => router.push('/admin/gallery')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Galleries
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin/gallery')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {gallery.title}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={gallery.published ? "default" : "secondary"}>
                {gallery.published ? "Published" : "Draft"}
              </Badge>
              {gallery.featured && (
                <Badge className="bg-yellow-500 text-white">Featured</Badge>
              )}
              <span className="text-sm text-gray-500 capitalize">
                {gallery.category}
              </span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
              ℹ️ Images are auto-categorized by year when uploaded
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {gallery.images.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={verifyImages}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Verify Images
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={autoCleanupMissing}
                disabled={isVerifying}
                className="text-orange-600 hover:text-orange-700 border-orange-300 hover:border-orange-400"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cleaning...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Auto-Cleanup 404s
                  </>
                )}
              </Button>
            </>
          )}
          <Button 
            variant="outline"
            onClick={() => fetchGallery()}
            title="Refresh gallery"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open(`/gallery/${gallery.id}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Images
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Images to {gallery.title}</DialogTitle>
              </DialogHeader>
              <UploadImagesForm
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                selectedFiles={selectedFiles}
                removeSelectedFile={removeSelectedFile}
                formatFileSize={formatFileSize}
                uploadImages={uploadImages}
                onClose={() => setIsUploadModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Gallery Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Images</p>
                <p className="text-2xl font-bold">{gallery.imageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-lg font-semibold">{gallery.published ? "Live" : "Draft"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-yellow-500 rounded" />
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-lg font-semibold capitalize">{gallery.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-purple-500 rounded" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm font-semibold">{new Date(gallery.images[0]?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">
                  Uploading {currentUploadFile}...
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">
                {uploadProgress.toFixed(0)}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Results */}
      {showVerification && verificationResults.length > 0 && (
        <Card className="border-amber-200 dark:border-amber-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                Gallery Image Verification
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVerification(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {verificationResults.map((result) => (
                <div
                  key={result.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.exists
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.exists ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {result.title || "Untitled"}{" "}
                        <span className="text-xs text-gray-500">
                          ({result.galleryTitle})
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-md">
                        {result.imageUrl}
                      </p>
                      {result.diagnostic && (
                        <div className="text-xs mt-1 space-y-0.5">
                          <p className={result.diagnostic.urlAccessible ? "text-green-600" : "text-red-600"}>
                            Accessible: {result.diagnostic.urlAccessible ? "Yes" : "No"}
                          </p>
                          <p className={result.diagnostic.isImageType ? "text-green-600" : "text-red-600"}>
                            Image Type: {result.diagnostic.isImageType ? "Yes" : "No"}
                          </p>
                          {result.contentType && (
                            <p className="text-gray-400">Content-Type: {result.contentType}</p>
                          )}
                          {result.diagnostic.hasCors ? (
                            <p className="text-green-600">CORS: Enabled</p>
                          ) : (
                            <p className="text-amber-600">CORS: Not detected (may cause browser issues)</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {!result.exists && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(result.imageUrl)
                          alert(`URL copied to clipboard:\n${result.imageUrl}`)
                        }}
                      >
                        Copy URL
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteBrokenImage(result.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm">
                  <strong>Summary:</strong>{" "}
                  {verificationResults.filter(r => r.exists).length} valid,{" "}
                  {verificationResults.filter(r => !r.exists).length} missing
                </p>
              </div>
              {verificationResults.filter(r => !r.exists).length > 0 && (
                <Button
                  variant="destructive"
                  onClick={deleteAllMissing}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All {verificationResults.filter(r => !r.exists).length} Missing Images
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images Grid with Scroll */}
      {gallery.images.length > 0 ? (
        <div className="overflow-y-auto max-h-[calc(100vh-400px)] pr-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
          {gallery.images.map((image) => (
            <Card key={image.id} className="group overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.alt || "Gallery image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  unoptimized={true}
                  priority={false}
                  onError={(e) => {
                    console.error('Failed to load image:', image.url)
                    const target = e.currentTarget as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                {/* Error placeholder - shown when image fails to load */}
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center opacity-0 peer-invalid:opacity-100">
                  <div className="text-center text-gray-500 p-4">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">Image failed to load</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
                {/* Year Badge - Always visible */}
                {image.year && (
                  <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    📅 {image.year}
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteImage(image.id, image.alt || 'image')
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
              {image.caption && (
                <CardContent className="p-2 space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {image.caption}
                  </p>
                  {image.category && (
                    <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                      <span className="uppercase tracking-wide">
                        Category: <span className="font-semibold">{image.category}</span>
                      </span>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
          </div>
          {/* Add Image Button at Bottom */}
          <div className="sticky bottom-4 mt-4 flex justify-center">
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              size="lg"
              className="shadow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add More Images
            </Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No images yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start building your gallery by uploading some images
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload First Images
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Upload Images Form Component
function UploadImagesForm({
  getRootProps,
  getInputProps,
  isDragActive,
  selectedFiles,
  removeSelectedFile,
  formatFileSize,
  uploadImages,
  onClose
}: {
  getRootProps: () => DropzoneRootProps
  getInputProps: () => DropzoneInputProps
  isDragActive: boolean
  selectedFiles: File[]
  removeSelectedFile: (index: number) => void
  formatFileSize: (bytes: number) => string
  uploadImages: () => void
  onClose: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {isDragActive
              ? "Drop the images here..."
              : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-sm text-gray-500">
            ✅ Any size images accepted • Supports: JPG, PNG, GIF, WebP, and more
          </p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Selected Files ({selectedFiles.length})</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSelectedFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={uploadImages}
          disabled={selectedFiles.length === 0}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
        </Button>
      </div>
    </div>
  )
}