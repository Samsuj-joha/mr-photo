// File: /src/app/portfolio/page.tsx

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Filter, 
  Eye,
  ExternalLink,
  Calendar,
  User,
  Star,
  ArrowRight,
  Camera,
  Award
} from "lucide-react"

// Sample data - Replace with API call later
const samplePortfolios = [
  {
    id: 1,
    title: "Sarah & John's Wedding",
    description: "A beautiful outdoor wedding ceremony at Central Park with stunning golden hour portraits.",
    client: "Sarah & John Martinez",
    category: "wedding",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop"
    ],
    featured: true,
    published: true,
    completedAt: "2024-02-15T00:00:00Z",
    createdAt: "2024-02-16T00:00:00Z",
    updatedAt: "2024-02-16T00:00:00Z",
  },
  {
    id: 2,
    title: "Emma's Portrait Session",
    description: "Professional headshots and lifestyle portraits for a rising actress in Manhattan.",
    client: "Emma Thompson",
    category: "portrait",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b55e81eb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=800&h=600&fit=crop"
    ],
    featured: false,
    published: true,
    completedAt: "2024-02-10T00:00:00Z",
    createdAt: "2024-02-11T00:00:00Z",
    updatedAt: "2024-02-11T00:00:00Z",
  },
  {
    id: 3,
    title: "TechCorp Annual Conference",
    description: "Corporate event photography capturing keynote speakers, networking, and company culture.",
    client: "TechCorp Inc.",
    category: "corporate",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
    ],
    featured: true,
    published: true,
    completedAt: "2024-01-25T00:00:00Z",
    createdAt: "2024-01-26T00:00:00Z",
    updatedAt: "2024-01-26T00:00:00Z",
  },
  {
    id: 4,
    title: "Fashion Week Editorial",
    description: "Behind-the-scenes and runway photography for New York Fashion Week 2024.",
    client: "Fashion Forward Magazine",
    category: "fashion",
    coverImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop"
    ],
    featured: true,
    published: true,
    completedAt: "2024-01-20T00:00:00Z",
    createdAt: "2024-01-21T00:00:00Z",
    updatedAt: "2024-01-21T00:00:00Z",
  },
  {
    id: 5,
    title: "Mountain Wilderness Adventure",
    description: "Landscape and adventure photography capturing the beauty of the Rocky Mountains.",
    client: "Adventure Tourism Board",
    category: "nature",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464822759844-d150baec013c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    ],
    featured: false,
    published: true,
    completedAt: "2024-01-15T00:00:00Z",
    createdAt: "2024-01-16T00:00:00Z",
    updatedAt: "2024-01-16T00:00:00Z",
  },
  {
    id: 6,
    title: "Urban Street Photography",
    description: "Candid street photography project documenting life in Brooklyn neighborhoods.",
    client: "Personal Project",
    category: "street",
    coverImage: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop"
    ],
    featured: false,
    published: true,
    completedAt: "2024-01-10T00:00:00Z",
    createdAt: "2024-01-11T00:00:00Z",
    updatedAt: "2024-01-11T00:00:00Z",
  },
]

const categories = [
  { value: "all", label: "All Projects" },
  { value: "wedding", label: "Weddings" },
  { value: "portrait", label: "Portraits" },
  { value: "corporate", label: "Corporate" },
  { value: "fashion", label: "Fashion" },
  { value: "nature", label: "Nature" },
  { value: "street", label: "Street" },
]

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState(samplePortfolios)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter portfolios based on category
  const filteredPortfolios = portfolios.filter(portfolio => {
    const matchesCategory = selectedCategory === "all" || portfolio.category === selectedCategory
    return matchesCategory && portfolio.published
  })

  const featuredPortfolios = filteredPortfolios.filter(p => p.featured)
  const regularPortfolios = filteredPortfolios.filter(p => !p.featured)

  // Fetch portfolios from API (replace sample data later)
  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true)
      try {
        // const response = await fetch('/api/portfolio?published=true')
        // const data = await response.json()
        // setPortfolios(data)
        
        // For now, use sample data
        setTimeout(() => {
          setPortfolios(samplePortfolios)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching portfolios:', error)
        setIsLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
            Portfolio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A showcase of my finest work across weddings, portraits, corporate events, 
            and creative projects. Each story told through the lens.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select category" />
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

          <div className="text-gray-600 dark:text-gray-400">
            Showing {filteredPortfolios.length} project{filteredPortfolios.length !== 1 ? 's' : ''}
            {selectedCategory !== "all" && (
              <span className="ml-2">
                in <Badge variant="secondary" className="capitalize">{selectedCategory}</Badge>
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}

        {/* Portfolio Content */}
        {!isLoading && (
          <>
            {/* Featured Projects */}
            {featuredPortfolios.length > 0 && (
              <section className="mb-20">
                <div className="flex items-center mb-8">
                  <Star className="h-6 w-6 text-yellow-500 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Featured Projects</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPortfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                      <div className="relative h-80 overflow-hidden">
                        <Image
                          src={portfolio.coverImage}
                          alt={portfolio.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <Badge className="bg-yellow-500 text-white">
                            Featured
                          </Badge>
                          <Badge className="bg-white/90 text-gray-900 capitalize">
                            {portfolio.category}
                          </Badge>
                        </div>

                        {/* View Button */}
                        <div className="absolute bottom-4 right-4">
                          <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                            <Eye className="h-4 w-4 mr-2" />
                            View Project
                          </Button>
                        </div>
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 transition-colors">
                            {portfolio.title}
                          </h3>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {portfolio.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{portfolio.client}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(portfolio.completedAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Regular Projects */}
            {regularPortfolios.length > 0 && (
              <section>
                <div className="flex items-center mb-8">
                  <Camera className="h-6 w-6 text-gray-900 dark:text-white mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Work</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPortfolios.map((portfolio) => (
                    <Card key={portfolio.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="relative h-64 overflow-hidden rounded-t-xl">
                        <Image
                          src={portfolio.coverImage}
                          alt={portfolio.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                        
                        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 capitalize">
                          {portfolio.category}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 transition-colors line-clamp-1">
                          {portfolio.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-2">
                          {portfolio.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1 mb-1">
                              <User className="h-3 w-3" />
                              <span className="line-clamp-1">{portfolio.client}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(portfolio.completedAt)}</span>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" className="group">
                            View
                            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {filteredPortfolios.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try selecting a different category to explore more work.
                </p>
                <Button onClick={() => setSelectedCategory("all")}>
                  View All Projects
                </Button>
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl p-12 text-white">
            <Award className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-3xl font-light mb-4">
              Ready to Create Your Story?
            </h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Let's work together to create beautiful, timeless images that capture 
              your most important moments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Link href="/contact">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}