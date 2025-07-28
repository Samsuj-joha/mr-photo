"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  Clock,
  MoreHorizontal,
  FileText,
  TrendingUp
} from "lucide-react"
import Image from "next/image"

// Sample blog data
const sampleBlogs = [
  {
    id: 1,
    title: "10 Essential Wedding Photography Tips",
    slug: "10-essential-wedding-photography-tips",
    excerpt: "Master the art of wedding photography with these proven techniques and insider secrets.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
    published: true,
    featured: true,
    tags: ["wedding", "tips", "photography"],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    views: 2847,
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Best Lighting Techniques for Portrait Photography",
    slug: "best-lighting-techniques-portrait-photography",
    excerpt: "Learn how to use natural and artificial light to create stunning portrait photographs.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1554380875-33d0b8a71b54?w=400&h=300&fit=crop",
    published: true,
    featured: false,
    tags: ["portrait", "lighting", "techniques"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    views: 1923,
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Corporate Photography: Professional Image Guidelines",
    slug: "corporate-photography-professional-guidelines",
    excerpt: "Essential guidelines for creating impactful corporate photography that elevates your brand.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
    published: false,
    featured: false,
    tags: ["corporate", "business", "professional"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    views: 1456,
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Street Photography Composition Secrets",
    slug: "street-photography-composition-secrets",
    excerpt: "Discover the secrets to capturing compelling street photography with perfect composition.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    published: true,
    featured: false,
    tags: ["street", "composition", "urban"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    views: 987,
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Editing Workflow for Professional Photographers",
    slug: "editing-workflow-professional-photographers",
    excerpt: "Streamline your photo editing process with this comprehensive workflow guide.",
    content: "Full blog content here...",
    coverImage: "https://images.unsplash.com/photo-1616587894289-86480dc264d1?w=400&h=300&fit=crop",
    published: false,
    featured: true,
    tags: ["editing", "workflow", "post-processing"],
    createdAt: "2023-12-28",
    updatedAt: "2024-01-02",
    views: 654,
    readTime: "8 min read",
  },
]

export default function AdminBlog() {
  const [blogs, setBlogs] = useState(sampleBlogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Filter blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "published" && blog.published) ||
                         (filterStatus === "draft" && !blog.published) ||
                         (filterStatus === "featured" && blog.featured)
    
    return matchesSearch && matchesStatus
  })

  const deleteBlog = (blogId) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogs(prev => prev.filter(blog => blog.id !== blogId))
    }
  }

  const togglePublished = (blogId) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId ? { ...blog, published: !blog.published } : blog
    ))
  }

  const toggleFeatured = (blogId) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === blogId ? { ...blog, featured: !blog.featured } : blog
    ))
  }

  const CreateBlogForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: "",
      excerpt: "",
      content: "",
      tags: "",
      featured: false,
      published: false,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      
      // Create new blog post
      const newBlog = {
        id: blogs.length + 1,
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
        published: formData.published,
        featured: formData.featured,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
        readTime: Math.ceil(formData.content.split(' ').length / 200) + " min read",
      }

      setBlogs(prev => [newBlog, ...prev])
      console.log("Creating blog:", newBlog)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Blog post title"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Brief description of the blog post"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Blog post content"
            rows={8}
            required
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="photography, tips, wedding"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Featured Post</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Publish Now</span>
          </label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Blog Post
          </Button>
        </div>
      </form>
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
            Create and manage your blog posts and articles
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
              <DialogDescription>
                Write a new blog post to share with your audience
              </DialogDescription>
            </DialogHeader>
            <CreateBlogForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Posts</p>
                <p className="text-2xl font-bold">{blogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-2xl font-bold">{blogs.filter(b => b.published).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-2xl font-bold">{blogs.filter(b => b.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold">{blogs.reduce((acc, b) => acc + b.views, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search blog posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Cover Image */}
                <div className="w-24 h-16 flex-shrink-0">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={96}
                    height={64}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {blog.title}
                        </h3>
                        {blog.featured && (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={blog.published ? "default" : "secondary"} className="text-xs">
                          {blog.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {blog.readTime}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {blog.views.toLocaleString()} views
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFeatured(blog.id)}
                      >
                        <Star className={`h-4 w-4 mr-2 ${blog.featured ? 'fill-current text-yellow-500' : ''}`} />
                        {blog.featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => togglePublished(blog.id)}
                      >
                        {blog.published ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteBlog(blog.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No blog posts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || filterStatus !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first blog post."
            }
          </p>
          {!searchQuery && filterStatus === "all" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Write Your First Post
            </Button>
          )}
        </div>
      )}
    </div>
  )
}