// File: /src/components/layout/ConditionalLayout.tsx

"use client"

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import { CONTAINER_CLASS } from '@/lib/container'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if current page is admin page
  const isAdminPage = pathname.startsWith('/admin')
  
  // If it's an admin page, just return children without Header/Footer
  if (isAdminPage) {
    return <>{children}</>
  }
  
  // For public pages, include Header and Footer with wider spacing
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content with consistent container spacing */}
      <main className="flex-1">
        <div className={CONTAINER_CLASS}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}