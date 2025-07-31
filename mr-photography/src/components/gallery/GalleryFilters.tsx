// src/components/gallery/GalleryFilters.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface FilterOption {
  value: string
  label: string
}

interface GalleryFiltersProps {
  categories: FilterOption[]
  countries: FilterOption[]
  selectedCategory: string
  selectedCountry: string
  onCategoryChange: (value: string) => void
  onCountryChange: (value: string) => void
  onResetFilters: () => void
}

export function GalleryFilters({
  categories,
  countries,
  selectedCategory,
  selectedCountry,
  onCategoryChange,
  onCountryChange,
  onResetFilters
}: GalleryFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 ">
        {/* All Images Button */}
        <Button 
          variant={selectedCategory === "all" && selectedCountry === "all" ? "default" : "outline"}
          onClick={onResetFilters}
          className={`${
            selectedCategory === "all" && selectedCountry === "all" 
              ? "bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white" 
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          All Images
        </Button>

        {/* Country Dropdown */}
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-full sm:w-48 border-gray-300">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.length > 0 ? (
              countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled>
                Loading countries...
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        {/* Category Dropdown */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-48 border-gray-300">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled>
                Loading categories...
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap gap-2 justify-center">
        {selectedCategory !== "all" && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
            Category: {categories.find(c => c.value === selectedCategory)?.label}
          </Badge>
        )}
        {selectedCountry !== "all" && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
            Country: {countries.find(c => c.value === selectedCountry)?.label}
          </Badge>
        )}
      </div>
    </div>
  )
}