
// src/app/admin/blog/page.tsx - COMPLETE VERSION with TIFF Support
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Loader2,
  Upload,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ExternalLink,
  BarChart3,
  X,
  CheckCircle,
  AlertCircle,
  FileImage,
  Zap
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

interface UploadProgress {
  stage: string
  progress: number
  message: string
  details?: any
}

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

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

  // Filter and sort blogs
  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesFilter = filterStatus === "all" ||
                           (filterStatus === "published" && blog.published) ||
                           (filterStatus === "draft" && !blog.published) ||
                           (filterStatus === "featured" && blog.featured)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  // Toggle publish status
  const togglePublishStatus = async (blog: Blog) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !blog.published })
      })

      if (response.ok) {
        const updatedBlog = await response.json()
        setBlogs(prev => prev.map(b => b.id === blog.id ? updatedBlog : b))
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  // Toggle featured status
  const toggleFeaturedStatus = async (blog: Blog) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !blog.featured })
      })

      if (response.ok) {
        const updatedBlog = await response.json()
        setBlogs(prev => prev.map(b => b.id === blog.id ? updatedBlog : b))
      }
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  // Delete blog
  const deleteBlog = async (blog: Blog) => {
    if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) return

    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setBlogs(prev => prev.filter(b => b.id !== blog.id))
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  // Copy blog URL
  const copyBlogUrl = (slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`
    navigator.clipboard.writeText(url)
    alert('Blog URL copied to clipboard!')
  }

  // Blog Form Component
  const BlogForm = ({ blog }: { blog?: Blog }) => {
    const [title, setTitle] = useState(blog?.title || "")
    const [excerpt, setExcerpt] = useState(blog?.excerpt || "")
    const [content, setContent] = useState(blog?.content || "")
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
    const [coverImagePreview, setCoverImagePreview] = useState(blog?.coverImage || "")
    const [tags, setTags] = useState(blog?.tags.join(", ") || "")
    const [featured, setFeatured] = useState(blog?.featured || false)
    const [published, setPublished] = useState(blog?.published || false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setCoverImageFile(file)
        
        const reader = new FileReader()
        reader.onload = (e) => {
          setCoverImagePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }

    const removeImage = () => {
      setCoverImageFile(null)
      setCoverImagePreview(blog?.coverImage || "")
    }

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + ' KB'
      }
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }

    const getFileTypeInfo = (file: File) => {
      const isTiff = file.type === 'image/tiff' || 
                    file.type === 'image/tif' || 
                    file.name.toLowerCase().endsWith('.tif') || 
                    file.name.toLowerCase().endsWith('.tiff')
      
      const isLarge = file.size > 10 * 1024 * 1024
      
      return { isTiff, isLarge }
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (!title || !content) {
        alert('Title and content are required')
        return
      }

      setIsSubmitting(true)
      setUploadProgress({
        stage: "preparing",
        progress: 0,
        message: "Preparing to save blog post..."
      })
      
      try {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('excerpt', excerpt || '')
        formData.append('content', content)
        formData.append('tags', tags)
        formData.append('featured', featured.toString())
        formData.append('published', published.toString())
        
        if (coverImageFile) {
          formData.append('coverImage', coverImageFile)
          
          const { isTiff, isLarge } = getFileTypeInfo(coverImageFile)
          const fileSizeMB = (coverImageFile.size / (1024 * 1024)).toFixed(2)
          
          if (isTiff) {
            setUploadProgress({
              stage: "converting",
              progress: 20,
              message: `Converting TIFF file (${fileSizeMB}MB) to JPEG...`,
              details: { originalFormat: "TIFF", targetFormat: "JPEG" }
            })
          } else if (isLarge) {
            setUploadProgress({
              stage: "optimizing",
              progress: 20,
              message: `Optimizing large file (${fileSizeMB}MB)...`,
              details: { originalSize: fileSizeMB + "MB" }
            })
          } else {
            setUploadProgress({
              stage: "uploading",
              progress: 30,
              message: "Uploading to cloud storage..."
            })
          }
        }

        // Progress simulation
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (!prev) return null
            const newProgress = Math.min(prev.progress + 15, 85)
            
            if (prev.stage === "converting" && newProgress > 50) {
              return {
                stage: "uploading",
                progress: newProgress,
                message: "Uploading converted image..."
              }
            }
            
            if (prev.stage === "optimizing" && newProgress > 50) {
              return {
                stage: "uploading",
                progress: newProgress,
                message: "Uploading optimized image..."
              }
            }
            
            return {
              ...prev,
              progress: newProgress
            }
          })
        }, 800)

        const url = blog ? `/api/admin/blogs/${blog.id}` : '/api/admin/blogs'
        const method = blog ? 'PATCH' : 'POST'

        const response = await fetch(url, {
          method,
          body: formData
        })

        clearInterval(progressInterval)

        if (response.ok) {
          const savedBlog = await response.json()
          
          setUploadProgress({
            stage: "complete",
            progress: 100,
            message: savedBlog.message || `Blog ${blog ? 'updated' : 'created'} successfully!`,
            details: savedBlog.uploadDetails
          })
          
          if (blog) {
            setBlogs(prev => prev.map(b => b.id === blog.id ? savedBlog : b))
            setEditingBlog(null)
          } else {
            setBlogs(prev => [savedBlog, ...prev])
            setIsCreateModalOpen(false)
          }

          // Reset form if creating new
          if (!blog) {
            setTitle("")
            setExcerpt("")
            setContent("")
            setCoverImageFile(null)
            setCoverImagePreview("")
            setTags("")
            setFeatured(false)
            setPublished(false)
          }

          setTimeout(() => {
            setUploadProgress(null)
          }, 2000)

        } else {
          const errorData = await response.json()
          setUploadProgress({
            stage: "error",
            progress: 0,
            message: errorData.message || `Failed to ${blog ? 'update' : 'create'} blog`,
            details: errorData.details
          })
        }
      } catch (error) {
        setUploadProgress({
          stage: "error",
          progress: 0,
          message: "Network error occurred",
          details: error instanceof Error ? error.message : 'Unknown error'
        })
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog post title"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short description for the blog post"
            rows={2}
            disabled={isSubmitting}
          />
        </div>

        {/* Enhanced Cover Image Upload */}
        <div>
          <Label>Cover Image</Label>
          <div className="mt-2">
            {!coverImagePreview ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center border-gray-300">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Click to upload cover image
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      PNG, JPG, TIFF, WebP up to 50MB
                    </span>
                    <span className="mt-1 block text-xs text-blue-600">
                      ✨ TIFF files will be automatically converted to JPEG
                    </span>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*,.tif,.tiff"
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={coverImagePreview}
                    alt="Cover image preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      disabled={isSubmitting}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* File Info */}
                {coverImageFile && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <FileImage className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{coverImageFile.name}</span>
                      </div>
                      <span className="text-gray-500">{formatFileSize(coverImageFile.size)}</span>
                    </div>
                    
                    {(() => {
                      const { isTiff, isLarge } = getFileTypeInfo(coverImageFile!)
                      return (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {isTiff && (
                            <div className="flex items-center text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              <Zap className="h-3 w-3 mr-1" />
                              Will convert TIFF → JPEG
                            </div>
                          )}
                          {isLarge && (
                            <div className="flex items-center text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded">
                              <Zap className="h-3 w-3 mr-1" />
                              Will optimize large file
                            </div>
                          )}
                          {!isTiff && !isLarge && (
                            <div className="flex items-center text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready to upload
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog post content"
            rows={8}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="photography, wedding, tips"
            disabled={isSubmitting}
          />
        </div>

        {/* Status toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="featured">Featured Post</Label>
              <p className="text-sm text-gray-500">Show on homepage</p>
            </div>
            <Switch
              id="featured"
              checked={featured}
              onCheckedChange={setFeatured}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="published">Publish</Label>
              <p className="text-sm text-gray-500">Make publicly visible</p>
            </div>
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress && (
          <Alert className={`${
            uploadProgress.stage === "error" ? "border-red-500 bg-red-50 dark:bg-red-950" :
            uploadProgress.stage === "complete" ? "border-green-500 bg-green-50 dark:bg-green-950" :
            "border-blue-500 bg-blue-50 dark:bg-blue-950"
          }`}>
            <div className="flex items-center space-x-2">
              {uploadProgress.stage === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : uploadProgress.stage === "complete" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
              <AlertDescription className="flex-1">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{uploadProgress.message}</span>
                    <span className="text-sm text-gray-500">{uploadProgress.progress}%</span>
                  </div>
                  
                  {uploadProgress.stage !== "error" && uploadProgress.stage !== "complete" && (
                    <Progress value={uploadProgress.progress} className="w-full" />
                  )}
                  
                  {uploadProgress.details && uploadProgress.stage === "complete" && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {uploadProgress.details.wasConverted && (
                        <div>✅ Converted from {uploadProgress.details.originalFormat} to {uploadProgress.details.finalFormat}</div>
                      )}
                      {uploadProgress.details.wasOptimized && (
                        <div>🎯 Optimized: {(uploadProgress.details.originalSize / 1024 / 1024).toFixed(2)}MB → {(uploadProgress.details.finalSize / 1024 / 1024).toFixed(2)}MB</div>
                      )}
                    </div>
                  )}
                  
                  {uploadProgress.details && uploadProgress.stage === "error" && (
                    <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                      {typeof uploadProgress.details === 'string' ? uploadProgress.details : JSON.stringify(uploadProgress.details)}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              if (blog) {
                setEditingBlog(null)
              } else {
                setIsCreateModalOpen(false)
              }
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || uploadProgress?.stage === "complete"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {uploadProgress?.stage === "converting" ? "Converting..." :
                 uploadProgress?.stage === "optimizing" ? "Optimizing..." :
                 uploadProgress?.stage === "uploading" ? "Uploading..." :
                 "Processing..."}
              </>
            ) : uploadProgress?.stage === "complete" ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                {blog ? 'Updated!' : 'Created!'}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                {blog ? 'Update Blog' : 'Create Blog'}
              </>
            )}
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
            Blog Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage your blog posts ({blogs.length} total)
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Create engaging content for your photography blog. TIFF files will be automatically converted to JPEG.
              </DialogDescription>
            </DialogHeader>
            <BlogForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Info Banner */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <Zap className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Enhanced Upload System:</strong> Supports TIFF files (auto-converted to JPEG), automatic image optimization for large files, and smart compression.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.filter(b => b.published).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.filter(b => !b.published).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogs.filter(b => b.featured).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredAndSortedBlogs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                {searchQuery || filterStatus !== "all" 
                  ? "No blog posts found matching your criteria" 
                  : "No blog posts yet. Create your first one!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedBlogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Cover Image */}
                  <div className="w-32 h-20 flex-shrink-0">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        width={128}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>

                   {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {blog.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={blog.published ? "default" : "secondary"}>
                            {blog.published ? "Published" : "Draft"}
                          </Badge>
                          {blog.featured && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {blog.tags.length > 0 && (
                            <div className="flex gap-1">
                              {blog.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {blog.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{blog.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {blog.excerpt && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {blog.excerpt}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          {blog.updatedAt !== blog.createdAt && (
                            <span>Updated {new Date(blog.updatedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBlog(blog)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => togglePublishStatus(blog)}>
                              {blog.published ? (
                                <>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFeaturedStatus(blog)}>
                              <Star className="h-4 w-4 mr-2" />
                              {blog.featured ? "Remove from Featured" : "Mark as Featured"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyBlogUrl(blog.slug)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy URL
                            </DropdownMenuItem>
                            {blog.published && (
                              <DropdownMenuItem 
                                onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Post
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => deleteBlog(blog)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Blog Modal */}
      <Dialog open={!!editingBlog} onOpenChange={() => setEditingBlog(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update your blog post content and settings. TIFF files will be automatically converted to JPEG.
            </DialogDescription>
          </DialogHeader>
          {editingBlog && <BlogForm blog={editingBlog} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}