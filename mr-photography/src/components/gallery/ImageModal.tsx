// // src/app/gallery/components/ImageModal.tsx
// "use client"

// import { useState, useEffect, useCallback } from "react"
// import { Dialog, DialogContent } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { 
//   ChevronLeft, 
//   ChevronRight, 
//   Play, 
//   Pause, 
//   ExternalLink, 
//   X 
// } from "lucide-react"
// import Image from "next/image"
// import { GalleryImage } from "../page"

// interface ImageModalProps {
//   images: GalleryImage[]
//   selectedIndex: number | null
//   isOpen: boolean
//   onClose: () => void
//   onIndexChange: (index: number) => void
// }

// export function ImageModal({
//   images,
//   selectedIndex,
//   isOpen,
//   onClose,
//   onIndexChange
// }: ImageModalProps) {
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0)

//   // Update current index when selectedIndex changes
//   useEffect(() => {
//     if (selectedIndex !== null) {
//       setCurrentIndex(selectedIndex)
//     }
//   }, [selectedIndex])

//   // Auto-play slideshow
//   useEffect(() => {
//     if (!isPlaying || !isOpen || images.length === 0) return

//     const interval = setInterval(() => {
//       setCurrentIndex(prev => {
//         const nextIndex = prev >= images.length - 1 ? 0 : prev + 1
//         onIndexChange(nextIndex)
//         return nextIndex
//       })
//     }, 3000) // 3 seconds per image

//     return () => clearInterval(interval)
//   }, [isPlaying, isOpen, images.length, onIndexChange])

//   // Keyboard navigation
//   const handleKeyDown = useCallback((event: KeyboardEvent) => {
//     if (!isOpen) return

//     switch (event.key) {
//       case 'ArrowLeft':
//         event.preventDefault()
//         goToPrevious()
//         break
//       case 'ArrowRight':
//         event.preventDefault()
//         goToNext()
//         break
//       case 'Escape':
//         event.preventDefault()
//         onClose()
//         break
//       case ' ':
//         event.preventDefault()
//         setIsPlaying(prev => !prev)
//         break
//     }
//   }, [isOpen])

//   useEffect(() => {
//     document.addEventListener('keydown', handleKeyDown)
//     return () => document.removeEventListener('keydown', handleKeyDown)
//   }, [handleKeyDown])

//   const goToPrevious = () => {
//     const newIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1
//     setCurrentIndex(newIndex)
//     onIndexChange(newIndex)
//   }

//   const goToNext = () => {
//     const newIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1
//     setCurrentIndex(newIndex)
//     onIndexChange(newIndex)
//   }

//   const togglePlayPause = () => {
//     setIsPlaying(prev => !prev)
//   }

//   const openFlickr = () => {
//     if (images[currentIndex]) {
//       const searchQuery = encodeURIComponent(`${images[currentIndex].title} ${images[currentIndex].category}`)
//       const flickrUrl = `https://www.flickr.com/search/?text=${searchQuery}`
//       window.open(flickrUrl, '_blank')
//     }
//   }

//   if (!isOpen || selectedIndex === null || images.length === 0) {
//     return null
//   }

//   const currentImage = images[currentIndex]

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black">
//         <div className="relative w-full h-full flex items-center justify-center">
          
//           {/* Close button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={onClose}
//             className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 bg-black/50"
//           >
//             <X className="h-6 w-6" />
//           </Button>

//           {/* Control buttons - top right */}
//           <div className="absolute top-4 right-16 z-50 flex gap-2">
//             {/* Play/Pause button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={togglePlayPause}
//               className="text-white hover:bg-white/20 bg-black/50"
//               title={isPlaying ? "Pause slideshow" : "Start slideshow"}
//             >
//               {isPlaying ? (
//                 <Pause className="h-5 w-5" />
//               ) : (
//                 <Play className="h-5 w-5" />
//               )}
//             </Button>

