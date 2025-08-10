// src/app/components/feature/FeatureImageModal.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface Feature {
  id: string
  title: string
  description: string
  image: string
  published: boolean
}

interface FeatureImageModalProps {
  feature: Feature | null
  isOpen: boolean
  onClose: () => void
}

export function FeatureImageModal({
  feature,
  isOpen,
  onClose
}: FeatureImageModalProps) {

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

  // Keyboard navigation for closing
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !feature) {
    return null
  }

  return (
    <>
      {/* Full screen overlay */}
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
          Feature Image Viewer - {feature.title}
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="fixed top-4 right-4 z-[10000] text-white hover:bg-white/20 bg-black/80 rounded-full w-12 h-12 pointer-events-auto"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Main content container */}
        <div className="w-full h-full flex flex-col items-center justify-center px-8 py-16 max-w-6xl mx-auto">
          
          {/* Image container with protection */}
          <div className="relative w-full max-w-4xl max-h-[60vh] mb-8">
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
              src={feature.image}
              alt={feature.title}
              width={800}
              height={600}
              className="object-contain w-full h-full max-h-[60vh] select-none rounded-lg"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
              unoptimized={feature.image.includes('cloudinary.com')}
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

          {/* Content section */}
          <div className="w-full max-w-4xl text-center text-white px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {feature.title}
            </h2>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <p className="text-lg md:text-xl leading-relaxed text-gray-200">
                {feature.description}
              </p>
            </div>
          </div>
        </div>

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