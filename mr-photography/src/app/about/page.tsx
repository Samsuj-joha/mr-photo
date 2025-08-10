// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import Link from "next/link"
// import { Loader2, User, Camera, Heart } from "lucide-react"

// interface AboutData {
//   id: string
//   name: string
//   description: string
//   profileImage?: string
//   journeyTitle: string
//   journeyContent: string
//   valuesTitle: string
//   valuesContent: string
//   published: boolean
// }

// export default function AboutPage() {
//   const [aboutData, setAboutData] = useState<AboutData | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState("")

//   useEffect(() => {
//     loadAboutData()
//   }, [])

//   const loadAboutData = async () => {
//     try {
//       const response = await fetch('/api/about')
//       if (response.ok) {
//         const data = await response.json()
//         setAboutData(data)
//       } else {
//         setError("About page not found")
//       }
//     } catch (error) {
//       console.error('Failed to load about data:', error)
//       setError("Failed to load about page")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const formatText = (text: string) => {
//     return text.split('\n').map((paragraph, index) => {
//       if (paragraph.trim() === '') return null
      
//       // Handle bold text **text**
//       const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      
//       return (
//         <p 
//           key={index} 
//           className="mb-4 last:mb-0 leading-relaxed text-muted-foreground"
//           dangerouslySetInnerHTML={{ __html: formattedParagraph }}
//         />
//       )
//     })
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
//           <p className="text-foreground/60">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   if (error || !aboutData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center max-w-md mx-auto px-6">
//           <h1 className="text-2xl font-medium text-foreground mb-4">About Page</h1>
//           <p className="text-muted-foreground mb-6">{error || "Content not available"}</p>
//           <Link 
//             href="/"
//             className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
//           >
//             Return Home
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="py-8">
        
//         {/* Section 1: Basic Information */}
//         <section className="mb-12">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
//             {/* Profile Image */}
//             <div className="lg:order-1">
//               {aboutData.profileImage ? (
//                 <div className="aspect-[5/3] relative overflow-hidden rounded-lg shadow-lg border border-border">
//                   <Image
//                     src={aboutData.profileImage}
//                     alt={aboutData.name}
//                     fill
//                     className="object-cover"
//                     priority
//                   />
//                 </div>
//               ) : (
//                 <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border border-border">
//                   <User className="h-20 w-20 text-muted-foreground" />
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             <div className="lg:order-2 space-y-6">
//               <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                 <User className="h-4 w-4" />
//                 <span>Photographer</span>
//               </div>
              
//               <h2 className="text-3xl md:text-4xl font-medium text-foreground">
//                 {aboutData.name}
//               </h2>
              
//               <div className="text-muted-foreground text-md text-justify space-y-4">
//                 {formatText(aboutData.description)}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Section 2: Photography Journey */}
//         <section className="mb-12">
//           <div>
//             <div className="text-center mb-8">
//               <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
//                 <Camera className="h-4 w-4" />
//                 <span>My Story</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
//                 {aboutData.journeyTitle}
//               </h2>
//             </div>
            
//             <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
//               <div className="text-muted-foreground text-lg">
//                 {formatText(aboutData.journeyContent)}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Section 3: Values & Approach */}
//         <section className="mb-12">
//           <div>
//             <div className="text-center mb-8">
//               <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
//                 <Heart className="h-4 w-4" />
//                 <span>Philosophy</span>
//               </div>
//               <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
//                 {aboutData.valuesTitle}
//               </h2>
//             </div>
            
//             <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
//               <div className="text-lg text-muted-foreground">
//                 {formatText(aboutData.valuesContent)}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Enhanced Call to Action */}
//         <section>
//           <div className="text-center bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-8 border border-border shadow-sm">
//             <div className="max-w-2xl mx-auto">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
//                 <Camera className="h-8 w-8 text-primary" />
//               </div>
              
//               <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
//                 Ready to Work Together?
//               </h3>
//               <p className="text-muted-foreground mb-8 text-lg">
//                 Let's create something beautiful together and capture moments that matter
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link
//                   href="/contact"
//                   className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md transform hover:scale-105"
//                 >
//                   <span className="flex items-center justify-center space-x-2">
//                     <span>Get In Touch</span>
//                     <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
//                   </span>
//                 </Link>
                
//                 <Link
//                   href="/portfolio"
//                   className="group px-8 py-4 border border-border bg-card text-card-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium shadow-sm hover:shadow-md"
//                 >
//                   <span className="flex items-center justify-center space-x-2">
//                     <span>View Portfolio</span>
//                     <Camera className="h-4 w-4 group-hover:scale-110 transition-transform" />
//                   </span>
//                 </Link>
//               </div>

//               {/* Contact Info Preview */}
//               <div className="mt-8 pt-6 border-t border-border/50">
//                 <p className="text-sm text-muted-foreground mb-3">Quick Contact</p>
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
//                   <span>📧 info@mr-photography.com</span>
//                   <span className="hidden sm:block">•</span>
//                   <span>📱 +88 02 9882107-8</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { 
  Loader2, 
  User, 
  Camera, 
  Heart,
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react"

interface AboutData {
  id: string
  name: string
  description: string
  profileImage?: string
  journeyTitle: string
  journeyContent: string
  valuesTitle: string
  valuesContent: string
  published: boolean
}