//             {/* Flickr button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={openFlickr}
//               className="text-white hover:bg-white/20 bg-black/50"
//               title="Search on Flickr"
//             >
//               <ExternalLink className="h-5 w-5" />
//             </Button>
//           </div>

//           {/* Main image */}
//           <div className="relative w-full h-full flex items-center justify-center">
//             <Image
//               src={currentImage.imageUrl}
//               alt={currentImage.title}
//               fill
//               className="object-contain"
//               sizes="100vw"
//               priority
//               unoptimized={currentImage.imageUrl.includes('cloudinary.com')}
//             />
//           </div>

//           {/* Navigation buttons */}
//           {images.length > 1 && (
//             <>
//               {/* Previous button */}
//               <Button
//                 variant="ghost"
//                 size="lg"
//                 onClick={goToPrevious}
//                 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 h-12 w-12 rounded-full"
//                 title="Previous image (←)"
//               >
//                 <ChevronLeft className="h-8 w-8" />
//               </Button>

//               {/* Next button */}
//               <Button
//                 variant="ghost"
//                 size="lg"
//                 onClick={goToNext}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 h-12 w-12 rounded-full"
//                 title="Next image (→)"
//               >
//                 <ChevronRight className="h-8 w-8" />
//               </Button>
//             </>
//           )}

//           {/* Image info overlay */}
//           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
//             <div className="text-white">
//               <h3 className="text-xl font-semibold mb-2">{currentImage.title}</h3>
//               <div className="flex items-center justify-between text-sm opacity-90">
//                 <div className="flex items-center gap-4">
//                   <span className="capitalize">{currentImage.category}</span>
//                   <span className="capitalize">{currentImage.country}</span>
//                   <span>❤️ {currentImage.loves}</span>
//                 </div>
//                 <div className="text-xs">
//                   {currentIndex + 1} of {images.length}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Progress indicator */}
//           {isPlaying && (
//             <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
//               <div className="h-full bg-white animate-pulse" />
//             </div>
//           )}

//           {/* Thumbnail strip for navigation */}
//           {images.length > 1 && (
//             <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto scrollbar-hide">
//               {images.map((image, index) => (
//                 <button
//                   key={image.id}
//                   onClick={() => {
//                     setCurrentIndex(index)
//                     onIndexChange(index)
//                   }}
//                   className={`relative w-12 h-8 flex-shrink-0 rounded overflow-hidden transition-all ${
//                     index === currentIndex 
//                       ? 'ring-2 ring-white opacity-100' 
//                       : 'opacity-60 hover:opacity-80'
//                   }`}
//                 >
//                   <Image
//                     src={image.imageUrl}
//                     alt={image.title}
//                     fill
//                     className="object-cover"
//                     sizes="48px"
//                     unoptimized={image.imageUrl.includes('cloudinary.com')}
//                   />
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Keyboard shortcuts info */}
//           <div className="absolute top-20 right-4 text-white/60 text-xs space-y-1 hidden md:block">
//             <div>← → Navigate</div>
//             <div>Space Play/Pause</div>
//             <div>Esc Close</div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }





// src/app/gallery/components/ImageModal.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  ExternalLink, 
  X 
} from "lucide-react"
import Image from "next/image"
import { GalleryImage } from "../page"

interface ImageModalProps {
  images: GalleryImage[]
  selectedIndex: number | null
  isOpen: boolean
  onClose: () => void
  onIndexChange: (index: number) => void
}

