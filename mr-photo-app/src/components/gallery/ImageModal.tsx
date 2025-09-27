
// // src/app/gallery/components/ImageModal.tsx
// "use client"

// import { useState, useEffect, useCallback, useRef } from "react"
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
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const intervalRef = useRef<NodeJS.Timeout | null>(null)

//   // Initialize current index when modal opens
//   useEffect(() => {
//     if (isOpen && selectedIndex !== null) {
//       setCurrentIndex(selectedIndex)
//     }
//   }, [isOpen, selectedIndex])

//   // Handle body background when modal opens/closes
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.backgroundColor = '#000000'
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.backgroundColor = ''
//       document.body.style.overflow = ''
//     }

//     return () => {
//       document.body.style.backgroundColor = ''
//       document.body.style.overflow = ''
//     }
//   }, [isOpen])

//   // Auto-play slideshow with ref to avoid dependencies
//   useEffect(() => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current)
//     }

//     if (isPlaying && isOpen && images.length > 1) {
//       intervalRef.current = setInterval(() => {
//         setCurrentIndex(prev => {
//           const nextIndex = prev >= images.length - 1 ? 0 : prev + 1
//           return nextIndex
//         })
//       }, 3000)
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current)
//       }
//     }
//   }, [isPlaying, isOpen, images.length])

//   // Navigation functions
//   const goToPrevious = useCallback(() => {
//     setCurrentIndex(prev => prev <= 0 ? images.length - 1 : prev - 1)
//   }, [images.length])

//   const goToNext = useCallback(() => {
//     setCurrentIndex(prev => prev >= images.length - 1 ? 0 : prev + 1)
//   }, [images.length])

//   const togglePlayPause = useCallback(() => {
//     setIsPlaying(prev => !prev)
//   }, [])

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
//         togglePlayPause()
//         break
//     }
//   }, [isOpen, goToPrevious, goToNext, onClose, togglePlayPause])

//   useEffect(() => {
//     if (isOpen) {
//       document.addEventListener('keydown', handleKeyDown)
//     }
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown)
//     }
//   }, [isOpen, handleKeyDown])

//   // Notify parent of index changes (debounced)
//   useEffect(() => {
//     if (isOpen) {
//       const timeout = setTimeout(() => {
//         onIndexChange(currentIndex)
//       }, 100)
//       return () => clearTimeout(timeout)
//     }
//   }, [currentIndex, isOpen])

//   const openFlickr = useCallback(() => {
//     if (images[currentIndex]) {
//       const searchQuery = encodeURIComponent(`${images[currentIndex].title} ${images[currentIndex].category}`)
//       const flickrUrl = `https://www.flickr.com/search/?text=${searchQuery}`
//       window.open(flickrUrl, '_blank')
//     }
//   }, [images, currentIndex])

//   if (!isOpen || selectedIndex === null || images.length === 0) {
//     return null
//   }

//   const activeImage = images[currentIndex]

//   return (
//     <>
//       {/* Full screen overlay to cover everything */}
//       <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
//         {/* Hidden title for accessibility */}
//         <div className="sr-only">
//           Image Gallery Viewer - {activeImage.title}
//         </div>

//         {/* Close button */}
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={onClose}
//           className="fixed top-4 right-4 z-[10000] text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12"
//         >
//           <X className="h-6 w-6" />
//         </Button>

//         {/* Control buttons - top right */}
//         <div className="fixed top-4 right-20 z-[10000] flex gap-2">
//           {/* Play/Pause button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={togglePlayPause}
//             className="text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12"
//             title={isPlaying ? "Pause slideshow" : "Start slideshow"}
//           >
//             {isPlaying ? (
//               <Pause className="h-6 w-6" />
//             ) : (
//               <Play className="h-6 w-6" />
//             )}
//           </Button>

//           {/* Flickr button */}
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={openFlickr}
//             className="text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12"
//             title="Search on Flickr"
//           >
//             <ExternalLink className="h-6 w-6" />
//           </Button>
//         </div>

