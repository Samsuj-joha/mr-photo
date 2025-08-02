// File: src/components/portfolio/PortfolioCard.tsx
// Individual portfolio card with smaller dimensions and smooth zoom animation

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

interface Portfolio {
  id: string
  title: string
  description: string
  gallery: string
  coverImage: string
  loves: number
  createdAt: string
}

interface PortfolioCardProps {
  portfolio: Portfolio
  onLoveClick: (portfolioId: string) => void
}

export default function PortfolioCard({ portfolio, onLoveClick }: PortfolioCardProps) {
  
  // Truncate description to 50 words
  const truncateDescription = (text: string, wordLimit: number = 50) => {
    const words = text.split(' ')
    if (words.length <= wordLimit) {
      return text
    }
    return words.slice(0, wordLimit).join(' ') + '...'
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 w-full max-w-sm mx-auto">
      
      {/* Image with slow zoom animation - reduced height */}
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={portfolio.coverImage}
          alt={portfolio.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-125 transition-transform duration-700 ease-in-out"
        />
        
        {/* Love icon overlay */}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white text-red-500 p-1.5 rounded-full shadow-lg"
            onClick={() => onLoveClick(portfolio.id)}
          >
            <Heart className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1 line-clamp-1">
              {portfolio.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 leading-relaxed">
              {truncateDescription(portfolio.description)}
            </p>
          </div>
          
          {/* Love count */}
          <div className="flex items-center space-x-1 text-red-500 ml-2">
            <Heart className="h-3 w-3 fill-current" />
            <span className="text-xs font-medium">{portfolio.loves || 0}</span>
          </div>
        </div>

        {/* Read More Button - Links to detail page */}
        <Link href={`/portfolio/${portfolio.id}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Read More
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}