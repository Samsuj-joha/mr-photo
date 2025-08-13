

// src/components/home/HomeSlider.tsx - Animated Sliding Version
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SliderImage {
  id: string
  title?: string
  description?: string
  imageUrl: string
  alt?: string
  linkUrl?: string
  linkText?: string
}

interface HomeSliderProps {
  images: SliderImage[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function HomeSlider({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: HomeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())

  // Auto-play functionality - FIXED
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        )
      }
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, images.length, autoPlayInterval, isTransitioning])

  // Reset start time when current index changes
  useEffect(() => {
    setStartTime(Date.now())
  }, [currentIndex])

  useEffect(() => {
    if (images.length > 0) {
      setIsLoading(false)
    }
  }, [images])

  const handleSlideChange = (newIndex: number) => {
    if (isTransitioning || newIndex === currentIndex) return
    
    setIsTransitioning(true)
    setCurrentIndex(newIndex)
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false)
    }, 100)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    handleSlideChange(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    handleSlideChange(newIndex)
  }

  const goToSlide = (index: number) => {
    handleSlideChange(index)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (isLoading || images.length === 0) {
    return (
      <div className="relative w-full h-[60vh] bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[70vh] lg:min-h-[85vh] overflow-hidden group rounded-md shadow-xl border border-border">
      
      {/* Image Container with Sliding Animation */}
      <div className="relative w-full h-full">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {images.map((image, index) => (
            <div key={image.id} className="relative w-full flex-shrink-0">
              <Image
                src={image.imageUrl}
                alt={image.alt || image.title || "Slider image"}
                width={1920}
                height={1080}
                className="w-full h-auto object-cover transition-all duration-500"
                priority={index === 0}
                sizes="100vw"
                style={{
                  maxHeight: '85vh',
                  minHeight: '60vh'
                }}
              />
              
              {/* Overlay for each image */}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content Overlay for current image */}
              {index === currentIndex && (image.title || image.description) && (
                <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                  <div className="text-center text-white px-6 max-w-4xl transform transition-all duration-1000 delay-300">
                    {image.title && (
                      <h1 className="text-4xl md:text-6xl font-light mb-4 animate-slide-up">
                        {image.title}
                      </h1>
                    )}
                    {image.description && (
                      <p className="text-lg md:text-xl mb-8 opacity-90 animate-slide-up-delay">
                        {image.description}
                      </p>
                    )}
                    {image.linkUrl && image.linkText && (
                      <Button 
                        size="lg" 
                        className="bg-white text-black hover:bg-gray-100 animate-slide-up-delay-2 hover:scale-105 transition-transform"
                        asChild
                      >
                        <a href={image.linkUrl}>
                          {image.linkText}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows with hover animations */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 transform"
            onClick={goToPrevious}
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 transform"
            onClick={goToNext}
            disabled={isTransitioning}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Animated Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                index === currentIndex 
                  ? "bg-white w-8 shadow-lg" 
                  : "bg-white/50 hover:bg-white/70 w-3"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Auto-play Control with animation */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 transform"
          onClick={toggleAutoPlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}

      {/* Enhanced Progress Bar - FIXED */}
      {isPlaying && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-to-r from-white to-blue-200 transition-all duration-100 ease-linear shadow-lg"
            style={{
              width: `${Math.min(100, ((Date.now() - startTime) / autoPlayInterval) * 100)}%`
            }}
          />
        </div>
      )}

      {/* Image Counter with animation */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 transform">
          <span className="transition-all duration-300">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}

      {/* Loading overlay during transition */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black/10 transition-opacity duration-150 pointer-events-none" />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
        
        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.6s both;
        }
      `}</style>
    </div>
  )
}