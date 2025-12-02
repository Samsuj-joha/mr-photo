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
          setCategories(data.categories || [])
          await fetchCategoryStats(data.categories || [])
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
      
      for (const cat of cats) {
        // Count images with this category
        const imagesResponse = await fetch(`/api/gallery/images?category=${encodeURIComponent(cat)}&limit=1`)
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json()
          stats[cat] = {
            images: imagesData.images?.length || 0,
            galleries: 0 // Can be added later if needed
          }
        }
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
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategoryName.trim() })
      })

      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(`Category "${newCategoryName.trim()}" added successfully`)
        setNewCategoryName("")
        await fetchCategories()
      } else {
        toast.error(data.error || 'Failed to add category')
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
                All Categories ({categories.length})
              </CardTitle>
              <CardDescription>
                Categories currently in use across your galleries, images, and portfolios
              </CardDescription>
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
        <CardContent>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const stats = categoryStats[category] || { images: 0, galleries: 0 }
                return (
                  <div
                    key={category}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                        {category}
                      </Badge>
                      <button
                        onClick={() => deleteCategory(category)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        disabled={loading}
                        title="Delete category"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <div>Used in {stats.images} image{stats.images !== 1 ? 's' : ''}</div>
                      {stats.galleries > 0 && (
                        <div>{stats.galleries} gallery{stats.galleries !== 1 ? 's' : ''}</div>
                      )}
                    </div>
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