export function ImageModal({
  images,
  selectedIndex,
  isOpen,
  onClose,
  onIndexChange
}: ImageModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize current index when modal opens
  useEffect(() => {
    if (isOpen && selectedIndex !== null) {
      setCurrentIndex(selectedIndex)
    }
  }, [isOpen, selectedIndex])

  // Handle body background when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.backgroundColor = '#000000'
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.backgroundColor = ''
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.backgroundColor = ''
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Auto-play slideshow with ref to avoid dependencies
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (isPlaying && isOpen && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = prev >= images.length - 1 ? 0 : prev + 1
          return nextIndex
        })
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isOpen, images.length])

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev <= 0 ? images.length - 1 : prev - 1)
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev >= images.length - 1 ? 0 : prev + 1)
  }, [images.length])

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        goToPrevious()
        break
      case 'ArrowRight':
        event.preventDefault()
        goToNext()
        break
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      case ' ':
        event.preventDefault()
        togglePlayPause()
        break
    }
  }, [isOpen, goToPrevious, goToNext, onClose, togglePlayPause])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Notify parent of index changes (debounced)
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        onIndexChange(currentIndex)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, isOpen])

  const openFlickr = useCallback(() => {
    if (images[currentIndex]) {
      const searchQuery = encodeURIComponent(`${images[currentIndex].title} ${images[currentIndex].category}`)
      const flickrUrl = `https://www.flickr.com/search/?text=${searchQuery}`
      window.open(flickrUrl, '_blank')
    }
  }, [images, currentIndex])

  if (!isOpen || selectedIndex === null || images.length === 0) {
    return null
  }

  const activeImage = images[currentIndex]

  return (
    <>
      {/* Full screen overlay to cover everything */}
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        {/* Hidden title for accessibility */}
        <div className="sr-only">
          Image Gallery Viewer - {activeImage.title}
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="fixed top-4 right-4 z-[10000] text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Control buttons - top right */}
        <div className="fixed top-4 right-20 z-[10000] flex gap-2">
          {/* Play/Pause button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayPause}
            className="text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12"
            title={isPlaying ? "Pause slideshow" : "Start slideshow"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          {/* Flickr button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={openFlickr}
            className="text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12"
            title="Search on Flickr"
          >
            <ExternalLink className="h-6 w-6" />
          </Button>
        </div>

        {/* Main image container - reduced size */}
        <div className="w-full h-full flex items-center justify-center px-16 py-20">
          <div className="relative max-w-[70vw] max-h-[60vh]">
            <Image
              src={activeImage.imageUrl}
              alt={activeImage.title}
              width={900}
              height={600}
              className="object-contain w-full h-full max-w-[70vw] max-h-[60vh]"
              sizes="70vw"
              priority
              unoptimized={activeImage.imageUrl.includes('cloudinary.com')}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            {/* Previous button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPrevious}
              className="fixed left-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/80 h-14 w-14 rounded-full z-[10000]"
              title="Previous image (←)"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Next button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={goToNext}
              className="fixed right-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/80 h-14 w-14 rounded-full z-[10000]"
              title="Next image (→)"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image info overlay - adjusted for thumbnail spacing */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 z-[9999]">
          <div className="text-white max-w-7xl mx-auto mb-20">
            <h3 className="text-xl font-semibold mb-3">{activeImage.title}</h3>
            <div className="flex items-center justify-between text-sm opacity-90">
              <div className="flex items-center gap-4">
                <span className="capitalize bg-white/10 px-3 py-1 rounded-full text-xs">
                  {activeImage.category}
                </span>
                <span className="capitalize bg-white/10 px-3 py-1 rounded-full text-xs">
                  {activeImage.country}
                </span>
                <span className="bg-red-500/20 px-3 py-1 rounded-full text-xs">
                  ❤️ {activeImage.loves}
                </span>
              </div>
              <div className="text-xs bg-white/10 px-3 py-1 rounded-full">
                {currentIndex + 1} of {images.length}
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        {isPlaying && (
          <div className="fixed top-0 left-0 right-0 h-2 bg-white/20 z-[10000]">
            <div className="h-full bg-white animate-pulse" />
          </div>
        )}

        {/* Thumbnail strip - moved below main image */}
        {images.length > 1 && (
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 max-w-4xl overflow-x-auto scrollbar-hide z-[10000] p-3 bg-black/30 rounded-lg backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-2 ring-white opacity-100 scale-110 shadow-lg' 
                    : 'opacity-70 hover:opacity-90 hover:scale-105'
                }`}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={image.imageUrl.includes('cloudinary.com')}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}