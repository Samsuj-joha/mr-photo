

// // File: /src/components/layout/Navbar.tsx

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { 
//   Menu, 
//   Search, 
//   Sun, 
//   Moon, 
//   Camera,
//   Phone,
//   Mail,
//   MapPin,
//   Heart,
//   Star,
//   BookOpen,
//   Image as ImageIcon,
//   Sparkles,
//   Briefcase,
//   FileText,
//   User
// } from "lucide-react"
// import { useTheme } from "next-themes"
// import { cn } from "@/lib/utils"

// // Updated navigation items based on your requirement: Home | E-Books | Gallery | Feature | Portfolio | Blogs | About
// const mainNavItems = [
//   {
//     title: "Home",
//     href: "/",
//     icon: <Camera className="h-4 w-4" />
//   },
//   {
//     title: "E-Books",
//     href: "/ebooks",
//     icon: <BookOpen className="h-4 w-4" />
//   },
//   {
//     title: "Gallery",
//     href: "/gallery",
//     icon: <ImageIcon className="h-4 w-4" />
//   },
//   {
//     title: "Feature",
//     href: "/features",
//     icon: <Sparkles className="h-4 w-4" />
//   },
//   {
//     title: "Portfolio",
//     href: "/portfolio",
//     icon: <Briefcase className="h-4 w-4" />
//   },
//   {
//     title: "Blogs",
//     href: "/blog",
//     icon: <FileText className="h-4 w-4" />
//   },
//   {
//     title: "About",
//     href: "/about",
//     icon: <User className="h-4 w-4" />
//   }
// ]

// // Additional pages for mobile quick links
// const quickLinks = [
//   { title: "Contact", href: "/contact" },
//   { title: "Services", href: "/services" },
//   { title: "Pricing", href: "/pricing" }
// ]

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isSearchOpen, setIsSearchOpen] = useState(false)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [isScrolled, setIsScrolled] = useState(false)
//   const { theme, setTheme } = useTheme()
//   const pathname = usePathname()

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10)
//     }
//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [])

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (searchQuery.trim()) {
//       window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
//     }
//   }

//   return (
//     <header 
//       className={cn(
//         "sticky top-0 z-50 w-full transition-all duration-300",
//         isScrolled 
//           ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm" 
//           : "bg-transparent"
//       )}
//     >
//       <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
//         <div className="flex h-16 lg:h-20 items-center justify-between">
          
//           {/* Logo */}
//           <Link href="/" className="flex items-center group">
//             <div className="relative">
//               <div className="w-14 h-10 lg:w-22 lg:h-16 rounded-xl overflow-hidden transition-transform group-hover:scale-105 dark:bg-gray-100">
//                 <Image
//                   src="/images/logo.png"
//                   alt="MR Photography Logo"
//                   width={100}
//                   height={60}
//                   className="object-cover w-full h-full"
//                   priority
//                 />
//               </div>
//             </div>
//           </Link>

//           {/* Desktop Navigation - Updated alignment */}
//           <NavigationMenu className="hidden lg:flex">
//             <NavigationMenuList className="space-x-2">
//               {mainNavItems.map((item) => (
//                 <NavigationMenuItem key={item.title}>
//                   <NavigationMenuLink asChild>
//                     <Link
//                       href={item.href}
//                       className={cn(
//                         "group inline-flex h-auto py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm",
//                         pathname === item.href 
//                           ? "bg-primary text-primary-foreground shadow-sm" 
//                           : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
//                       )}
//                     >
//                       <span className="flex items-center space-x-2">
//                         {item.icon}
//                         <span>{item.title}</span>
//                       </span>
//                     </Link>
//                   </NavigationMenuLink>
//                 </NavigationMenuItem>
//               ))}
//             </NavigationMenuList>
//           </NavigationMenu>

//           {/* Right Side Actions */}
//           <div className="flex items-center space-x-2 lg:space-x-4">
            
//             {/* Search */}
//             <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                 >
//                   <Search className="h-4 w-4" />
//                   <span className="sr-only">Search</span>
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle className="flex items-center space-x-2">
//                     <Search className="h-5 w-5" />
//                     <span>Search</span>
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleSearch} className="space-y-4">
//                   <Input
//                     placeholder="Search galleries, e-books, blogs..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full"
//                     autoFocus
//                   />
//                   <div className="flex justify-end space-x-2">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => setIsSearchOpen(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button type="submit">Search</Button>
//                   </div>
//                 </form>
//               </DialogContent>
//             </Dialog>

//             {/* Theme Toggle */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setTheme(theme === "light" ? "dark" : "light")}
//               className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//             >
//               <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//               <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>

//             {/* Social Media Icons */}
//             <div className="hidden md:flex items-center space-x-2">
//               {/* Facebook */}
//               <div className="relative group">
//                 <Button
//                   asChild
//                   variant="ghost"
//                   size="sm"
//                   className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 transition-colors"
//                 >
//                   <Link href="https://www.facebook.com/mrphotos61" target="_blank" rel="noopener noreferrer">
//                     <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                     </svg>
//                     <span className="sr-only">Facebook</span>
//                   </Link>
//                 </Button>
//                 {/* Facebook Tooltip */}
//                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                   <div className="font-medium">Facebook</div>
//                   <div className="text-gray-300">Visit our Facebook page</div>
//                   {/* Arrow */}
//                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-700"></div>
//                 </div>
//               </div>

