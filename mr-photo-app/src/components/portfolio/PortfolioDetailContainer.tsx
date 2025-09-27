// File: src/components/portfolio/PortfolioDetailContainer.tsx
// Beautiful portfolio detail page with Next.js Image and professional design

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowLeft, Calendar, User, Camera, MapPin, Clock } from "lucide-react"

interface Portfolio {
  id: string
  title: string
  description: string
  gallery: string
  coverImage: string
  loves: number
  createdAt: string
  client?: string
  completedAt?: string
}

interface PortfolioDetailContainerProps {
  id: string
}

export default function PortfolioDetailContainer({ id }: PortfolioDetailContainerProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loved, setLoved] = useState(false)
  const router = useRouter()

  // Fetch single portfolio from API
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolios/${id}`)
        
        if (response.ok) {
          const data = await response.json()
          setPortfolio(data)
        } else if (response.status === 404) {
          setError("Portfolio not found")
        } else {
          setError("Failed to load portfolio")
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error)
        setError("Failed to load portfolio")
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [id])

  const handleLoveClick = async () => {
    if (!portfolio) return

    try {
      const response = await fetch(`/api/portfolios/${portfolio.id}/love`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const updatedPortfolio = await response.json()
        setPortfolio({
          ...portfolio,
          loves: updatedPortfolio.loves
        })
        setLoved(true)
        setTimeout(() => setLoved(false), 1000)
      }
    } catch (error) {
      console.error('Error updating love:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <Camera className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your masterpiece...</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Camera className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || "Portfolio not found"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The portfolio you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go back to portfolio
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Full Screen Image */}
        <div className="absolute inset-0">
          <Image
            src={portfolio.coverImage}
            alt={portfolio.title}
            fill
            className="object-cover"
            priority
            quality={95}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </div>

        {/* Back Button - Top Left */}
        <div className="absolute top-6 left-6 z-10">
          <Button
            onClick={() => router.back()}
            variant="secondary"
            className="bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm border-0 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Love Button - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <Button
            onClick={handleLoveClick}
            variant="secondary"
            className={`bg-white/90 hover:bg-white text-red-500 backdrop-blur-sm border-0 shadow-lg transition-all duration-300 ${
              loved ? 'scale-110' : ''
            }`}
          >
            <Heart className={`w-5 h-5 mr-2 transition-all ${loved ? 'fill-current scale-125' : ''}`} />
            {portfolio.loves}
          </Button>
        </div>

        {/* Category Badge - Top Center */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm border-0 px-4 py-2 text-sm font-medium capitalize">
            <Camera className="w-3 h-3 mr-2" />
            {portfolio.gallery}
          </Badge>
        </div>

        {/* Content - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight">
              {portfolio.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-white/80">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{formatDate(portfolio.createdAt)}</span>
              </div>
              
              {portfolio.client && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">{portfolio.client}</span>
                </div>
              )}
              
              {portfolio.completedAt && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Completed {formatDate(portfolio.completedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-12">
              
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
                  Project Story
                </h2>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
              </div>

              {/* Description Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {portfolio.description ? (
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                    {portfolio.description}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 italic text-lg">
                      Every picture tells a story, but this one is still being written...
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleLoveClick}
                  className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-6 text-lg transition-all duration-300 ${
                    loved ? 'scale-105' : ''
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-3 transition-all ${loved ? 'fill-current' : ''}`} />
                  {loved ? 'Loved!' : 'Love This Project'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 py-6 text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Explore More Projects
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  )
}