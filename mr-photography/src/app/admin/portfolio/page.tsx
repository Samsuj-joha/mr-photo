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
  ExternalLink,
  MoreHorizontal,
  Upload
} from "lucide-react"
import Image from "next/image"

// Sample portfolio data
const samplePortfolios = [
  {
    id: 1,
    title: "Sarah & John Wedding",
    client: "Sarah & John Smith",
    category: "wedding",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    images: ["image1.jpg", "image2.jpg", "image3.jpg"],
    description: "Beautiful destination wedding in Tuscany",
    featured: true,
    published: true,
    completedAt: "2024-01-15",
    createdAt: "2024-01-15",
    views: 1240,
  },
  {
    id: 2,
    title: "Corporate Branding Session",
    client: "TechStart Inc.",
    category: "corporate",
    coverImage: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
    images: ["corp1.jpg", "corp2.jpg"],
    description: "Professional headshots and corporate photography",
    featured: false,
    published: true,
    completedAt: "2024-01-10",
    createdAt: "2024-01-10",
    views: 856,
  },
  {
    id: 3,
    title: "Fashion Editorial",
    client: "Vogue Magazine",
    category: "fashion",
    coverImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
    images: ["fashion1.jpg", "fashion2.jpg", "fashion3.jpg", "fashion4.jpg"],
    description: "High-fashion editorial shoot for magazine",
    featured: true,
    published: false,
    completedAt: "2024-01-05",
    createdAt: "2024-01-05",
    views: 623,
  },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "corporate", label: "Corporate" },
  { value: "fashion", label: "Fashion" },
  { value: "event", label: "Event" },
]

export default function AdminPortfolio() {
  const [portfolios, setPortfolios] = useState(samplePortfolios)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPortfolio, setSelectedPortfolio] = useState(null)

  // Filter portfolios
  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesSearch = portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         portfolio.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || portfolio.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const CreatePortfolioForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: "",
      client: "",
      category: "",
      description: "",
      featured: false,
      published: true,
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      // Add new portfolio logic here
      console.log("Creating portfolio:", formData)
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Project title"
              required
            />
          </div>
          <div>
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
              placeholder="Client name"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(cat => cat.value !== "all").map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Project description"
            rows={3}
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
            <span className="text-sm">Featured Project</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm">Published</span>
          </label>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Portfolio
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
            Portfolio Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your portfolio projects and showcase your best work
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Portfolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Portfolio</DialogTitle>
              <DialogDescription>
                Add a new portfolio project to showcase your work
              </DialogDescription>
            </DialogHeader>
            <CreatePortfolioForm onClose={() => setIsCreateModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Projects</p>
                <p className="text-2xl font-bold">{portfolios.length}</p>
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
                <p className="text-2xl font-bold">{portfolios.filter(p => p.featured).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-2xl font-bold">{portfolios.filter(p => p.published).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold">{portfolios.reduce((acc, p) => acc + p.views, 0)}</p>
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
            placeholder="Search portfolios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPortfolios.map((portfolio) => (
          <Card key={portfolio.id} className="group hover:shadow-lg transition-all duration-200">
            <div className="relative overflow-hidden">
              <Image
                src={portfolio.coverImage}
                alt={portfolio.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                {portfolio.featured && (
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant={portfolio.published ? "default" : "secondary"}>
                  {portfolio.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {portfolio.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {portfolio.client}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {portfolio.category}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {portfolio.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(portfolio.completedAt).toLocaleDateString()}
                </div>
                <span>{portfolio.images.length} photos</span>
                <span>{portfolio.views} views</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPortfolios.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No portfolios found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Get started by creating your first portfolio project."
            }
          </p>
          {!searchQuery && selectedCategory === "all" && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Portfolio
            </Button>
          )}
        </div>
      )}
    </div>
  )
}