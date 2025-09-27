
// File: src/components/portfolio/PortfolioGrid.tsx
// Grid component showing 4 images per row with zoom animation

import PortfolioCard from "./PortfolioCard"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Portfolio {
  id: string
  title: string
  description: string
  gallery: string
  coverImage: string
  loves: number
  createdAt: string
}

interface PortfolioGridProps {
  portfolios: Portfolio[]
  onLoveClick: (portfolioId: string) => void
}

export default function PortfolioGrid({ portfolios, onLoveClick }: PortfolioGridProps) {
  
  if (portfolios.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No images found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Try selecting a different gallery filter to see more images.
        </p>
        <Button onClick={() => window.location.reload()}>
          Show All Images
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {portfolios.map((portfolio) => (
        <PortfolioCard
          key={portfolio.id}
          portfolio={portfolio}
          onLoveClick={onLoveClick}
        />
      ))}
    </div>
  )
}