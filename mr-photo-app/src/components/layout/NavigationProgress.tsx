"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const prevPathnameRef = useRef(pathname)
  const timersRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    // Listen for navigation-start events (triggered on link click)
    const handleNavigationStart = () => {
      setIsLoading(true)
      setProgress(10) // Start immediately
      
      // Clear any existing timers
      timersRef.current.forEach(timer => clearTimeout(timer))
      timersRef.current = []

      // Simulate progress
      const timer1 = setTimeout(() => setProgress(40), 50)
      const timer2 = setTimeout(() => setProgress(70), 150)
      const timer3 = setTimeout(() => setProgress(90), 300)
      
      timersRef.current = [timer1, timer2, timer3]
    }

    // Listen for navigation-complete events
    const handleNavigationComplete = () => {
      setProgress(100)
      const completeTimer = setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 200)
      timersRef.current.push(completeTimer)
    }

    window.addEventListener('navigation-start', handleNavigationStart)
    window.addEventListener('navigation-complete', handleNavigationComplete)

    // Also handle pathname changes (fallback)
    if (prevPathnameRef.current !== pathname) {
      setIsLoading(true)
      setProgress(10)

      const timer1 = setTimeout(() => setProgress(40), 50)
      const timer2 = setTimeout(() => setProgress(70), 150)
      const timer3 = setTimeout(() => setProgress(90), 300)
      const completeTimer = setTimeout(() => {
        setProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          setProgress(0)
        }, 200)
      }, 500)

      prevPathnameRef.current = pathname
      timersRef.current = [timer1, timer2, timer3, completeTimer]
    }

    return () => {
      window.removeEventListener('navigation-start', handleNavigationStart)
      window.removeEventListener('navigation-complete', handleNavigationComplete)
      timersRef.current.forEach(timer => clearTimeout(timer))
      timersRef.current = []
    }
  }, [pathname, searchParams])

  if (!isLoading && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-300 ease-out shadow-lg shadow-blue-500/50"
        style={{
          width: `${progress}%`,
          opacity: isLoading ? 1 : 0,
        }}
      />
    </div>
  )
}

