"use client"

import { useSession } from "next-auth/react"
import { redirect, usePathname } from "next/navigation"
import { ReactNode, Suspense } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { LoadingBar } from "@/components/admin/LoadingBar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  // Allow login page to be accessed without authentication
  const isLoginPage = pathname === '/admin/login'
  
  // If it's the login page, don't apply authentication checks and layouts
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading spinner while checking authentication (for other admin pages)
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated or not admin (for protected admin pages)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loading Bar */}
      <LoadingBar />
      
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Header */}
        <AdminHeader />
        
        {/* Main Content with gap from edges */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-8 sm:px-10 lg:px-12">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
                </div>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}