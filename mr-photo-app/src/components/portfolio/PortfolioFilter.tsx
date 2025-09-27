// File: src/components/portfolio/PortfolioFilter.tsx
// Dynamic filter dropdown component that fetches categories from database

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, ChevronDown, Check, Loader2 } from "lucide-react"

interface PortfolioFilterProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
  resultCount: number
}

interface CategoryOption {
  value: string
  label: string
  count: number
}

export default function PortfolioFilter({ 
  selectedFilter, 
  onFilterChange, 
  resultCount 
}: PortfolioFilterProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dynamic categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/portfolios/categories')
        if (response.ok) {
          const data = await response.json()
          // Add "All Categories" option at the beginning
          const allOptions = [
            { value: "all", label: "All Categories", count: data.totalCount },
            ...data.categories.map((cat: any) => ({
              value: cat.category,
              label: formatCategoryLabel(cat.category),
              count: cat.count
            }))
          ]
          setCategories(allOptions)
        } else {
          // Fallback to basic options if API fails
          setCategories([
            { value: "all", label: "All Categories", count: 0 }
          ])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to basic options
        setCategories([
          { value: "all", label: "All Categories", count: 0 }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Format category labels (capitalize first letter)
  const formatCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  const selectedOption = categories.find(option => option.value === selectedFilter)

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            disabled
            className="min-w-[220px] justify-between bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-3 animate-spin text-gray-500" />
              <span className="font-medium">Loading categories...</span>
            </div>
          </Button>
        </div>
        <div className="text-center lg:text-right">
          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
      
      {/* Left Side - Filter Dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="group relative min-w-[220px] justify-between bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-3 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                <span className="font-medium">
                  {selectedOption?.label || "Select Category"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-all duration-300 group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="min-w-[220px] bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-1 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2"
            align="start"
            sideOffset={4}
          >
            {categories.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className="group relative flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-50 dark:focus:bg-gray-800"
              >
                <div className="flex items-center flex-1">
                  <span className={`font-medium transition-colors ${
                    selectedFilter === option.value 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option.label}
                  </span>
                  
                  {option.count > 0 && (
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {option.count}
                    </span>
                  )}
                </div>
                
                {selectedFilter === option.value && (
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-in fade-in-0 zoom-in-95 ml-2" />
                )}
              </DropdownMenuItem>
            ))}
            
            {categories.length === 1 && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                No categories found. Create some portfolios first!
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Side - Results Count */}
      <div className="text-center lg:text-right">
        <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
          <span className="font-semibold text-gray-900 dark:text-white">
            {resultCount}
          </span>
          {' '}
          {resultCount === 1 ? 'project' : 'projects'}
          {selectedFilter !== "all" && selectedOption && (
            <>
              {' '}in{' '}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {selectedOption.label}
              </span>
            </>
          )}
        </p>
        
        {/* Progress indicator */}
        <div className="mt-2 w-full lg:w-32 ml-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: resultCount > 0 ? `${Math.min((resultCount / 20) * 100, 100)}%` : '0%' 
              }}
            />
          </div>
        </div>
      </div>
      
    </div>
  )
}