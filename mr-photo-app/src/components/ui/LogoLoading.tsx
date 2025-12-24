"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface LogoLoadingProps {
  className?: string
}

export function LogoLoading({ className = "" }: LogoLoadingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Create a continuous animation loop
    const interval = setInterval(() => {
      setProgress((prev) => {
        // When it reaches 100%, reset to 0 for continuous loop
        if (prev >= 100) {
          return 0
        }
        // Increment progress smoothly (2% per update)
        return prev + 2
      })
    }, 50) // Update every 50ms for smooth animation

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-background ${className}`}>
      {/* Logo */}
      <div className="mb-8 animate-fade-in">
        <div className="relative w-32 h-24 md:w-40 md:h-30 lg:w-48 lg:h-36">
          <Image
            src="/images/logo.png"
            alt="MR Photography Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 md:w-80 lg:w-96 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
        {/* Animated Progress Bar */}
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-linear relative overflow-hidden"
          style={{
            width: `${progress}%`,
          }}
        >
          {/* Shimmer effect for extra polish */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}