//               {/* Flickr */}
//               <div className="relative group">
//                 <Button
//                   asChild
//                   variant="ghost"
//                   size="sm"
//                   className="h-9 w-9 p-0 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-600 transition-colors"
//                 >
//                   <Link href="https://www.flickr.com/people/mrahman17/" target="_blank" rel="noopener noreferrer">
//                     <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
//                       <path d="M0 12c0 2.5 2.04 4.54 4.54 4.54S9.08 14.5 9.08 12s-2.04-4.54-4.54-4.54S0 9.5 0 12zm14.92 0c0 2.5 2.04 4.54 4.54 4.54S24 14.5 24 12s-2.04-4.54-4.54-4.54-4.54 2.04-4.54 4.54z"/>
//                     </svg>
//                     <span className="sr-only">Flickr</span>
//                   </Link>
//                 </Button>
//                 {/* Flickr Tooltip */}
//                 <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
//                   <div className="font-medium">Flickr</div>
//                   <div className="text-gray-300">View our photo gallery</div>
//                   {/* Arrow */}
//                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-700"></div>
//                 </div>
//               </div>
//             </div>

//             {/* Mobile Menu */}
//             <Sheet open={isOpen} onOpenChange={setIsOpen}>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="lg:hidden h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Open menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right" className="w-80 sm:w-96">
//                 <SheetHeader className="sr-only">
//                   <SheetTitle>Navigation Menu</SheetTitle>
//                 </SheetHeader>
//                 <div className="flex flex-col space-y-6 mt-6">
                  
//                   {/* Mobile Logo */}
//                   <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-gray-800">
//                     <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
//                       <Camera className="h-6 w-6 text-white" />
//                     </div>
//                     <div>
//                       <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
//                         MR PHOTOGRAPHY
//                       </h1>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Professional Photography
//                       </p>
//                     </div>
//                   </div>

//                   {/* Mobile Navigation */}
//                   <nav className="flex flex-col space-y-1">
//                     {mainNavItems.map((item) => (
//                       <Link
//                         key={item.title}
//                         href={item.href}
//                         onClick={() => setIsOpen(false)}
//                         className={cn(
//                           "flex items-center space-x-3 py-3 px-4 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
//                           pathname === item.href && "bg-primary text-primary-foreground"
//                         )}
//                       >
//                         {item.icon}
//                         <span>{item.title}</span>
//                       </Link>
//                     ))}
                    
//                     {/* Additional Pages in Mobile */}
//                     <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
//                       <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 pb-2">
//                         Quick Links
//                       </p>
//                       {quickLinks.map((link) => (
//                         <Link
//                           key={link.title}
//                           href={link.href}
//                           onClick={() => setIsOpen(false)}
//                           className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
//                         >
//                           {link.title}
//                         </Link>
//                       ))}
//                     </div>
//                   </nav>

//                   {/* Mobile Actions */}
//                   <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                    
//                     {/* Social Media Links */}
//                     <div className="flex items-center justify-center space-x-6">
//                       <div className="flex flex-col items-center space-y-2">
//                         <Button
//                           asChild
//                           variant="ghost"
//                           size="sm"
//                           className="h-14 w-14 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 transition-colors rounded-xl"
//                         >
//                           <Link href="https://www.facebook.com/mrphotos61" target="_blank" rel="noopener noreferrer">
//                             <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
//                               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                             </svg>
//                             <span className="sr-only">Facebook</span>
//                           </Link>
//                         </Button>
//                         <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Facebook</span>
//                       </div>

//                       <div className="flex flex-col items-center space-y-2">
//                         <Button
//                           asChild
//                           variant="ghost"
//                           size="sm"
//                           className="h-14 w-14 p-0 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-600 transition-colors rounded-xl"
//                         >
//                           <Link href="https://www.flickr.com/people/mrahman17/" target="_blank" rel="noopener noreferrer">
//                             <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
//                               <path d="M0 12c0 2.5 2.04 4.54 4.54 4.54S9.08 14.5 9.08 12s-2.04-4.54-4.54-4.54S0 9.5 0 12zm14.92 0c0 2.5 2.04 4.54 4.54 4.54S24 14.5 24 12s-2.04-4.54-4.54-4.54-4.54 2.04-4.54 4.54z"/>
//                             </svg>
//                             <span className="sr-only">Flickr</span>
//                           </Link>
//                         </Button>
//                         <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Flickr</span>
//                       </div>
//                     </div>

