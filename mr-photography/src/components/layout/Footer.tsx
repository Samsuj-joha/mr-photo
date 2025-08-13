// // File: /src/components/layout/Footer.tsx

// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { 
//   Instagram, 
//   Facebook, 
//   Twitter, 
//   Mail, 
//   Phone, 
//   MapPin,
//   Camera,
//   Heart,
//   Send,
//   ArrowUp
// } from "lucide-react"
// import { useState } from "react"

// const footerNavigation = {
//   main: [
//     { name: "Home", href: "/" },
//     { name: "Gallery", href: "/gallery" },
//     { name: "Portfolio", href: "/portfolio" },
//     { name: "Blog", href: "/blog" },
//     { name: "About", href: "/pages/about" },
//     { name: "Contact", href: "/contact" },
//   ],
//   company: [
//     { name: "About Us", href: "/pages/about" },
//     { name: "Our Story", href: "/pages/about#story" },
//     { name: "Pricing", href: "/pages/pricing" },
//     { name: "Features", href: "/features" },
//     { name: "Buy Prints", href: "/buy" },
//     { name: "Terms & Privacy", href: "/terms" },
//   ],
// }

// const socialLinks = [
//   {
//     name: "Instagram",
//     href: "#",
//     icon: Instagram,
//   },
//   {
//     name: "Facebook", 
//     href: "#",
//     icon: Facebook,
//   },
//   {
//     name: "Twitter",
//     href: "#",
//     icon: Twitter,
//   },
// ]

// export function Footer() {
//   const [email, setEmail] = useState("")
//   const [isSubscribing, setIsSubscribing] = useState(false)

//   const handleNewsletterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSubscribing(true)
    
//     setTimeout(() => {
//       setIsSubscribing(false)
//       setEmail("")
//     }, 1000)
//   }

//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   return (
//     <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800">
//       {/* WIDER SPACING: Match the new layout spacing */}
//       <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        
//         {/* Main Footer Content */}
//         <div className="py-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
//             {/* Brand Section */}
//             <div className="space-y-6">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 rounded-xl flex items-center justify-center">
//                   <span className="text-white dark:text-gray-800 font-light text-base tracking-wider">MR</span>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-light tracking-wide text-gray-900 dark:text-white">MR PHOTOGRAPHY</h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Capturing Life's Moments</p>
//                 </div>
//               </div>
              
//               <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
//                 Professional photographer specializing in weddings, portraits, and events. 
//                 Creating timeless memories through the art of photography.
//               </p>
              
//               {/* Contact Info */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
//                   <Phone className="h-4 w-4" />
//                   <span>+88 02 9882107-8</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
//                   <Mail className="h-4 w-4" />
//                   <span>info@paragongroup-bd.com</span>
//                 </div>
//                 <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
//                   <MapPin className="h-4 w-4 mt-0.5" />
//                   <div>
//                     <div>Paragon House 5, C/A Bir Uttam AK Khandakar Rd</div>
//                     <div>Mohakhali, Dhaka 1212, Bangladesh</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="flex space-x-4">
//                 {socialLinks.map((social) => (
//                   <Link
//                     key={social.name}
//                     href={social.href}
//                     className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group"
//                   >
//                     <social.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
//                     <span className="sr-only">{social.name}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Navigation Links */}
//             <div>
//               <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Navigation</h4>
//               <ul className="space-y-4">
//                 {footerNavigation.main.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       href={item.href}
//                       className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
//                     >
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Newsletter */}
//             <div>
//               <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Stay Updated</h4>
//               <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
//                 Subscribe to our newsletter for latest photography tips and updates.
//               </p>
              
//               <form onSubmit={handleNewsletterSubmit} className="space-y-4">
//                 <div className="flex">
//                   <Input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-r-none focus:border-gray-400 dark:focus:border-gray-600"
//                     required
//                   />
//                   <Button
//                     type="submit"
//                     disabled={isSubscribing}
//                     className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-l-none px-3"
//                   >
//                     {isSubscribing ? (
//                       <div className="animate-spin h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full" />
//                     ) : (
//                       <Send className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//               </form>

//               {/* Company Links */}
//               <div className="mt-8">
//                 <h5 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Company</h5>
//                 <ul className="space-y-2">
//                   {footerNavigation.company.slice(0, 4).map((item) => (
//                     <li key={item.name}>
//                       <Link
//                         href={item.href}
//                         className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs"
//                       >
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-gray-200 dark:border-gray-800 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
//             {/* Copyright */}
//             <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//               <Camera className="h-4 w-4" />
//               <span>© 2025 MR Photography. All rights reserved.</span>
//               <Heart className="h-4 w-4 text-red-500 animate-pulse" />
//             </div>

//             {/* Back to Top */}
//             <Button
//               onClick={scrollToTop}
//               variant="ghost"
//               size="sm"
//               className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//             >
//               <ArrowUp className="h-4 w-4 mr-2" />
//               Back to Top
//             </Button>

