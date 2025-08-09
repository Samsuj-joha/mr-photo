// File: /src/components/layout/Navbar.tsx

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Menu, 
  Search, 
  Sun, 
  Moon, 
  Camera,
  ChevronDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Star
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const mainNavItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Gallery",
    href: "/gallery",
  },
  {
    title: "Portfolio",
    href: "/portfolio",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Pages",
    href: "#",
    items: [
      {
        title: "About",
        href: "/pages/about",
        description: "Learn about my photography journey and passion"
      },
      {
        title: "Book",
        href: "/pages/book",
        description: "View our photography book collections"
      },
    ]
  },
  {
    title: "Features",
    href: "/features",
  },
  {
    title: "Contact",
    href: "/contact",
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm" 
          : "bg-transparent"
      )}
    >
      {/* WIDER SPACING: Match the new layout spacing */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="w-14 h-10 lg:w-22 lg:h-16 rounded-xl overflow-hidden transition-transform group-hover:scale-105 dark:bg-gray-100">
                <Image
                  src="/images/logo.png"
                  alt="MR Photography Logo"
                  width={100}
                  height={60}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger className="h-auto py-2 px-4 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[400px]">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink key={subItem.title} asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {subItem.title}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group inline-flex h-auto py-2 px-4 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                          pathname === item.href && "bg-gray-100 dark:bg-gray-800 text-primary"
                        )}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            
            {/* Search */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSearch} className="space-y-4">
                  <Input
                    placeholder="Search galleries, blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                    autoFocus
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Search</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Book Session Button - Perfect for Photography Showcase */}
            <Button
              asChild
              size="sm"
              className="hidden md:flex bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/contact" className="flex items-center space-x-2">
                <Menu className="h-4 w-4" />
                <span>Book Session</span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6 mt-6">
                  
                  {/* Mobile Logo */}
                  <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-light text-gray-900 dark:text-white tracking-wide">
                        MR PHOTOGRAPHY
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Professional Photography Showcase
                      </p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {mainNavItems.map((item) => (
                      <div key={item.title}>
                        {item.items ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between py-2 px-3 text-sm font-medium text-gray-900 dark:text-white">
                              {item.title}
                              <ChevronDown className="h-4 w-4" />
                            </div>
                            <div className="pl-4 space-y-1">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  onClick={() => setIsOpen(false)}
                                  className="block py-2 px-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block py-3 px-3 text-sm font-medium rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                              pathname === item.href && "bg-gray-100 dark:bg-gray-800 text-primary"
                            )}
                          >
                            {item.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                    
                    {/* Book Session Button */}
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-700 hover:to-gray-500 text-white shadow-lg"
                    >
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        <Menu className="h-4 w-4 mr-2" />
                        Book a Session
                      </Link>
                    </Button>

                    {/* View Portfolio Button */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-gray-300 dark:border-gray-600"
                    >
                      <Link href="/portfolio" onClick={() => setIsOpen(false)}>
                        <Heart className="h-4 w-4 mr-2" />
                        View Portfolio
                      </Link>
                    </Button>
                    
                    {/* Contact Info */}
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4" />
                        <span>+88 02 9882107-8</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4" />
                        <span>info@paragongroup-bd.com</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <div>Paragon House 5, C/A Bir Uttam</div>
                          <div>AK Khandakar Rd, Mohakhali</div>
                          <div>Dhaka 1212, Bangladesh</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Photography Showcase
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Camera className="h-3 w-3" />
                          <span>Professional</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>Portfolio</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>Creative</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}