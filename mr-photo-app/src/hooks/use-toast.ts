// File: src/hooks/use-toast.ts
// Fixed toast hook for notifications

"use client"

import { useState } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString()
    const newToast: Toast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    // Console log for debugging
    if (variant === 'destructive') {
      console.error(`❌ ${title}: ${description}`)
      // Also show browser alert for errors during development
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Toast Error: ${title} - ${description}`)
      }
    } else {
      console.log(`✅ ${title}: ${description}`)
    }
  }

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return {
    toast,
    toasts,
    dismiss
  }
}