//           </div>
//         </div>

//       </div>
//     </footer>
//   )
// }






// File: /src/components/layout/Footer.tsx

"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  Heart,
  ArrowUp,
  Star,
  Eye
} from "lucide-react"
import { useState, useEffect } from "react"

// Gallery Image interface
interface GalleryImage {
  id: string
  title: string
  imageUrl: string
  category: string
  country: string
  loves: number
  galleryId: string
  galleryTitle: string
}

// Features interface
interface Feature {
  id: string
  title: string
  description: string
  image?: string
  published: boolean
}

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    name: "Facebook", 
    href: "https://www.facebook.com/mrphotos61",
    icon: Facebook,
  },
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
  },
]

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2025)
  const [recentPhotos, setRecentPhotos] = useState<GalleryImage[]>([])
  const [loadingPhotos, setLoadingPhotos] = useState(true)
  const [featuredPhotos, setFeaturedPhotos] = useState<Feature[]>([])
  const [loadingFeatures, setLoadingFeatures] = useState(true)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
    fetchRecentPhotos()
    fetchFeaturedPhotos()
  }, [])

  const fetchRecentPhotos = async () => {
    try {
      setLoadingPhotos(true)
      const response = await fetch('/api/gallery/images?limit=6&sort=recent')
      if (response.ok) {
        const data = await response.json()
        setRecentPhotos(data.images || data || [])
      } else {
        console.error('Failed to fetch recent photos')
      }
    } catch (error) {
      console.error('Error fetching recent photos:', error)
    } finally {
      setLoadingPhotos(false)
    }
  }

  const fetchFeaturedPhotos = async () => {
    try {
      setLoadingFeatures(true)
      const response = await fetch('/api/features')
      if (response.ok) {
        const data = await response.json()
        // Filter published features and take only first 3
        const publishedFeatures = (data || []).filter((f: Feature) => f.published).slice(0, 3)
        setFeaturedPhotos(publishedFeatures)
      } else {
        console.error('Failed to fetch featured photos')
      }
    } catch (error) {
      console.error('Error fetching featured photos:', error)
    } finally {
      setLoadingFeatures(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-background border-t border-border">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Brand Section with Logo */}
            <div className="lg:col-span-1 space-y-6">
              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <div className="w-16 h-12 rounded-xl overflow-hidden transition-transform group-hover:scale-105 bg-muted border border-border dark:bg-gray-100">
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
                <div className="ml-3">
                  <h3 className="text-lg font-semibold tracking-wide text-foreground">MR PHOTOGRAPHY</h3>
                  <p className="text-sm text-muted-foreground">Capturing Life's Moments</p>
                </div>
              </Link>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                Professional photographer specializing in weddings, portraits, and events. 
                Creating timeless memories through the art of photography.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+88 02 9882107-8</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>info@mr-photography.com</span>
                </div>
                <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <div>
                    <div>Professional Photography Studio</div>
                    <div>Dhaka, Bangladesh</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-muted hover:bg-accent rounded-lg flex items-center justify-center transition-colors group border border-border"
                  >
                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Photos Section - Using Real Gallery Images */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <Camera className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold text-foreground">Recent Photos</h4>
              </div>
              
              {loadingPhotos ? (
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {recentPhotos.slice(0, 6).map((photo) => (
                    <Link 
                      key={photo.id} 
                      href={`/gallery?image=${photo.id}`}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      <Image
                        src={photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={photo.imageUrl.includes('cloudinary.com')}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      
                      {/* Photo info on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-300 text-xs capitalize">{photo.country}</p>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-3 w-3 text-red-400" />
                            <span className="text-white text-xs">{photo.loves}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              <Link 
                href="/gallery" 
                className="inline-flex items-center mt-4 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View All Photos
                <ArrowUp className="h-3 w-3 ml-1 rotate-45" />
              </Link>
            </div>

            {/* Featured Photos Section - Using Real Features API */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Star className="h-5 w-5 text-yellow-500" />
                <h4 className="text-lg font-semibold text-foreground">Featured Photos</h4>
              </div>
              
              {loadingFeatures ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {featuredPhotos.map((feature) => (
                    <Link 
                      key={feature.id} 
                      href="/features"
                      className="group relative overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      <div className="aspect-[4/3] relative">
                        {feature.image ? (
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized={feature.image.includes('cloudinary.com')}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Camera className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-6">
                <Link 
                  href="/portfolio" 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  View Portfolio
                  <ArrowUp className="h-3 w-3 ml-1 rotate-45" />
                </Link>
                
                <Link 
                  href="/features" 
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  See All Features
                  <Star className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span>© {currentYear} MR Photography. All rights reserved.</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms & Privacy
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Button
                onClick={scrollToTop}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>

          </div>
        </div>

      </div>
    </footer>
  )
}