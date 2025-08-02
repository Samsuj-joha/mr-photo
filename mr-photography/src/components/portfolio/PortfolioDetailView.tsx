// File: src/components/portfolio/PortfolioDetailView.tsx
// Portfolio detail view showing full image, title, and complete description

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Calendar, User, Camera } from "lucide-react"

interface Portfolio {
  id: string
  title: string
  description: string
  gallery: string
  coverImage: string
  loves: number
  createdAt: string
  client?: string // Add client field if available
  completedAt?: string // Add completion date if available
}

interface PortfolioDetailViewProps {
  portfolio: Portfolio
  onLoveClick: () => void
  onBackClick: () => void
}

export default function PortfolioDetailView({ 
  portfolio, 
  onLoveClick, 
  onBackClick 
}: PortfolioDetailViewProps) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={onBackClick}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side - Image */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl">
              <div className="relative w-full h-96 md:h-[600px] overflow-hidden">
                <Image
                  src={portfolio.coverImage}
                  alt={portfolio.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Gallery Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="capitalize bg-white/90 text-gray-900 px-3 py-1">
                    <Camera className="h-3 w-3 mr-1" />
                    {portfolio.gallery}
                  </Badge>
                </div>

                {/* Love Button */}
                <div className="absolute top-4 right-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-red-500 p-3 rounded-full shadow-lg"
                    onClick={onLoveClick}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side - Details */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl h-fit">
              <CardContent className="p-6">
                
                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {portfolio.title}
                </h1>

                {/* Meta Information */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{formatDate(portfolio.createdAt)}</span>
                  </div>
                  
                  {portfolio.client && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">{portfolio.client}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-red-500">
                    <Heart className="h-5 w-5 fill-current" />
                    <span className="font-semibold">{portfolio.loves || 0} loves</span>
                  </div>
                </div>

                {/* Full Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Project Description
                  </h3>
                  
                  {/* Scrollable description container for very long text */}
                  <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {portfolio.description ? (
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                          {portfolio.description}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          No description available for this project.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={onLoveClick}
                    className="w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Love This Project
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={onBackClick}
                    className="w-full flex items-center justify-center"
                  >
                    View More Projects
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>

      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  )
}