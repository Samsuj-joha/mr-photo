"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Tag, X, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [categoryStats, setCategoryStats] = useState<Record<string, { images: number; galleries: number }>>({})

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Remove duplicates (case-insensitive)
          const uniqueCategories = Array.from(
            new Map(
              (data.categories || []).map((cat: string) => [
                cat.toLowerCase(),
                cat
              ])
            ).values()
          )
          setCategories(uniqueCategories)
          await fetchCategoryStats(uniqueCategories)
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Fetch stats for each category
  const fetchCategoryStats = async (cats: string[]) => {
    try {
      const stats: Record<string, { images: number; galleries: number }> = {}
      
      // Fetch all images to count by category
      const imagesResponse = await fetch(`/api/gallery/images?limit=10000`)
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json()
        const allImages = imagesData.images || []
        
        // Count images for each category
        cats.forEach(cat => {
          const count = allImages.filter((img: any) => {
            if (!img.category) return false
            // Handle comma-separated categories
            const categories = img.category.split(',').map((c: string) => c.trim().toLowerCase())
            return categories.includes(cat.toLowerCase())
          }).length
          
          stats[cat] = {
            images: count,
            galleries: 0
          }
        })
      }
      
      setCategoryStats(stats)
    } catch (error) {
      console.error('Error fetching category stats:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Add new category
  const addCategory = async () => {
    const trimmedName = newCategoryName.trim()
    if (!trimmedName) {
      toast.error('Please enter a category name')
      return
    }

    // Check for duplicate categories (case-insensitive)
    const normalizedNewCategory = trimmedName.toLowerCase()
    const isDuplicate = categories.some(
      cat => cat.toLowerCase() === normalizedNewCategory
    )

    if (isDuplicate) {
      toast.error(`Category "${trimmedName}" already exists`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: trimmedName })
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Handle error responses
        const errorMessage = data.error || data.message || 'Failed to add category'
        toast.error(errorMessage)
        console.error('Category add error:', { status: response.status, data })
        return
      }

      if (data.success) {
        // Check if API also detected a duplicate
        if (data.message && data.message.includes('already exists')) {
          toast.error(`Category "${trimmedName}" already exists`)
        } else {
          toast.success(`Category "${trimmedName}" added successfully`)
          setNewCategoryName("")
          await fetchCategories()
        }
      } else {
        toast.error(data.error || data.message || 'Failed to add category')
        console.error('Category add failed:', data)
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast.error('Failed to add category')
    } finally {
      setLoading(false)
    }
  }

  // Delete category
  const deleteCategory = async (category: string) => {
    if (!confirm(`Are you sure you want to delete category "${category}"? This will only work if no galleries, images, or portfolios use it.`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/categories?category=${encodeURIComponent(category)}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(`Category "${category}" removed successfully`)
        await fetchCategories()
      } else {
        toast.error(data.error || data.message || 'Failed to delete category')
        if (data.details) {
          toast.info(`This category is used by ${data.details.images || 0} images and ${data.details.galleries || 0} galleries`)
        }
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Categories</h1>
        <p className="text-muted-foreground">
          Add, edit, and remove image categories. These categories are used for filtering and organization.
        </p>
      </div>

      {/* Add Category Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Category
          </CardTitle>
          <CardDescription>
            Create a new category that can be used for images, galleries, and portfolios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter category name (e.g., Nature, Travel, Portrait)..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addCategory()
                }
              }}
              className="flex-1"
            />
            <Button onClick={addCategory} disabled={loading || !newCategoryName.trim()}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories ({categories.length})
              </CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fetchCategories}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && categories.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No categories found</p>
              <p className="text-sm mt-2">Add your first category above to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 border-t border-l">
              {categories.map((category, index) => {
                const stats = categoryStats[category] || { images: 0, galleries: 0 }
                const totalCount = stats.images + stats.galleries
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors cursor-pointer group border-r border-b"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {/* Blue circular dot */}
                      <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      {/* Category name with count */}
                      <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                        {category} <span className="text-gray-500 dark:text-gray-400 font-normal">({totalCount})</span>
                      </span>
                    </div>
                    {/* Delete button - always visible */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCategory(category)
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-md hover:bg-destructive/10 flex-shrink-0"
                      disabled={loading}
                      title={`Delete category "${category}"`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-2">How Categories Work:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Categories are automatically detected when you upload images using AI</li>
                <li>You can manually add categories here for future use</li>
                <li>Categories help organize and filter your images on the frontend gallery page</li>
                <li>Each image can have one category (from AI detection or manual assignment)</li>
                <li>Categories are shared across galleries, images, and portfolios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

