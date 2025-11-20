

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
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())

  // Filter out images that failed to load - MUST be defined before useEffects that use it
  const validImages = images.filter(img => !failedImages.has(img.id))

  // Auto-play functionality - FIXED
  useEffect(() => {
    if (!isPlaying || validImages.length <= 1) return

    const interval = setInterval(() => {
      if (!isTransitioning) {
        setCurrentIndex((prevIndex) => 
          prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
        )
      }
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, validImages.length, autoPlayInterval, isTransitioning])

  // Reset start time when current index changes
  useEffect(() => {
    setStartTime(Date.now())
  }, [currentIndex])

  useEffect(() => {
    if (images.length > 0) {
      setIsLoading(false)
    }
  }, [images])
  
  // Adjust current index if current image was filtered out
  useEffect(() => {
    if (validImages.length > 0 && currentIndex >= validImages.length) {
      setCurrentIndex(0)
    }
  }, [validImages.length, currentIndex])

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
    const newIndex = currentIndex === 0 ? validImages.length - 1 : currentIndex - 1
    handleSlideChange(newIndex)
  }

  const goToNext = () => {
    const newIndex = currentIndex === validImages.length - 1 ? 0 : currentIndex + 1
    handleSlideChange(newIndex)
  }

  const goToSlide = (index: number) => {
    handleSlideChange(index)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  if (isLoading || validImages.length === 0) {
    return (
      <div className="relative w-full h-[60vh] bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          {validImages.length === 0 && images.length > 0 
            ? "No valid slider images available" 
            : "Loading..."}
        </div>
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
          {validImages.map((image, index) => {
            // Validate and sanitize image URL
            let imageSrc = image.imageUrl || ''
            
            // Ensure URL is valid
            if (imageSrc && !imageSrc.startsWith('http://') && !imageSrc.startsWith('https://')) {
              console.warn('⚠️ Invalid image URL format:', imageSrc)
              imageSrc = '' // Will trigger error handler
            }
            
            return (
            <div key={image.id} className="relative w-full flex-shrink-0">
              <Image
                src={imageSrc || '/placeholder-image.jpg'} // Fallback to placeholder if invalid
                alt={image.alt || image.title || "Slider image"}
                width={1920}
                height={1080}
                className="w-full h-auto object-cover transition-all duration-500"
                priority={index === 0}
                sizes="100vw"
                unoptimized={true}
                onError={(e) => {
                  try {
                    // Log detailed error information
                    const target = e.currentTarget as HTMLImageElement
                    const errorInfo: Record<string, any> = {
                      url: image.imageUrl || 'No URL',
                      id: image.id || 'No ID',
                      title: image.title || 'No title',
                    }
                    
                    // Safely access target properties
                    try {
                      errorInfo.naturalWidth = target?.naturalWidth ?? 0
                      errorInfo.naturalHeight = target?.naturalHeight ?? 0
                      errorInfo.complete = target?.complete ?? false
                      errorInfo.src = target?.src ?? 'No src'
                      errorInfo.currentSrc = target?.currentSrc ?? 'No currentSrc'
                      errorInfo.error = target?.error ? 'Image element has error property' : 'No error property'
                    } catch (targetError) {
                      errorInfo.targetError = targetError instanceof Error ? targetError.message : 'Unknown target error'
                    }
                    
                    // Add event information
                    try {
                      errorInfo.eventType = e.type
                      errorInfo.timeStamp = e.timeStamp
                    } catch (eventError) {
                      errorInfo.eventError = eventError instanceof Error ? eventError.message : 'Unknown event error'
                    }
                    
                    // Only log full details if it's not a 404 (we'll handle 404s separately)
                    // For 404s, we'll log a cleaner message after the fetch test
                    const isLikely404 = errorInfo.naturalWidth === 0 && errorInfo.naturalHeight === 0 && errorInfo.complete === true
                    
                    if (!isLikely404) {
                      console.error('❌ Failed to load slider image:', JSON.stringify(errorInfo, null, 2))
                    }
                    
                    // Mark image as failed and hide it
                    setFailedImages(prev => new Set(prev).add(image.id))
                    if (target) {
                      target.style.display = 'none'
                    }
                    
                    // Test the URL directly to see what the actual issue is (works in both dev and production)
                    const testImageLoad = async () => {
                      try {
                        if (!image.imageUrl) {
                          console.error('❌ Image URL is empty or undefined')
                          return
                        }
                        
                        // Validate URL format
                        let testUrl: URL
                        try {
                          testUrl = new URL(image.imageUrl)
                        } catch (urlError) {
                          console.error('❌ Invalid URL format:', image.imageUrl, urlError)
                          return
                        }
                        
                        // Try fetching the image to see the actual error
                        const response = await fetch(image.imageUrl, { 
                          method: 'GET',
                          mode: 'cors',
                          cache: 'no-cache',
                          headers: {
                            'Accept': 'image/*',
                          }
                        })
                        
                        const fetchInfo = {
                          status: response.status,
                          statusText: response.statusText,
                          ok: response.ok,
                          contentType: response.headers.get('content-type'),
                          cors: response.headers.get('access-control-allow-origin'),
                          url: image.imageUrl
                        }
                        
                        if (response.status === 404) {
                          // Image doesn't exist in Cloudinary - this is a data integrity issue
                          console.warn(`⚠️ Image not found (404) in Cloudinary: ${image.imageUrl}`)
                          console.warn(`   Image ID: ${image.id} - This image should be removed from the database.`)
                          console.warn(`   Use the admin panel's verification tool to clean up missing images.`)
                        } else {
                          console.log('🔍 Image fetch test result:', JSON.stringify(fetchInfo, null, 2))
                          
                          if (!response.ok) {
                            console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`)
                            const errorText = await response.text().catch(() => 'Could not read error response')
                            if (errorText) {
                              console.error('❌ Error response body:', errorText.substring(0, 200))
                            }
                          }
                        }
                      } catch (fetchError) {
                        console.error('❌ Fetch test failed:', {
                          error: fetchError instanceof Error ? fetchError.message : 'Unknown error',
                          stack: fetchError instanceof Error ? fetchError.stack : undefined,
                          url: image.imageUrl
                        })
                      }
                    }
                    
                    // Run the test
                    testImageLoad()
                  } catch (outerError) {
                    // Fallback error handling if everything else fails
                    console.error('❌ Critical error in image error handler:', {
                      error: outerError instanceof Error ? outerError.message : 'Unknown error',
                      stack: outerError instanceof Error ? outerError.stack : undefined,
                      imageId: image?.id,
                      imageUrl: image?.imageUrl
                    })
                    
                    // Still try to mark as failed
                    if (image?.id) {
                      setFailedImages(prev => new Set(prev).add(image.id))
                    }
                  }
                }}
                onLoad={(e) => {
                  // Log successful loads for debugging
                  if (process.env.NODE_ENV === 'development') {
                    console.log('✅ Slider image loaded successfully:', image.imageUrl)
                  }
                }}
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
          )
          })}
        </div>
      </div>

      {/* Navigation Arrows with hover animations */}
      {validImages.length > 1 && (
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
      {validImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
          {validImages.map((_, index) => (
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
      {validImages.length > 1 && (
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
      {isPlaying && validImages.length > 1 && (
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
      {validImages.length > 1 && (
        <div className="absolute top-4 left-4 bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 transform">
          <span className="transition-all duration-300">
            {currentIndex + 1} / {validImages.length}
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