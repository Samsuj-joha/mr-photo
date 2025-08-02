// File: /src/components/layout/ConditionalLayout.tsx

"use client"

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

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
      
      {/* Main Content with WIDER container spacing for more horizontal space */}
      <main className="flex-1">
        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}