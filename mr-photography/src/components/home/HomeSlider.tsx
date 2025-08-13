// src/components/home/HomeSlider.tsx
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

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, images.length, autoPlayInterval])

  useEffect(() => {
    if (images.length > 0) {
      setIsLoading(false)
    }
  }, [images])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
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

  const currentImage = images[currentIndex]

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[85vh] max-h-[800px] overflow-hidden group rounded-md shadow-xl border border-border">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.alt || currentImage.title || "Slider image"}
          fill
          className="object-cover transition-opacity duration-500"
          priority={currentIndex === 0}
          sizes="100vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content Overlay */}
        {(currentImage.title || currentImage.description) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-4xl">
              {currentImage.title && (
                <h1 className="text-4xl md:text-6xl font-light mb-4 animate-fade-in">
                  {currentImage.title}
                </h1>
              )}
              {currentImage.description && (
                <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-delay">
                  {currentImage.description}
                </p>
              )}
              {currentImage.linkUrl && currentImage.linkText && (
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 animate-fade-in-delay-2"
                  asChild
                >
                  <a href={currentImage.linkUrl}>
                    {currentImage.linkText}
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Auto-play Control */}
      {images.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={toggleAutoPlay}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}

      {/* Progress Bar (if auto-playing) */}
      {isPlaying && images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  )
}