// src/app/admin/home-slider/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react"
import Image from "next/image"

interface SliderImage {
  id: string
  title?: string
  description?: string
  imageUrl: string
  publicId: string
  alt?: string
  order: number
  active: boolean
  linkUrl?: string
  linkText?: string
  createdAt: string
  updatedAt: string
}

export default function AdminHomeSlider() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    alt: "",
    linkUrl: "",
    linkText: "",
    active: true,
    selectedFile: null as File | null
  })

  useEffect(() => {
    fetchSliderImages()
  }, [])

  const fetchSliderImages = async () => {
    try {
      const response = await fetch("/api/home-slider")
      if (response.ok) {
        const data = await response.json()
        setSliderImages(data)
      }
    } catch (error) {
      console.error("Error fetching slider images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.selectedFile) {
      alert("Please select an image first")
      return
    }
    
    setIsUploading(true)
    
    try {
      // Upload to Cloudinary
      const uploadFormData = new FormData()
      uploadFormData.append("file", formData.selectedFile)
      
      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json()
        
        // Create slider entry
        const sliderData = {
          title: formData.title,
          description: formData.description,
          alt: formData.alt,
          linkUrl: formData.linkUrl,
          linkText: formData.linkText,
          active: formData.active,
          imageUrl: uploadData.url,
          publicId: uploadData.public_id,
          order: sliderImages.length
        }

        const response = await fetch("/api/home-slider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sliderData),
        })

        if (response.ok) {
          await fetchSliderImages()
          setIsCreateModalOpen(false)
          resetForm()
          alert("Slider image created successfully!")
        } else {
          alert("Failed to create slider image")
        }
      } else {
        alert("Failed to upload image")
      }
    } catch (error) {
      console.error("Error creating slider:", error)
      alert("Error creating slider image")
    } finally {
      setIsUploading(false)
    }
  }

  const updateSliderImage = async (id: string, updates: Partial<SliderImage>) => {
    try {
      const response = await fetch(`/api/home-slider/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        await fetchSliderImages()
      }
    } catch (error) {
      console.error("Error updating slider image:", error)
    }
  }

  const deleteSliderImage = async (id: string) => {
    try {
      const response = await fetch(`/api/home-slider/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchSliderImages()
        alert("Slider image deleted successfully!")
      } else {
        alert("Failed to delete slider image")
      }
    } catch (error) {
      console.error("Error deleting slider image:", error)
      alert("Error deleting slider image")
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    await updateSliderImage(id, { active })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      alt: "",
      linkUrl: "",
      linkText: "",
      active: true,
      selectedFile: null
    })
    setEditingImage(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Home Page Slider
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage the sliding images on your home page
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Slider Image</DialogTitle>
              <DialogDescription>
                Upload a new image for the home page slider
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter slide title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter slide description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="alt">Alt Text</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({...formData, alt: e.target.value})}
                  placeholder="Describe the image"
                />
              </div>
              
              <div>
                <Label htmlFor="linkUrl">Link URL (Optional)</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="linkText">Link Text (Optional)</Label>
                <Input
                  id="linkText"
                  value={formData.linkText}
                  onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                  placeholder="Learn More"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({...formData, active: checked})}
                />
                <Label>Active</Label>
              </div>
              
              {/* Image Upload Section */}
              <div>
                <Label>Select Image *</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData({...formData, selectedFile: file})
                      }
                    }}
                    disabled={isUploading}
                    className="mb-2"
                  />
                  {formData.selectedFile && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      {formData.selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
              
              {isUploading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Uploading image...
                </div>
              )}
            </div>
            
            {/* Dialog Footer with proper buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false)
                  resetForm()
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isUploading || !formData.selectedFile}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Slide
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slider Images Grid */}
      {sliderImages.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No slider images yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first slider image.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Image
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sliderImages.map((image, index) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={image.imageUrl}
                  alt={image.alt || image.title || "Slider image"}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant={image.active ? "default" : "secondary"}>
                    {image.active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg">
                  {image.title || "Untitled Slide"}
                </CardTitle>
                {image.description && (
                  <CardDescription>{image.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={image.active}
                      onCheckedChange={(checked) => toggleActive(image.id, checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {image.active ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Slider Image</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this slider image? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSliderImage(image.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}