interface ContactSettings {
  title: string
  subtitle: string
  phone: string
  phoneDescription: string
  email: string
  emailDescription: string
  location: string
  locationDescription: string
  responseTime: string
  responseTimeDescription: string
  businessHours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  emergencyNote: string
  socialLinks: {
    instagram: string
    facebook: string
    twitter: string
  }
  quickInfoTitle: string
  quickInfoDescription: string
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    loadAboutData()
    fetchContactSettings()
  }, [])

  const loadAboutData = async () => {
    try {
      const response = await fetch('/api/about')
      if (response.ok) {
        const data = await response.json()
        setAboutData(data)
      } else {
        setError("About page not found")
      }
    } catch (error) {
      console.error('Failed to load about data:', error)
      setError("Failed to load about page")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/contact-settings')
      const data = await response.json()
      
      if (response.ok) {
        setContactSettings(data)
      } else {
        console.error("Failed to fetch contact settings")
      }
    } catch (error) {
      console.error("Error fetching contact settings:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
      } else {
        setSubmitStatus("error")
        setErrorMessage(data.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null
      
      // Handle bold text **text**
      const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      
      return (
        <p 
          key={index} 
          className="mb-4 last:mb-0 leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      )
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-foreground/60" />
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-medium text-foreground mb-4">About Page</h1>
          <p className="text-muted-foreground mb-6">{error || "Content not available"}</p>
          <Link 
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  // Dynamic contact info from API (with fallbacks)
  const contactInfo = contactSettings ? [
    
    {
      icon: Mail,
      title: "Email",
      value: contactSettings.email,
      description: contactSettings.emailDescription,
      href: `mailto:${contactSettings.email}`
    },
    {
      icon: MapPin,
      title: "Location",
      value: contactSettings.location,
      description: contactSettings.locationDescription,
      href: "#"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: contactSettings.responseTime,
      description: contactSettings.responseTimeDescription,
      href: "#"
    }
  ] : [
    
    {
      icon: Mail,
      title: "Email",
      value: "info@mr-photography.com",
      description: "Send us an email anytime",
      href: "mailto:info@mr-photography.com"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Dhaka, Bangladesh",
      description: "Professional Photography Studio",
      href: "#"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "Within 24 hours",
      description: "We'll get back to you quickly",
      href: "#"
    }
  ]

  // Dynamic social links - only show if they exist
  const socialLinks = contactSettings ? [
    { icon: Instagram, href: contactSettings.socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: contactSettings.socialLinks.facebook || "https://www.facebook.com/mrphotos61", label: "Facebook" },
    { icon: Twitter, href: contactSettings.socialLinks.twitter, label: "Twitter" }
  ].filter(link => link.href && link.href !== "#" && link.href.trim() !== "") : [
    { icon: Facebook, href: "https://www.facebook.com/mrphotos61", label: "Facebook" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="py-8">
        
        {/* Section 1: Basic Information */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Profile Image */}
            <div className="lg:order-1">
              {aboutData.profileImage ? (
                <div className="aspect-[5/3] relative overflow-hidden rounded-lg shadow-lg border border-border">
                  <Image
                    src={aboutData.profileImage}
                    alt={aboutData.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border border-border">
                  <User className="h-20 w-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="lg:order-2 space-y-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Photographer</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-medium text-foreground">
                {aboutData.name}
              </h2>
              
              <div className="text-muted-foreground text-md text-justify space-y-4">
                {formatText(aboutData.description)}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Photography Journey */}
        <section className="mb-16">
          <div>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-4">
                <Camera className="h-4 w-4" />
                <span>My Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">
                {aboutData.journeyTitle}
              </h2>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6 md:p-8 border border-border">
              <div className="text-muted-foreground text-lg">
                {formatText(aboutData.journeyContent)}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section with Form */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-4">
              Let's Work Together
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ready to capture your special moments? Get in touch and let's discuss your photography needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border border-border bg-card">
                <CardHeader className="pb-8">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <div className="p-2 bg-gradient-to-r from-primary/80 to-primary rounded-lg">
                      <Camera className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span>Send Me a Message</span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and I'll get back to you within 24 hours to discuss your photography needs.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-8">
                  {/* Success/Error Messages */}
                  {submitStatus === "success" && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Thank you for your message! I'll get back to you within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === "error" && (
                    <Alert className="mb-6 border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {errorMessage}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          disabled={isSubmitting}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                          disabled={isSubmitting}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                          disabled={isSubmitting}
                          className="h-12"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Wedding photography inquiry"
                          required
                          disabled={isSubmitting}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell me about your photography needs, event details, preferred dates, and any specific requirements..."
                        rows={6}
                        required
                        disabled={isSubmitting}
                        className="resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground" 
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-6">
              
              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary/80 to-primary rounded-xl flex items-center justify-center shrink-0">
                        <info.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        {info.href !== "#" ? (
                          <a 
                            href={info.href}
                            className="text-muted-foreground font-medium hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground font-medium">
                            {info.value}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground/80">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Social Media */}
              {socialLinks.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Follow My Work</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Stay updated with my latest photography projects
                  </p>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-muted hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 group"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                      </a>
                    ))}
                  </div>
                </Card>
              )}

            </div>
          </div>
        </section>

      </div>
    </div>
  )
}