//         {/* Main image container - reduced size */}
//         <div className="w-full h-full flex items-center justify-center px-16 py-20">
//           <div className="relative max-w-[70vw] max-h-[60vh]">
//             <Image
//               src={activeImage.imageUrl}
//               alt={activeImage.title}
//               width={900}
//               height={600}
//               className="object-contain w-full h-full max-w-[70vw] max-h-[60vh]"
//               sizes="70vw"
//               priority
//               unoptimized={activeImage.imageUrl.includes('cloudinary.com')}
//             />
//           </div>
//         </div>

//         {/* Navigation buttons */}
//         {images.length > 1 && (
//           <>
//             {/* Previous button */}
//             <Button
//               variant="ghost"
//               size="lg"
//               onClick={goToPrevious}
//               className="fixed left-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/80 h-14 w-14 rounded-full z-[10000]"
//               title="Previous image (←)"
//             >
//               <ChevronLeft className="h-8 w-8" />
//             </Button>

//             {/* Next button */}
//             <Button
//               variant="ghost"
//               size="lg"
//               onClick={goToNext}
//               className="fixed right-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/80 h-14 w-14 rounded-full z-[10000]"
//               title="Next image (→)"
//             >
//               <ChevronRight className="h-8 w-8" />
//             </Button>
//           </>
//         )}

//         {/* Image info overlay - adjusted for thumbnail spacing */}
//         <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 z-[9999]">
//           <div className="text-white max-w-7xl mx-auto mb-20">
//             <h3 className="text-xl font-semibold mb-3">{activeImage.title}</h3>
//             <div className="flex items-center justify-between text-sm opacity-90">
//               <div className="flex items-center gap-4">
//                 <span className="capitalize bg-white/10 px-3 py-1 rounded-full text-xs">
//                   {activeImage.category}
//                 </span>
//                 <span className="capitalize bg-white/10 px-3 py-1 rounded-full text-xs">
//                   {activeImage.country}
//                 </span>
//                 <span className="bg-red-500/20 px-3 py-1 rounded-full text-xs">
//                   ❤️ {activeImage.loves}
//                 </span>
//               </div>
//               <div className="text-xs bg-white/10 px-3 py-1 rounded-full">
//                 {currentIndex + 1} of {images.length}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Progress indicator */}
//         {isPlaying && (
//           <div className="fixed top-0 left-0 right-0 h-2 bg-white/20 z-[10000]">
//             <div className="h-full bg-white animate-pulse" />
//           </div>
//         )}

