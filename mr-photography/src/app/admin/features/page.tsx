// src/app/admin/features/page.tsx - COMPLETE DEBUG VERSION
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Upload,
  Image as ImageIcon,
  Star,
  Settings,
  MoreHorizontal,
  GripVertical,
  Save,
  X,
  Loader2,
} from "lucide-react"
import Image from "next/image"

interface Feature {
  id: string
  title: string
  description: string
  image?: string | null
  publicId?: string | null
  icon?: string | null
  published: boolean
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function AdminFeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    publicId: "",
    icon: "",
    published: true,
    featured: false,
    order: 0,
  })

  // 🔍 STEP 1: Fetch features from database
  const fetchFeatures = async () => {
    try {
      setIsPageLoading(true)
      console.log('🔄 STEP 1: Fetching features from admin API...')
      
      const response = await fetch('/api/admin/features')
      console.log('📡 STEP 1: Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📦 STEP 1: Raw API response:', data)
        console.log('📊 STEP 1: Type of data:', typeof data, Array.isArray(data))
        
        if (data.error) {
          console.error('❌ STEP 1: API returned error:', data.error)
          setFeatures([])
          return
        }
        
        if (!Array.isArray(data)) {
          console.error('❌ STEP 1: Data is not array:', typeof data)
          setFeatures([])
          return
        }
        
        console.log('✅ STEP 1: Successfully fetched', data.length, 'features')
        
        // 🔍 DETAILED ANALYSIS OF EACH FEATURE
        data.forEach((feature, index) => {
          console.log(`\n🔍 FEATURE ${index + 1} ANALYSIS:`)
          console.log('  - ID:', feature.id)
          console.log('  - Title:', feature.title)
          console.log('  - Image field exists:', 'image' in feature)
          console.log('  - Image value:', feature.image)
          console.log('  - Image type:', typeof feature.image)
          console.log('  - Image is truthy:', !!feature.image)
          console.log('  - Image length:', feature.image?.length || 'N/A')
          console.log('  - PublicId:', feature.publicId)
          console.log('  - Published:', feature.published)
          console.log('  - Full feature object:', feature)
        })
        
        setFeatures(data)
      } else {
        const errorText = await response.text()
        console.error('❌ STEP 1: HTTP error:', response.status, errorText)
        setFeatures([])
      }
    } catch (error) {
      console.error('💥 STEP 1: Fetch error:', error)
      setFeatures([])
    } finally {
      setIsPageLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatures()
  }, [])

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateFeature = () => {
    console.log('🔄 STEP 2: Creating new feature form...')
    setEditingFeature(null)
    setFormData({
      title: "",
      description: "",
      image: "",
      publicId: "",
      icon: "",
      published: true,
      featured: false,
      order: features.length + 1,
    })
    setIsDialogOpen(true)
  }

  const handleEditFeature = (feature: Feature) => {
    console.log('🔄 STEP 2: Editing feature:', feature.title)
    console.log('🔍 STEP 2: Feature image data:', {
      hasImage: !!feature.image,
      imageUrl: feature.image,
      publicId: feature.publicId
    })
    setEditingFeature(feature)
    setFormData({
      title: feature.title,
      description: feature.description,
      image: feature.image || "",
      publicId: feature.publicId || "",
      icon: feature.icon || "",
      published: feature.published,
      featured: feature.featured,
      order: feature.order,
    })
    setIsDialogOpen(true)
  }

  // 🔍 STEP 3: Image upload process
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('🔄 STEP 3: Starting image upload...')
    console.log('📁 STEP 3: File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsLoading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('title', formData.title || 'Feature Image')
      uploadFormData.append('alt', formData.title || 'Feature Image')

      console.log('📤 STEP 3: Sending upload request...')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      console.log('📡 STEP 3: Upload response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('❌ STEP 3: Upload failed:', errorData)
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ STEP 3: Upload successful - Full result:', result)
      
      // Extract image URL and publicId
      let imageUrl = null
      let publicId = null

      if (result.url) {
        imageUrl = result.url
        publicId = result.public_id || result.publicId
      } else if (result.secure_url) {
        imageUrl = result.secure_url
        publicId = result.public_id || result.publicId
      } else {
        console.error('❌ STEP 3: No image URL found in result:', result)
        throw new Error('No image URL returned from upload')
      }

      console.log('🖼️ STEP 3: Image URL extracted:', imageUrl)
      console.log('🔑 STEP 3: Public ID extracted:', publicId)

      // Update form data
      setFormData(prev => {
        const newFormData = {
          ...prev,
          image: imageUrl,
          publicId: publicId,
        }
        console.log('📋 STEP 3: Form data updated:', {
          title: newFormData.title,
          hasImage: !!newFormData.image,
          imageUrl: newFormData.image,
          publicId: newFormData.publicId
        })
        return newFormData
      })

      console.log('✅ STEP 3: Image upload completed successfully!')

    } catch (error) {
      console.error('💥 STEP 3: Upload error:', error)
      alert(`Upload failed: ${error.message}`)
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  // 🔍 STEP 4: Save feature to database
  const handleSaveFeature = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Title and description are required')
      return
    }

    console.log('🔄 STEP 4: Saving feature to database...')
    console.log('📦 STEP 4: Form data being saved:', {
      title: formData.title,
      description: formData.description.substring(0, 50) + '...',
      hasImage: !!formData.image,
      imageUrl: formData.image,
      publicId: formData.publicId,
      published: formData.published,
      featured: formData.featured,
      order: formData.order,
      isEditing: !!editingFeature
    })

    setIsLoading(true)
    
    try {
      const url = editingFeature ? `/api/admin/features/${editingFeature.id}` : '/api/admin/features'
      const method = editingFeature ? 'PUT' : 'POST'
      
      console.log(`📡 STEP 4: Making ${method} request to:`, url)
      
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image || null,
        publicId: formData.publicId || null,
        icon: formData.icon || null,
        published: formData.published,
        featured: formData.featured,
        order: formData.order,
      }
      
      console.log('📦 STEP 4: Payload being sent:', payload)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('📡 STEP 4: Save response status:', response.status)

      if (response.ok) {
        const savedFeature = await response.json()
        console.log('✅ STEP 4: Feature saved successfully:', {
          id: savedFeature.id,
          title: savedFeature.title,
          hasImage: !!savedFeature.image,
          imageUrl: savedFeature.image,
          publicId: savedFeature.publicId
        })
        
        // Refresh features list
        console.log('🔄 STEP 4: Refreshing features list...')
        await fetchFeatures()
        
        setIsDialogOpen(false)
        setEditingFeature(null)
        setFormData({
          title: "",
          description: "",
          image: "",
          publicId: "",
          icon: "",
          published: true,
          featured: false,
          order: 0,
        })
        
        console.log('✅ STEP 4: Feature save process completed!')
      } else {
        const errorData = await response.json()
        console.error('❌ STEP 4: Save failed:', errorData)
        alert(errorData.error || 'Failed to save feature')
      }
    } catch (error) {
      console.error("💥 STEP 4: Error saving feature:", error)
      alert('An error occurred while saving the feature')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Are you sure you want to delete this feature?")) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFeatures(prev => prev.filter(feature => feature.id !== featureId))
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete feature')
      }
    } catch (error) {
      console.error("Error deleting feature:", error)
      alert('An error occurred while deleting the feature')
    } finally {
      setIsLoading(false)
    }
  }

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading features...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Features</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your website features and services
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateFeature} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </div>



      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Features</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{features.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {features.filter(f => f.published).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {features.filter(f => f.featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Images</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {features.filter(f => f.image).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Features Grid - 🔍 STEP 5: Display features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => {
          console.log(`🔍 STEP 5: Rendering feature card: ${feature.title}`)
          console.log(`🔍 STEP 5: Feature has image: ${!!feature.image}`)
          console.log(`🔍 STEP 5: Feature image URL: ${feature.image}`)
          
          return (
            <Card key={feature.id} className="group hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                {/* 🔍 IMAGE DISPLAY SECTION - DETAILED DEBUG */}
                {feature.image ? (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover rounded-t-lg"
                      onLoad={(e) => {
                        console.log(`✅ SUCCESS: Image loaded for "${feature.title}"`)
                        console.log(`✅ Dimensions: ${e.currentTarget.naturalWidth}x${e.currentTarget.naturalHeight}`)
                        console.log(`✅ URL: ${feature.image}`)
                        e.currentTarget.style.opacity = '1'
                        e.currentTarget.nextElementSibling?.classList.add('hidden') // Hide error fallback
                        e.currentTarget.nextElementSibling?.nextElementSibling?.classList.add('hidden') // Hide loading
                      }}
                      onError={(e) => {
                        console.error(`❌ FAILED: Image failed for "${feature.title}"`)
                        console.error(`❌ URL: ${feature.image}`)
                        console.error(`❌ Error details:`, e)
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden') // Show error
                        e.currentTarget.nextElementSibling?.nextElementSibling?.classList.add('hidden') // Hide loading
                      }}
                      style={{ 
                        opacity: '0', 
                        transition: 'opacity 0.3s',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    
                    {/* Error fallback */}
                    <div className="hidden absolute inset-0 bg-red-100 flex items-center justify-center z-10">
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 text-red-400 mx-auto mb-1" />
                        <p className="text-xs text-red-600">Failed to load</p>
                        <button 
                          onClick={() => window.open(feature.image, '_blank')}
                          className="text-xs text-blue-600 underline mt-1"
                        >
                          Test URL
                        </button>
                      </div>
                    </div>
                    
                    {/* Loading state */}
                    <div className="absolute inset-0 bg-gray-300 flex items-center justify-center z-5">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 text-gray-500 mx-auto mb-1 animate-spin" />
                        <p className="text-xs text-gray-600">Loading image...</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {feature.image?.split('/').pop()?.substring(0, 15)}...
                        </p>
                        <button 
                          onClick={() => {
                            console.log(`🧪 MANUAL TEST: Testing URL for "${feature.title}"`)
                            console.log(`🧪 URL: ${feature.image}`)
                            window.open(feature.image, '_blank')
                          }}
                          className="text-xs text-blue-600 underline mt-1"
                        >
                          Test URL
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                  {feature.featured && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  <Badge variant={feature.published ? "default" : "secondary"}>
                    {feature.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex space-x-1">
                    {/* Test Image Button */}
                    {feature.image && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log(`🧪 Testing image URL for: ${feature.title}`)
                          console.log(`🧪 URL: ${feature.image}`)
                          window.open(feature.image, '_blank')
                        }}
                        className="h-8 w-8 p-0"
                        title="Test image URL in new tab"
                      >
                        🔗
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditFeature(feature)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteFeature(feature.id)}
                      className="h-8 w-8 p-0"
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {feature.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={feature.published}
                      onCheckedChange={() => {
                        const updatedFeatures = features.map(f => 
                          f.id === feature.id ? { ...f, published: !f.published } : f
                        )
                        setFeatures(updatedFeatures)
                      }}
                      size="sm"
                    />
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                  {feature.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Order: {feature.order}</span>
                  <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
                </div>
                
                {/* Image status indicator */}
                <div className="flex items-center justify-between text-xs">
                  {feature.image ? (
                    <div className="flex items-center text-green-600">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      <span>Image: ✅ ATTACHED</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-400">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      <span>Image: ❌ MISSING</span>
                    </div>
                  )}
                  
                  {/* Image URL display for debugging */}
                  {feature.image && (
                    <div className="text-xs text-blue-600 truncate max-w-32" title={feature.image}>
                      {feature.image.substring(0, 20)}...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFeature ? "Edit Feature" : "Create New Feature"}
            </DialogTitle>
            <DialogDescription>
              {editingFeature ? "Update feature information" : "Add a new feature to showcase your services"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter feature title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this feature..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* 🔍 FORM IMAGE DEBUG */}
            <div className="space-y-4">
              <Label>Feature Image</Label>
              
              {/* Current form state display */}
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <div><strong>Form Image State:</strong></div>
                <div>Has Image: {!!formData.image ? '✅ YES' : '❌ NO'}</div>
                <div>Image URL: {formData.image || 'None'}</div>
                <div>Public ID: {formData.publicId || 'None'}</div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                {formData.image ? (
                  <div className="relative">
                    <div className="relative h-48 w-full bg-gray-100 rounded-lg overflow-hidden border">
                      <img
                        src={formData.image}
                        alt="Feature image preview"
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('✅ FORM: Form image loaded successfully')}
                        onError={(e) => {
                          console.error('❌ FORM: Form image failed to load')
                          console.error('❌ FORM: Image URL:', formData.image)
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        console.log('🗑️ FORM: Removing image from form')
                        setFormData(prev => ({ ...prev, image: "", publicId: "" }))
                      }}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isLoading}
                    />
                    <label htmlFor="image-upload">
                      <Button 
                        type="button"
                        variant="outline" 
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                        asChild
                      >
                        <span>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Image
                            </>
                          )}
                        </span>
                      </Button>
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Upload an image to represent this feature (max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveFeature} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingFeature ? "Update" : "Create"} Feature
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}