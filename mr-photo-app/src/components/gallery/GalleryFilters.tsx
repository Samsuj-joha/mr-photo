// src/components/gallery/GalleryFilters.tsx
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export interface FilterOption {
  value: string
  label: string
}

interface GalleryFiltersProps {
  categories: FilterOption[]
  countries: FilterOption[]
  years: FilterOption[]
  selectedCategory: string
  selectedCountry: string
  selectedYear: string
  onCategoryChange: (value: string) => void
  onCountryChange: (value: string) => void
  onYearChange: (value: string) => void
  onResetFilters: () => void
}

export function GalleryFilters({
  categories,
  countries,
  years,
  selectedCategory,
  selectedCountry,
  selectedYear,
  onCategoryChange,
  onCountryChange,
  onYearChange,
  onResetFilters
}: GalleryFiltersProps) {
  
  return (
    <div className="space-y-4">
      {/* Year Filter - Top Left */}
      <div className="flex justify-start">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-full sm:w-64 border-2 border-gray-400 font-semibold text-lg">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            {years.length > 0 ? (
              years.map((year) => (
                <SelectItem key={year.value} value={year.value} className="text-base">
                  {year.label}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="loading" disabled>
                Loading years...
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}