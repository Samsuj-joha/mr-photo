// src/app/admin/gallery/review/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Eye, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  url: string
  publicId: string
  alt: string | null
  caption: string | null
  category: string | null
  year: number | null
  published: boolean
  galleryId: string
  gallery: {
    id: string
    title: string
    category: string
    country: string | null
    published: boolean
  }
  createdAt: string
}

interface Category {
  value: string
  label: string
  count: number
}

export default function ReviewImagePage() {
  const router = useRouter()
  const params = useParams()
  const imageId = params?.id as string

  const [image, setImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Form state
  const [formData, setFormData] = useState({
    alt: "",
    caption: "",
    category: "",
    year: new Date().getFullYear().toString(),
  })

  // Fetch image data
  useEffect(() => {
    if (imageId) {
      fetchImage()
      fetchCategories()
    }
  }, [imageId])

  const fetchImage = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/gallery/image/${imageId}`)
      if (response.ok) {
        const data = await response.json()
        setImage(data)
        setFormData({
          alt: data.alt || "",
          caption: data.caption || "",
          category: data.category || "",
          year: data.year?.toString() || new Date().getFullYear().toString(),
        })
      } else {
        toast.error("Failed to load image")
        router.push("/admin/gallery/manage")
      }
    } catch (error) {
      console.error("Error fetching image:", error)
      toast.error("Failed to load image")
      router.push("/admin/gallery/manage")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/gallery/options/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSave = async (publish: boolean = false) => {
    if (!image) return

    try {
      if (publish) {
        setPublishing(true)
      } else {
        setSaving(true)
      }

      const response = await fetch(`/api/gallery/image/${imageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alt: formData.alt || null,
          caption: formData.caption || null,
          category: formData.category || null,
          year: formData.year ? parseInt(formData.year) : null,
          published: publish ? true : image.published, // Only update published status if publishing
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setImage(data.image)
        
        if (publish) {
          toast.success("Image published successfully!")
          setTimeout(() => {
            router.push("/admin/gallery/manage")
          }, 1500)
        } else {
          toast.success("Changes saved successfully!")
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to save changes")
      }
    } catch (error) {
      console.error("Error saving image:", error)
      toast.error("Failed to save changes")
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!image) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">Image not found</p>
          <Button onClick={() => router.push("/admin/gallery/manage")} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/gallery/manage")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review & Edit Image
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Edit image details before publishing
            </p>
          </div>
        </div>
        <Badge variant={image.published ? "default" : "secondary"}>
          {image.published ? (
            <>
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Published
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Draft
            </>
          )}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Uploaded image</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={formData.alt || "Preview"}
                fill
                className="object-contain"
                unoptimized={image.url.includes("cloudinary.com")}
              />
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Gallery:</strong> {image.gallery.title}
              </p>
              <p>
                <strong>Uploaded:</strong>{" "}
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
              {image.gallery.country && (
                <p>
                  <strong>Country:</strong> {image.gallery.country}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Image Details</CardTitle>
            <CardDescription>
              Edit image information and categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Alt Text */}
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={formData.alt}
                onChange={(e) =>
                  setFormData({ ...formData, alt: e.target.value })
                }
                placeholder="Describe the image"
              />
            </div>

            {/* Caption */}
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
                placeholder="Image caption"
                rows={3}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Nature, Animal, Ocean (comma-separated for multiple)"
                list="category-suggestions"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label} ({cat.count})
                  </option>
                ))}
              </datalist>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                You can enter multiple categories separated by commas
              </p>
            </div>

            {/* Year */}
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                placeholder="2024"
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={saving || publishing}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={saving || publishing || image.published}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : image.published ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Already Published
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Publish Image
                  </>
                )}
              </Button>
            </div>

            {image.published && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <CheckCircle2 className="h-4 w-4 inline mr-1" />
                  This image is already published and visible on the public gallery.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

