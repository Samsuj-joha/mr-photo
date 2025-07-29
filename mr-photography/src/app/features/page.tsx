// File: /src/app/features/page.tsx

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Zap, 
  Shield, 
  Heart,
  Clock,
  Award,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Download,
  Cloud,
  Edit,
  Palette,
  Globe,
  Headphones,
  Gift,
  TrendingUp
} from "lucide-react"

const mainFeatures = [
  {
    icon: Camera,
    title: "Professional Equipment",
    description: "State-of-the-art cameras, lenses, and lighting equipment for exceptional quality",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=400&fit=crop"
  },
  {
    icon: Edit,
    title: "Expert Post-Processing",
    description: "Professional editing and retouching to enhance every image to perfection",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop"
  },
  {
    icon: Cloud,
    title: "Digital Gallery Delivery",
    description: "Secure online galleries for easy viewing, sharing, and downloading",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "Quick delivery without compromising quality - weddings in 4-6 weeks",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
  }
]

const serviceFeatures = [
  {
    icon: Shield,
    title: "Backup & Security",
    description: "Multiple backup systems ensure your photos are never lost",
    details: ["Dual card recording", "Cloud backup", "Local storage redundancy"]
  },
  {
    icon: Palette,
    title: "Custom Editing Style",
    description: "Personalized editing approach tailored to your preferences",
    details: ["Color grading consultation", "Style matching", "Mood customization"]
  },
  {
    icon: Download,
    title: "High-Resolution Files",
    description: "Full resolution images suitable for large prints",
    details: ["Print-ready quality", "Multiple formats", "Unlimited downloads"]
  },
  {
    icon: Users,
    title: "Client Portal",
    description: "Dedicated client area for easy communication and file access",
    details: ["Private galleries", "Commenting system", "Share with family"]
  },
  {
    icon: Globe,
    title: "Worldwide Availability",
    description: "Available for destination weddings and travel sessions",
    details: ["International travel", "Destination expertise", "Local knowledge"]
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always available for questions and assistance",
    details: ["Emergency contact", "Quick response", "Personal attention"]
  }
]

const packageInclusions = [
  {
    category: "Photography",
    features: [
      "Professional photographer",
      "Premium equipment",
      "Multiple shooting angles",
      "Candid and posed shots",
      "Detail photography",
      "Group photography"
    ]
  },
  {
    category: "Post-Production",
    features: [
      "Professional editing",
      "Color correction",
      "Exposure adjustment",
      "Blemish removal",
      "Image enhancement",
      "Style consistency"
    ]
  },
  {
    category: "Delivery",
    features: [
      "Online gallery",
      "High-resolution images",
      "Print release included",
      "Mobile-friendly viewing",
      "Easy sharing options",
      "Download tracking"
    ]
  },
  {
    category: "Extras",
    features: [
      "Consultation session",
      "Location scouting",
      "Timeline planning",
      "Emergency backup",
      "Client communication",
      "Satisfaction guarantee"
    ]
  }
]

const statistics = [
  { icon: Award, value: "500+", label: "Happy Clients" },
  { icon: Camera, value: "1,200+", label: "Projects Completed" },
  { icon: Star, value: "5.0", label: "Average Rating" },
  { icon: Clock, value: "8+", label: "Years Experience" }
]

const testimonialFeatures = [
  {
    feature: "Professional Quality",
    quote: "The image quality exceeded our expectations. Every photo is a work of art.",
    author: "Sarah M."
  },
  {
    feature: "Fast Delivery",
    quote: "We received our wedding photos in just 3 weeks. Amazing turnaround time!",
    author: "David K."
  },
  {
    feature: "Easy Process",
    quote: "From booking to delivery, everything was smooth and professional.",
    author: "Emma T."
  },
  {
    feature: "Great Communication",
    quote: "Michael was always available and responsive throughout the entire process.",
    author: "Lisa R."
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6">Features & Benefits</Badge>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 leading-tight">
              Why Choose MR Photography?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Discover the professional features, quality guarantees, and exceptional service 
              that make every photo session a memorable experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">
                  View Our Work
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Core Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professional photography services built on quality, reliability, and client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {mainFeatures.map((feature, index) => (
              <div key={index} className="group">
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Professional Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive photography services designed to exceed your expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Package Inclusions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              What's Included
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Every package includes comprehensive services to ensure a complete photography experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packageInclusions.map((package_, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-600"></div>
                <CardHeader>
                  <CardTitle className="text-lg text-center">{package_.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {package_.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Features */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              What Clients Love Most
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Real feedback from real clients about their favorite features and experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonialFeatures.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center mb-4">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <h3 className="font-semibold text-lg">{testimonial.feature}</h3>
                </div>
                <blockquote className="text-gray-200 mb-4 italic">
                  "{testimonial.quote}"
                </blockquote>
                <p className="text-gray-300 text-sm font-medium">
                  - {testimonial.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple, streamlined process from initial contact to final delivery.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Consultation</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Initial discussion about your needs, vision, and preferences.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Planning</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Timeline creation, location scouting, and detailed preparation.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Photography</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Professional photo session with premium equipment and expertise.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Edited photos delivered through secure online gallery.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Latest equipment and software to ensure the highest quality results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Professional Cameras
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Canon EOS R5 & Sony α7R V with dual card slots for redundancy
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>45MP+ resolution</li>
                <li>Low-light performance</li>
                <li>Dual memory cards</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Professional Lighting
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Studio-quality lighting for any environment or condition
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>Off-camera flash</li>
                <li>LED panels</li>
                <li>Light modifiers</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Edit className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Advanced Editing
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Industry-standard software for professional post-processing
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>Adobe Lightroom</li>
                <li>Adobe Photoshop</li>
                <li>Color calibration</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Gift className="w-16 h-16 mx-auto mb-6 text-gray-800 dark:text-gray-200" />
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Join hundreds of satisfied clients who've trusted MR Photography 
              to capture their most important moments with professional excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link href="/contact">
                  Book Your Session
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link href="/pricing">
                  View Packages
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Satisfaction guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Quick response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}