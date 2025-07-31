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
//   services: [
//     { name: "Wedding Photography", href: "/pages/services#wedding" },
//     { name: "Portrait Sessions", href: "/pages/services#portrait" },
//     { name: "Corporate Events", href: "/pages/services#corporate" },
//     { name: "Fashion Photography", href: "/pages/services#fashion" },
//     { name: "Nature Photography", href: "/pages/services#nature" },
//     { name: "Photo Editing", href: "/pages/services#editing" },
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
//     <footer className="bg-gray-50 text-white mt-[-145px]">
//       {/* CONSISTENT SPACING: Use same padding as main content area */}
//       <div className="container mx-auto px-6 sm:px-8 lg:px-10 xl:px-10 2xl:px-10">
        
//         {/* Main Footer Content */}
//         <div className="py-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
//             {/* Brand Section */}
//             <div className="space-y-6">
//               <div className="flex items-center space-x-3">
//                 <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-400 rounded-xl flex items-center justify-center">
//                   <span className="text-gray-800 font-light text-base tracking-wider">MR</span>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-light tracking-wide">MR PHOTOGRAPHY</h3>
//                   <p className="text-sm text-gray-400">Capturing Life's Moments</p>
//                 </div>
//               </div>
              
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 Professional photographer specializing in weddings, portraits, and events. 
//                 Creating timeless memories through the art of photography.
//               </p>
              
//               {/* Contact Info */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3 text-sm text-gray-400">
//                   <Phone className="h-4 w-4" />
//                   <span>+1 (555) 123-4567</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-sm text-gray-400">
//                   <Mail className="h-4 w-4" />
//                   <span>hello@mr-photography.com</span>
//                 </div>
//                 <div className="flex items-center space-x-3 text-sm text-gray-400">
//                   <MapPin className="h-4 w-4" />
//                   <span>New York, NY</span>
//                 </div>
//               </div>

//               {/* Social Links */}
//               <div className="flex space-x-4">
//                 {socialLinks.map((social) => (
//                   <Link
//                     key={social.name}
//                     href={social.href}
//                     className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group"
//                   >
//                     <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
//                     <span className="sr-only">{social.name}</span>
//                   </Link>
//                 ))}
//               </div>
//             </div>

//             {/* Navigation Links */}
//             <div>
//               <h4 className="text-lg font-semibold mb-6">Navigation</h4>
//               <ul className="space-y-4">
//                 {footerNavigation.main.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       href={item.href}
//                       className="text-gray-400 hover:text-white transition-colors text-sm"
//                     >
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Services */}
//             <div>
//               <h4 className="text-lg font-semibold mb-6">Services</h4>
//               <ul className="space-y-4">
//                 {footerNavigation.services.map((item) => (
//                   <li key={item.name}>
//                     <Link
//                       href={item.href}
//                       className="text-gray-400 hover:text-white transition-colors text-sm"
//                     >
//                       {item.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Newsletter */}
//             <div>
//               <h4 className="text-lg font-semibold mb-6">Stay Updated</h4>
//               <p className="text-gray-400 text-sm mb-6">
//                 Subscribe to our newsletter for latest photography tips and updates.
//               </p>
              
//               <form onSubmit={handleNewsletterSubmit} className="space-y-4">
//                 <div className="flex">
//                   <Input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-r-none focus:border-gray-600"
//                     required
//                   />
//                   <Button
//                     type="submit"
//                     disabled={isSubscribing}
//                     className="bg-white text-gray-900 hover:bg-gray-100 rounded-l-none px-3"
//                   >
//                     {isSubscribing ? (
//                       <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full" />
//                     ) : (
//                       <Send className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </div>
//               </form>

//               {/* Company Links */}
//               <div className="mt-8">
//                 <h5 className="text-sm font-semibold mb-4 text-gray-300">Company</h5>
//                 <ul className="space-y-2">
//                   {footerNavigation.company.slice(0, 4).map((item) => (
//                     <li key={item.name}>
//                       <Link
//                         href={item.href}
//                         className="text-gray-400 hover:text-white transition-colors text-xs"
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
//         <div className="border-t border-gray-800 py-8">
//           <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
//             {/* Copyright */}
//             <div className="flex items-center space-x-2 text-sm text-gray-400">
//               <Camera className="h-4 w-4" />
//               <span>© 2024 MR Photography. All rights reserved.</span>
//               <Heart className="h-4 w-4 text-red-500 animate-pulse" />
//             </div>

//             {/* Back to Top */}
//             <Button
//               onClick={scrollToTop}
//               variant="ghost"
//               size="sm"
//               className="text-gray-400 hover:text-white hover:bg-gray-800"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Camera,
  Heart,
  Send,
  ArrowUp
} from "lucide-react"
import { useState } from "react"

const footerNavigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/pages/about" },
    { name: "Contact", href: "/contact" },
  ],
  services: [
    { name: "Wedding Photography", href: "/pages/services#wedding" },
    { name: "Portrait Sessions", href: "/pages/services#portrait" },
    { name: "Corporate Events", href: "/pages/services#corporate" },
    { name: "Fashion Photography", href: "/pages/services#fashion" },
    { name: "Nature Photography", href: "/pages/services#nature" },
    { name: "Photo Editing", href: "/pages/services#editing" },
  ],
  company: [
    { name: "About Us", href: "/pages/about" },
    { name: "Our Story", href: "/pages/about#story" },
    { name: "Pricing", href: "/pages/pricing" },
    { name: "Features", href: "/features" },
    { name: "Buy Prints", href: "/buy" },
    { name: "Terms & Privacy", href: "/terms" },
  ],
}

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    name: "Facebook", 
    href: "#",
    icon: Facebook,
  },
  {
    name: "Twitter",
    href: "#",
    icon: Twitter,
  },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    
    setTimeout(() => {
      setIsSubscribing(false)
      setEmail("")
    }, 1000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-800 ">
      {/* CONSISTENT SPACING: Use same padding as main content area */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-10 xl:px-10 2xl:px-10">
        
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 rounded-xl flex items-center justify-center">
                  <span className="text-white dark:text-gray-800 font-light text-base tracking-wider">MR</span>
                </div>
                <div>
                  <h3 className="text-xl font-light tracking-wide text-gray-900 dark:text-white">MR PHOTOGRAPHY</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Capturing Life's Moments</p>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Professional photographer specializing in weddings, portraits, and events. 
                Creating timeless memories through the art of photography.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>hello@mr-photography.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>New York, NY</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <social.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                    <span className="sr-only">{social.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Navigation</h4>
              <ul className="space-y-4">
                {footerNavigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Services</h4>
              <ul className="space-y-4">
                {footerNavigation.services.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Stay Updated</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Subscribe to our newsletter for latest photography tips and updates.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div className="flex">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-r-none focus:border-gray-400 dark:focus:border-gray-600"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-l-none px-3"
                  >
                    {isSubscribing ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Company Links */}
              <div className="mt-8">
                <h5 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Company</h5>
                <ul className="space-y-2">
                  {footerNavigation.company.slice(0, 4).map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Camera className="h-4 w-4" />
              <span>© 2024 MR Photography. All rights reserved.</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            </div>

            {/* Back to Top */}
            <Button
              onClick={scrollToTop}
              variant="ghost"
              size="sm"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>

          </div>
        </div>

      </div>
    </footer>
  )
}