"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Images,
  Briefcase,
  FileText,
  Users,
  Settings,
  Camera,
  Globe,
  BarChart3,
  FileIcon,
  Mail,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"

const navigation = [
  { 
    name: "Dashboard", 
    href: "/admin/dashboard", 
    icon: LayoutDashboard,
    badge: null
  },
  { 
    name: "Home Slider", 
    href: "/admin/home-slider", 
    icon: Camera,
    badge: null
  },
  { 
    name: "Gallery", 
    href: "/admin/gallery", 
    icon: Images,
    badge: "12",
    subItems: [
      { name: "Galleries", href: "/admin/gallery" },
      { name: "Manage Images", href: "/admin/gallery/manage" },
      { name: "Manage Categories", href: "/admin/gallery/categories" },
      { name: "Upload", href: "/admin/gallery/upload" },
      { name: "API Settings", href: "/admin/gallery/settings" },
    ]
  },
  { 
    name: "Portfolio", 
    href: "/admin/portfolio", 
    icon: Briefcase,
    badge: "8"
  },
  { 
    name: "Blog", 
    href: "/admin/blog", 
    icon: FileText,
    badge: "5"
  },
  { 
    name: "Pages", 
    href: "#", 
    icon: FileIcon,
    badge: null,
    subItems: [
      { name: "About", href: "/admin/pages/about" },
      { name: "Book", href: "/admin/pages/book" },
      { name: "Services", href: "/admin/pages/services" },
    ]
  },
  { 
    name: "Features", 
    href: "/admin/features", 
    icon: Sparkles,
    badge: null
  },
  { 
    name: "Contact", 
    href: "/admin/contact", 
    icon: Mail,
    badge: "3"
  },
  { 
    name: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3,
    badge: null
  },
  { 
    name: "Users", 
    href: "/admin/users", 
    icon: Users,
    badge: null
  },
]

const quickActions = [
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "View Site", href: "/", icon: Globe },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isSubItemActive = (subItems: any[]) => {
    return subItems.some(subItem => pathname === subItem.href)
  }

  // Let Link handle navigation naturally for better prefetching
  // Only use router.push for programmatic navigation

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-6 overflow-y-auto bg-gradient-to-b from-white via-gray-50/50 to-gray-100/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border-r border-gray-200/80 dark:border-gray-800/80 px-6 pb-6 shadow-xl backdrop-blur-sm">
        
        {/* Logo Section */}
        <div className="flex h-24 shrink-0 items-center justify-between border-b border-gray-200/60 dark:border-gray-800/60 pb-5 pt-6">
          <div className="flex items-center">
            <div className="relative">
              {/* MR Logo */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-blue-100 dark:ring-blue-900/50">
                <span className="text-white font-bold text-base tracking-wider">MR</span>
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-md animate-pulse"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                MR PHOTOGRAPHY
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-bold leading-6 text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2.5 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                Main Menu
              </div>
              <ul role="list" className="-mx-2 space-y-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const hasSubItems = item.subItems && item.subItems.length > 0
                  const isExpanded = expandedItems.includes(item.name)
                  const isSubActive = hasSubItems && isSubItemActive(item.subItems)

                  return (
                    <li key={item.name}>
                      {hasSubItems ? (
                        <>
                          <button
                            onClick={() => toggleExpanded(item.name)}
                            className={cn(
                              isSubActive
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                                : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/60 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-800 dark:hover:to-gray-800/80 dark:hover:text-blue-400",
                              "group flex items-center justify-between rounded-xl p-4 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md w-full"
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <item.icon
                                className={cn(
                                  isSubActive 
                                    ? "text-white" 
                                    : "text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                                  "h-5 w-5 shrink-0"
                                )}
                              />
                              <div className="font-medium">{item.name}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {item.badge && (
                                <Badge 
                                  variant={isSubActive ? "secondary" : "outline"} 
                                  className={cn(
                                    "text-xs",
                                    isSubActive 
                                      ? "bg-white/20 text-white border-white/30" 
                                      : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </button>
                          
                          {/* Sub Items */}
                          {isExpanded && (
                            <ul className="mt-2 ml-8 space-y-1.5">
                              {item.subItems?.map((subItem) => {
                                const isSubItemActive = pathname === subItem.href
                                return (
                                  <li key={subItem.name}>
                                    <Link
                                      href={subItem.href}
                                      prefetch={true}
                                      onClick={() => {
                                        // Trigger loading immediately on click
                                        const event = new CustomEvent('navigation-start', {
                                          detail: { pathname: subItem.href }
                                        })
                                        window.dispatchEvent(event)
                                      }}
                                      className={cn(
                                        isSubItemActive
                                          ? "bg-blue-50 text-blue-700 border-l-3 border-blue-600 shadow-sm dark:bg-blue-900/50 dark:text-blue-300"
                                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-l-2 hover:border-blue-300 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800",
                                        "group flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200 pl-4 border-l-2 border-transparent"
                                      )}
                                    >
                                      <div className="font-medium">{subItem.name}</div>
                                    </Link>
                                  </li>
                                )
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          prefetch={true}
                          onClick={() => {
                            // Trigger loading immediately on click
                            const event = new CustomEvent('navigation-start', {
                              detail: { pathname: item.href }
                            })
                            window.dispatchEvent(event)
                          }}
                          className={cn(
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/60 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-800 dark:hover:to-gray-800/80 dark:hover:text-blue-400",
                            "group flex items-center justify-between rounded-xl p-4 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon
                              className={cn(
                                isActive 
                                  ? "text-white" 
                                  : "text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                                "h-5 w-5 shrink-0"
                              )}
                            />
                            <div className="font-medium">{item.name}</div>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant={isActive ? "secondary" : "outline"} 
                              className={cn(
                                "text-xs",
                                isActive 
                                  ? "bg-white/20 text-white border-white/30" 
                                  : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700"
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* Quick Actions */}
            <li className="mt-auto pt-6 border-t border-gray-200/60 dark:border-gray-800/60">
              <div className="text-xs font-bold leading-6 text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2.5 flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-purple-500"></div>
                Quick Actions
              </div>
              <ul role="list" className="-mx-2 space-y-1.5">
                {quickActions.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      prefetch={true}
                      onClick={() => {
                        // Trigger loading immediately on click
                        const event = new CustomEvent('navigation-start', {
                          detail: { pathname: item.href }
                        })
                        window.dispatchEvent(event)
                      }}
                      className={cn(
                        "text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/60 dark:text-gray-300 dark:hover:bg-gradient-to-r dark:hover:from-gray-800 dark:hover:to-gray-800/80 dark:hover:text-purple-400 group flex gap-x-3 rounded-xl p-3.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}