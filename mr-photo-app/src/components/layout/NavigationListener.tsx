"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

// This component helps trigger loading states immediately on navigation
export function NavigationListener() {
  const pathname = usePathname()

  useEffect(() => {
    // Dispatch custom event when navigation starts
    // This can be used by other components to show loading immediately
    const event = new CustomEvent('navigation-start', {
      detail: { pathname }
    })
    window.dispatchEvent(event)

    // Dispatch event when navigation completes
    const completeEvent = new CustomEvent('navigation-complete', {
      detail: { pathname }
    })
    
    // Small delay to ensure page has rendered
    const timer = setTimeout(() => {
      window.dispatchEvent(completeEvent)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}

