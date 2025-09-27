"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  User, 
  Camera,
  Heart,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react"
import Image from "next/image"

interface AboutData {
  id?: string
  name: string
  description: string
  profileImage?: string
  profileImagePublicId?: string
  journeyTitle: string
  journeyContent: string
  valuesTitle: string
  valuesContent: string
  published: boolean
}

export default function AdminAboutPage() {
  const [aboutData, setAboutData] = useState<AboutData>({
    name: "",
    description: "",
    journeyTitle: "My Photography Journey",
    journeyContent: "",
    valuesTitle: "My Values & Approach", 
    valuesContent: "",
    published: true
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState("")
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load existing data on component mount
  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/about')
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      } else {
        setError("Failed to load about page data")
      }
    } catch (error) {
      console.error('Failed to load about data:', error)
      setError("Failed to load about page data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setAboutData(updatedData)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to save about page data")
      }
    } catch (error) {
      setError("An error occurred while saving")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof AboutData, value: string | boolean) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/about/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        
        // Delete old image if exists
        if (aboutData.profileImagePublicId) {
          await deleteImage(aboutData.profileImagePublicId)
        }

        setAboutData(prev => ({
          ...prev,
          profileImage: result.url,
          profileImagePublicId: result.publicId
        }))
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to upload image")
      }
    } catch (error) {
      setError("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const deleteImage = async (publicId: string) => {
    try {
      await fetch('/api/admin/about/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      })
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }

  const removeProfileImage = async () => {
    if (aboutData.profileImagePublicId) {
      await deleteImage(aboutData.profileImagePublicId)
    }
    setAboutData(prev => ({
      ...prev,
      profileImage: undefined,
      profileImagePublicId: undefined
    }))
  }

  if (isLoading && !aboutData.id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading about page data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white tracking-wide">
            About Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your about page content - 3 simple sections
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaved ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isSaved && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription className="text-green-800 dark:text-green-400">
            About page content has been saved successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Section 1: Basic Information
              </CardTitle>
              <CardDescription>
                Your name, description, and profile image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={aboutData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., John Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={aboutData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description about yourself and your photography work..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Photography Journey */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Section 2: Photography Journey
              </CardTitle>
              <CardDescription>
                Tell your story and how you started in photography
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="journeyTitle">Section Title</Label>
                <Input
                  id="journeyTitle"
                  value={aboutData.journeyTitle}
                  onChange={(e) => handleInputChange('journeyTitle', e.target.value)}
                  placeholder="My Photography Journey"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="journeyContent">Content</Label>
                <Textarea
                  id="journeyContent"
                  value={aboutData.journeyContent}
                  onChange={(e) => handleInputChange('journeyContent', e.target.value)}
                  placeholder="Tell your photography journey story..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Values & Approach */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Section 3: Values & Approach
              </CardTitle>
              <CardDescription>
                Your photography philosophy and approach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="valuesTitle">Section Title</Label>
                <Input
                  id="valuesTitle"
                  value={aboutData.valuesTitle}
                  onChange={(e) => handleInputChange('valuesTitle', e.target.value)}
                  placeholder="My Values & Approach"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valuesContent">Content</Label>
                <Textarea
                  id="valuesContent"
                  value={aboutData.valuesContent}
                  onChange={(e) => handleInputChange('valuesContent', e.target.value)}
                  placeholder="Describe your values, approach, and what makes your work unique..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Profile Image
              </CardTitle>
              <CardDescription>
                Upload your profile photo for the about page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative">
                {aboutData.profileImage ? (
                  <>
                    <Image
                      src={aboutData.profileImage}
                      alt="Profile"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeProfileImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">No image uploaded</p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Publication Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-gray-500">Make this page visible to visitors</p>
                </div>
                <Button
                  variant={aboutData.published ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('published', !aboutData.published)}
                >
                  {aboutData.published ? "Published" : "Draft"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="text-sm font-medium">
                    {aboutData.id ? new Date().toLocaleDateString() : "Not saved yet"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <Badge variant={aboutData.published ? "default" : "secondary"}>
                    {aboutData.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sections</span>
                  <span className="text-sm font-medium">3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}