//         {/* Thumbnail strip - moved below main image */}
//         {images.length > 1 && (
//           <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 max-w-4xl overflow-x-auto scrollbar-hide z-[10000] p-3 bg-black/30 rounded-lg backdrop-blur-sm">
//             {images.map((image, index) => (
//               <button
//                 key={image.id}
//                 onClick={() => setCurrentIndex(index)}
//                 className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
//                   index === currentIndex 
//                     ? 'ring-2 ring-white opacity-100 scale-110 shadow-lg' 
//                     : 'opacity-70 hover:opacity-90 hover:scale-105'
//                 }`}
//               >
//                 <Image
//                   src={image.imageUrl}
//                   alt={image.title}
//                   fill
//                   className="object-cover"
//                   sizes="80px"
//                   unoptimized={image.imageUrl.includes('cloudinary.com')}
//                 />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </>
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

  // Disable right-click context menu and keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable common save shortcuts
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 's' || e.key === 'S' || 
         e.key === 'a' || e.key === 'A' ||
         e.key === 'u' || e.key === 'U' ||
         e.key === 'i' || e.key === 'I')
      ) {
        e.preventDefault()
        return false
      }
      
      // Disable F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+Shift+I (Developer Tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        return false
      }
      
      // Disable Ctrl+Shift+C (Inspector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault()
        return false
      }

      // Disable Ctrl+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault()
        return false
      }
    }

    const disableTextSelection = (e: MouseEvent) => {
      e.preventDefault()
    }

    const disableDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    document.addEventListener('contextmenu', disableContextMenu)
    document.addEventListener('keydown', disableKeyboardShortcuts)
    document.addEventListener('selectstart', disableTextSelection)
    document.addEventListener('dragstart', disableDragStart)

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu)
      document.removeEventListener('keydown', disableKeyboardShortcuts)
      document.removeEventListener('selectstart', disableTextSelection)
      document.removeEventListener('dragstart', disableDragStart)
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

  // Keyboard navigation (modified to work with protection)
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
      <div 
        className="fixed inset-0 bg-black z-[9999] flex items-center justify-center select-none"
        style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none'
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Hidden title for accessibility */}
        <div className="sr-only">
          Image Gallery Viewer - {activeImage.title}
        </div>

        {/* Invisible overlay to prevent interactions with image */}
        <div 
          className="absolute inset-0 z-[9998] pointer-events-none"
          style={{ 
            background: 'transparent',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        />

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="fixed top-4 right-4 z-[10000] text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12 pointer-events-auto"
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
            className="text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12 pointer-events-auto"
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
            className="text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12 pointer-events-auto"
            title="Search on Flickr"
          >
            <ExternalLink className="h-6 w-6" />
          </Button>
        </div>

        {/* Main image container - reduced size with protection */}
        <div className="w-full h-full flex items-center justify-center px-16 py-20">
          <div className="relative max-w-[70vw] max-h-[60vh]">
            {/* Protection overlay */}
            <div 
              className="absolute inset-0 z-10 bg-transparent cursor-default"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none'
              }}
            />
            
            {/* Watermark overlay */}
            <div 
              className="absolute inset-0 z-5 pointer-events-none"
              style={{
                background: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 100px,
                    rgba(255, 255, 255, 0.02) 100px,
                    rgba(255, 255, 255, 0.02) 101px
                  ),
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 100px,
                    rgba(255, 255, 255, 0.02) 100px,
                    rgba(255, 255, 255, 0.02) 101px
                  )
                `
              }}
            >
              {/* Subtle watermark text */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/5 text-6xl font-bold rotate-45 select-none pointer-events-none">
                MR-PHOTOGRAPHY
              </div>
            </div>
            
            <Image
              src={activeImage.imageUrl}
              alt={activeImage.title}
              width={900}
              height={600}
              className="object-contain w-full h-full max-w-[70vw] max-h-[60vh] select-none"
              sizes="70vw"
              priority
              unoptimized={activeImage.imageUrl.includes('cloudinary.com')}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none',
                pointerEvents: 'none'
              }}
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
              className="fixed left-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/80 h-14 w-14 rounded-full z-[10000] pointer-events-auto"
              title="Previous image (←)"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Next button */}
            <Button
              variant="ghost"
              size="lg"
              onClick={goToNext}
              className="fixed right-6 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-black/80 h-14 w-14 rounded-full z-[10000] pointer-events-auto"
              title="Next image (→)"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Image info overlay - adjusted for thumbnail spacing */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 z-[9999] pointer-events-none">
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
          <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 max-w-4xl overflow-x-auto scrollbar-hide z-[10000] p-3 bg-black/30 rounded-lg backdrop-blur-sm pointer-events-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-2 ring-white opacity-100 scale-110 shadow-lg' 
                    : 'opacity-70 hover:opacity-90 hover:scale-105'
                }`}
                onContextMenu={(e) => e.preventDefault()}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.title}
                  fill
                  className="object-cover select-none"
                  sizes="80px"
                  unoptimized={image.imageUrl.includes('cloudinary.com')}
                  draggable={false}
                  style={{
                    WebkitUserSelect: 'none',
                    MozUserSelect: 'none',
                    msUserSelect: 'none',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                    pointerEvents: 'none'
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* CSS to disable print media and additional protections */}
        <style jsx>{`
          @media print {
            * {
              display: none !important;
            }
          }
          
          img {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-user-drag: none;
            -webkit-touch-callout: none;
            pointer-events: none;
          }
        `}</style>
      </div>
    </>
  )
}