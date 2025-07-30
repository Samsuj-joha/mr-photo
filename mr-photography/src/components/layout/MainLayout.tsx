// File: /src/components/layout/MainLayout.tsx

"use client"

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  
  // Check if current page is admin page
  const isAdminPage = pathname.startsWith('/admin')
  
  // If it's an admin page, just return children without Header/Footer
  if (isAdminPage) {
    return <>{children}</>
  }
  
  // For public pages, include Header and Footer with consistent spacing
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />
      
      {/* Main Content with CONSISTENT container spacing */}
      <main className="flex-1">
        <div className="container mx-auto px-6 sm:px-8 lg:px-10 xl:px-10 2xl:px-10">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}