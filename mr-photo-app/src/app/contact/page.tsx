// File: /src/app/contact/page.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Camera,
  Instagram,
  Facebook,
  Twitter,
  Loader2
} from "lucide-react"

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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })
  const [settings, setSettings] = useState<ContactSettings | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContactSettings()
  }, [])

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/contact-settings')
      const data = await response.json()
      
      if (response.ok) {
        setSettings(data)
      } else {
        console.error("Failed to fetch contact settings")
      }
    } catch (error) {
      console.error("Error fetching contact settings:", error)
    } finally {
      setLoading(false)
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

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Dynamic contact info from API
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      value: settings.phone,
      description: settings.phoneDescription,
      href: `tel:${settings.phone.replace(/\s+/g, '').replace(/[()]/g, '')}`
    },
    {
      icon: Mail,
      title: "Email",
      value: settings.email,
      description: settings.emailDescription,
      href: `mailto:${settings.email}`
    },
    {
      icon: MapPin,
      title: "Location",
      value: settings.location,
      description: settings.locationDescription,
      href: "#"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: settings.responseTime,
      description: settings.responseTimeDescription,
      href: "#"
    }
  ]

  // Dynamic social links - only show if they exist
  const socialLinks = [
    { icon: Instagram, href: settings.socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: settings.socialLinks.facebook, label: "Facebook" },
    { icon: Twitter, href: settings.socialLinks.twitter, label: "Twitter" }
  ].filter(link => link.href && link.href !== "#" && link.href.trim() !== "")

  return (
    <div className="min-h-screen py-20  dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        
        {/* Dynamic Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white mb-6">
           
            {settings.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {settings.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg">
                    <Camera className="h-6 w-6 text-white" />
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
                  <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Thank you for your message! I'll get back to you within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
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
                    className="w-full h-12 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white" 
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

          {/* Dynamic Contact Information */}
          <div className="space-y-6">
            
            {/* Dynamic Contact Details */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {info.title}
                      </h3>
                      {info.href !== "#" ? (
                        <a 
                          href={info.href}
                          className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {info.value}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* Dynamic Social Media */}
            {socialLinks.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Follow My Work</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Stay updated with my latest photography projects
                </p>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </Card>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}