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
    badge: null,
    description: "Overview & Analytics"
  },
  { 
    name: "Home Slider", 
    href: "/admin/home-slider", 
    icon: Camera,
    badge: null,
    description: "Manage Home Slider"
  },
  { 
    name: "Gallery", 
    href: "/admin/gallery", 
    icon: Images,
    badge: "12",
    description: "Manage Photo Collections"
  },
  { 
    name: "Portfolio", 
    href: "/admin/portfolio", 
    icon: Briefcase,
    badge: "8",
    description: "Featured Projects"
  },
  { 
    name: "Blog", 
    href: "/admin/blog", 
    icon: FileText,
    badge: "5",
    description: "Articles & Posts"
  },
  { 
    name: "Pages", 
    href: "#", 
    icon: FileIcon,
    badge: null,
    description: "Site Pages",
    subItems: [
      { name: "About", href: "/admin/pages/about", description: "About page content" },
      { name: "Book", href: "/admin/pages/book", description: "Booking page setup" },
      { name: "Services", href: "/admin/pages/services", description: "Services & pricing" },
    ]
  },
  { 
    name: "Features", 
    href: "/admin/features", 
    icon: Sparkles,
    badge: null,
    description: "Site Features & Highlights"
  },
  { 
    name: "Contact", 
    href: "/admin/contact", 
    icon: Mail,
    badge: "3",
    description: "Contact Form & Info"
  },
  { 
    name: "Analytics", 
    href: "/admin/analytics", 
    icon: BarChart3,
    badge: null,
    description: "Site Performance"
  },
  { 
    name: "Users", 
    href: "/admin/users", 
    icon: Users,
    badge: null,
    description: "User Management"
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

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-6 pb-4">
        
        {/* Logo Section */}
        <div className="flex h-16 shrink-0 items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              {/* MR Logo */}
              <div className="w-9 h-9 bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-800 font-light text-sm tracking-wider">MR</span>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div className="ml-3">
              <h1 className="text-sm font-light text-gray-900 dark:text-white tracking-wide">
                MR PHOTOGRAPHY
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Main Menu
              </div>
              <ul role="list" className="-mx-2 space-y-1">
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
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400",
                              "group flex items-center justify-between rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02] w-full"
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
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className={cn(
                                  isSubActive 
                                    ? "text-blue-100" 
                                    : "text-gray-500 dark:text-gray-400",
                                  "text-xs"
                                )}>
                                  {item.description}
                                </div>
                              </div>
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
                            <ul className="mt-2 ml-6 space-y-1">
                              {item.subItems?.map((subItem) => {
                                const isSubItemActive = pathname === subItem.href
                                return (
                                  <li key={subItem.name}>
                                    <Link
                                      href={subItem.href}
                                      className={cn(
                                        isSubItemActive
                                          ? "bg-blue-50 text-blue-700 border-l-2 border-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-gray-800",
                                        "group flex items-center rounded-lg p-2 text-sm font-medium transition-all duration-200 pl-4"
                                      )}
                                    >
                                      <div>
                                        <div className="font-medium">{subItem.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {subItem.description}
                                        </div>
                                      </div>
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
                          className={cn(
                            isActive
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400",
                            "group flex items-center justify-between rounded-lg p-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
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
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className={cn(
                                isActive 
                                  ? "text-blue-100" 
                                  : "text-gray-500 dark:text-gray-400",
                                "text-xs"
                              )}>
                                {item.description}
                              </div>
                            </div>
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
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                Quick Actions
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {quickActions.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400 group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200"
                    >
                      <item.icon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
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