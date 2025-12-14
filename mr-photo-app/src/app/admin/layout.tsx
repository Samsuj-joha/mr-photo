"use client"

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, Suspense, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { LoadingBar } from "@/components/admin/LoadingBar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  
  // Allow login page to be accessed without authentication
  const isLoginPage = pathname === '/admin/login'
  
  // Redirect to login if not authenticated or not admin (for protected admin pages)
  // This hook must be called unconditionally (before any early returns)
  useEffect(() => {
    // Only redirect if not on login page and not authenticated/admin
    if (!isLoginPage && (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "ADMIN"))) {
      router.push("/admin/login")
    }
  }, [session, status, router, isLoginPage])
  
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
  
  // Don't render admin UI if not authenticated
  if (!session || session.user?.role !== "ADMIN") {
    return null
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