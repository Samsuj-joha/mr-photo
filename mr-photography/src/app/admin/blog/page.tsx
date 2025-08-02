// File: src/app/admin/blog/page.tsx
// Minimal working blog form with exact same upload logic as test

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Loader2,
  Upload,
  Trash2
} from "lucide-react"
import Image from "next/image"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  published: boolean
  featured: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Fetch blogs
  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs')
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create Blog Form Component - MINIMAL VERSION
  const CreateBlogForm = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [coverImage, setCoverImage] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // EXACT same upload function that works in test
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      console.log('🔍 Upload started for:', file.name)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        alert('Image must be less than 10MB')
        return
      }

      setIsUploading(true)

      try {
        console.log('🚀 Starting upload test...')
        
        // Create FormData - EXACT same as debug tool
        const formData = new FormData()
        formData.append('file', file)
        console.log('📦 FormData created')

        console.log('📤 Sending POST to /api/blog-upload')
        
        // Use EXACT same fetch as debug tool
        const response = await fetch('/api/blog-upload', {
          method: 'POST',
          body: formData
        })

        console.log(`📨 Response received: ${response.status} (${response.statusText})`)
        console.log(`✅ Response OK: ${response.ok}`)

        if (response.ok) {
          const data = await response.json()
          console.log('🎉 Upload successful!')
          console.log(`🔗 Image URL: ${data.url}`)
          
          // Set the image URL
          setCoverImage(data.url)
          alert('Upload successful!')
          
        } else {
          const errorText = await response.text()
          console.log(`❌ Upload failed: ${errorText}`)
          alert('Upload failed: ' + errorText)
        }
      } catch (error) {
        console.error('💥 Upload error:', error)
        alert('Upload error: ' + error)
      } finally {
        setIsUploading(false)
        // Reset file input
        e.target.value = ''
      }
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!title || !content) {
        alert('Title and content are required')
        return
      }

      setIsSubmitting(true)
      
      try {
        const blogData = {
          title,
          excerpt: null,
          content,
          coverImage: coverImage || null,
          tags: [],
          featured: false,
          published: false,
        }

        const response = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(blogData)
        })

        if (response.ok) {
          const newBlog = await response.json()
          setBlogs(prev => [newBlog, ...prev])
          setIsCreateModalOpen(false)
          // Reset form
          setTitle("")
          setContent("")
          setCoverImage("")
          alert('Blog post created successfully!')
        } else {
          alert('Failed to create blog post')
        }
      } catch (error) {
        alert('Error creating blog post')
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog post title"
            required
          />
        </div>

        {/* Upload Section - EXACT same as working test */}
        <div>
          <Label>Cover Image</Label>
          <div className="space-y-4">
            
            {/* Image Preview */}
            {coverImage && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                  src={coverImage}
                  alt="Cover image preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setCoverImage("")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Input - EXACT same as test */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                        Click to upload image
                      </span>
                    </label>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog post content"
            rows={6}
            required
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsCreateModalOpen(false)}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isSubmitting ? 'Creating...' : 'Create Blog Post'}
          </Button>
        </div>
      </form>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog Management (Minimal Working Version)
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage your blog posts
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Minimal working version with upload
              </DialogDescription>
            </DialogHeader>
            <CreateBlogForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Simple Blog List */}
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>No blog posts yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="w-24 h-16 flex-shrink-0">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={96}
                        height={64}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{blog.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {blog.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}