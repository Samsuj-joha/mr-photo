"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, User, Camera, Heart } from "lucide-react"

interface AboutData {
  id: string
  name: string
  description: string
  profileImage?: string
  journeyTitle: string
  journeyContent: string
  valuesTitle: string
  valuesContent: string
  published: boolean
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      const response = await fetch('/api/about')
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      } else {
        setError("About page not found")
      }
    } catch (error) {
      console.error('Failed to load about data:', error)
      setError("Failed to load about page")
    } finally {
      setIsLoading(false)
    }
  }

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null
      
      // Handle bold text **text**
      const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      
      return (
        <p 
          key={index} 
          className="mb-4 last:mb-0 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      )
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">About Page</h1>
          <p className="text-gray-600 mb-6">{error || "Content not available"}</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">

      <div className="py-8">
        
        {/* Section 1: Basic Information */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Profile Image */}
            <div className="lg:order-1">
              {aboutData.profileImage ? (
                <div className="aspect-[5/3] relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={aboutData.profileImage}
                    alt={aboutData.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="h-20 w-20 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="lg:order-2 space-y-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Photographer</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900">
                {aboutData.name}
              </h2>
              
              <div className="text-gray-700 text-md text-justify space-y-4">
                {formatText(aboutData.description)}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Photography Journey */}
        <section className="mb-12">
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <Camera className="h-4 w-4" />
                <span>My Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
                {aboutData.journeyTitle}
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 md:p-8">
              <div className="text-gray-700 text-lg">
                {formatText(aboutData.journeyContent)}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Values & Approach */}
        <section className="mb-12">
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <Heart className="h-4 w-4" />
                <span>Philosophy</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
                {aboutData.valuesTitle}
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 md:p-8">
              <div className="text-lg">
                {formatText(aboutData.valuesContent)}
              </div>
            </div>
          </div>
        </section>

        {/* Simple Call to Action */}
        <section>
          <div className="text-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-gray-600 mb-8">
              Let's create something beautiful together
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Get In Touch
              </Link>
              
              <Link
                href="/portfolio"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                View Portfolio
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}