//                     {/* Contact Info */}
//                     <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
//                       <div className="flex items-center space-x-3">
//                         <Phone className="h-4 w-4" />
//                         <span>+88 02 9882107-8</span>
//                       </div>
//                       <div className="flex items-center space-x-3">
//                         <Mail className="h-4 w-4" />
//                         <span>info@mr-photography.com</span>
//                       </div>
//                       <div className="flex items-start space-x-3">
//                         <MapPin className="h-4 w-4 mt-0.5" />
//                         <div className="text-xs leading-relaxed">
//                           <div>Professional Photography Studio</div>
//                           <div>Dhaka, Bangladesh</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Quick Stats */}
//                     <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 space-y-2">
//                       <h4 className="text-sm font-medium text-gray-900 dark:text-white">
//                         MR Photography
//                       </h4>
//                       <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
//                         <div className="flex items-center space-x-1">
//                           <Camera className="h-3 w-3" />
//                           <span>Professional</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Star className="h-3 w-3" />
//                           <span>Portfolio</span>
//                         </div>
//                         <div className="flex items-center space-x-1">
//                           <Heart className="h-3 w-3" />
//                           <span>Creative</span>
//                         </div>
//                       </div>
//                     </div>

//                   </div>

//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }




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
  Phone,
  Mail,
  MapPin,
  Heart,
  Star
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { CONTAINER_CLASS } from "@/lib/container"

// Navigation items
const mainNavItems = [
  { title: "Home", href: "/" },
  { title: "E-Books", href: "/ebooks" },
  { title: "Gallery", href: "/gallery" },
  { title: "Feature", href: "/features" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Blogs", href: "/blog" },
  { title: "About", href: "/about" }
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
      <div className={CONTAINER_CLASS}>
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

          {/* Desktop Navigation - Clean Underline Effect */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center space-x-8">
              {mainNavItems.map((item) => (
                <li key={item.title} className="relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative py-2 text-sm font-medium transition-colors duration-200",
                      "before:content-[''] before:absolute before:bottom-[-4px] before:left-0 before:w-full before:h-[2px]",
                      "before:bg-black dark:before:bg-white before:scale-x-0 before:origin-left",
                      "before:transition-transform before:duration-300 before:ease-out",
                      "hover:before:scale-x-100",
                      pathname === item.href 
                        ? "text-gray-900 dark:text-white before:!scale-x-100" 
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            
            {/* Search */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                    placeholder="Search galleries, e-books, blogs..."
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
              className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Social Media Icons */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Facebook */}
              <div className="relative group">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 transition-colors"
                >
                  <Link href="https://www.facebook.com/mrphotos61" target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="sr-only">Facebook</span>
                  </Link>
                </Button>
                {/* Facebook Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="font-medium">Facebook</div>
                  <div className="text-gray-300">Visit our Facebook page</div>
                  {/* Arrow */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                </div>
              </div>

              {/* Flickr */}
              <div className="relative group">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-600 transition-colors"
                >
                  <Link href="https://www.flickr.com/people/mrahman17/" target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M0 12c0 2.5 2.04 4.54 4.54 4.54S9.08 14.5 9.08 12s-2.04-4.54-4.54-4.54S0 9.5 0 12zm14.92 0c0 2.5 2.04 4.54 4.54 4.54S24 14.5 24 12s-2.04-4.54-4.54-4.54-4.54 2.04-4.54 4.54z"/>
                    </svg>
                    <span className="sr-only">Flickr</span>
                  </Link>
                </Button>
                {/* Flickr Tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="font-medium">Flickr</div>
                  <div className="text-gray-300">View our photo gallery</div>
                  {/* Arrow */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[4px] border-l-transparent border-r-transparent border-b-gray-900 dark:border-b-gray-700"></div>
                </div>
              </div>
            </div>

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
                  <div className="flex items-center space-x-3 pb-6 border-b pl-2 border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide">
                        MR PHOTOGRAPHY
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Professional Photography
                      </p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-1">
                    {mainNavItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center py-3 px-4 text-sm font-medium rounded-lg transition-colors",
                          pathname === item.href && "bg-primary text-primary-foreground"
                        )}
                      >
                        <span>{item.title}</span>
                      </Link>
                    ))}
                    

                  </nav>

                  {/* Mobile Actions */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                    
                    {/* Social Media Links */}
                    <div className="flex items-center justify-center space-x-6">
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-14 w-14 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 transition-colors rounded-xl"
                        >
                          <Link href="https://www.facebook.com/mrphotos61" target="_blank" rel="noopener noreferrer">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="sr-only">Facebook</span>
                          </Link>
                        </Button>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Facebook</span>
                      </div>

                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-14 w-14 p-0 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-600 transition-colors rounded-xl"
                        >
                          <Link href="https://www.flickr.com/people/mrahman17/" target="_blank" rel="noopener noreferrer">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M0 12c0 2.5 2.04 4.54 4.54 4.54S9.08 14.5 9.08 12s-2.04-4.54-4.54-4.54S0 9.5 0 12zm14.92 0c0 2.5 2.04 4.54 4.54 4.54S24 14.5 24 12s-2.04-4.54-4.54-4.54-4.54 2.04-4.54 4.54z"/>
                            </svg>
                            <span className="sr-only">Flickr</span>
                          </Link>
                        </Button>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Flickr</span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4" />
                        <span>+88 02 9882107-8</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4" />
                        <span>info@mr-photography.com</span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <div>Professional Photography Studio</div>
                          <div>Dhaka, Bangladesh</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        MR Photography
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