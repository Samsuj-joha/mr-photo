// File: /src/app/page.tsx

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Heart, 
  Star, 
  ArrowRight, 
  Users,
  Award,
  Clock,
  MapPin,
  Calendar,
  Quote
} from "lucide-react"

const featuredGalleries = [
  {
    id: 1,
    title: "Wedding Magic",
    description: "Capturing the most important day of your life",
    imageCount: 45,
    category: "Wedding",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    href: "/gallery/wedding-magic"
  },
  {
    id: 2,
    title: "Urban Portraits",
    description: "Professional portraits in stunning locations",
    imageCount: 32,
    category: "Portrait",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    href: "/gallery/urban-portraits"
  },
  {
    id: 3,
    title: "Nature's Beauty",
    description: "Breathtaking landscapes and nature photography",
    imageCount: 28,
    category: "Nature",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    href: "/gallery/nature-beauty"
  }
]

const latestPosts = [
  {
    id: 1,
    title: "10 Tips for Perfect Wedding Photography",
    excerpt: "Discover the secrets to capturing unforgettable wedding moments...",
    date: "March 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=250&fit=crop",
    href: "/blog/wedding-photography-tips"
  },
  {
    id: 2,
    title: "The Art of Portrait Lighting",
    excerpt: "Master the fundamentals of portrait lighting techniques...",
    date: "March 10, 2024", 
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1554080353-a576cf803bda?w=400&h=250&fit=crop",
    href: "/blog/portrait-lighting-guide"
  }
]

const stats = [
  { label: "Happy Clients", value: "500+", icon: Users },
  { label: "Projects Completed", value: "1,200+", icon: Camera },
  { label: "Years Experience", value: "8+", icon: Award },
  { label: "Hours of Service", value: "5,000+", icon: Clock },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&h=1080&fit=crop"
            alt="Photography Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Camera className="w-4 h-4 mr-2" />
              Professional Photography
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-wide leading-tight">
              Capturing Life's
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                Precious Moments
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Professional photographer specializing in weddings, portraits, and events. 
              Let me tell your story through beautiful, timeless imagery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                <Link href="/gallery">
                  View My Work
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg backdrop-blur-sm"
              >
                <Link href="/contact">
                  Book a Session
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Featured Galleries */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
              Featured Work
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore my latest photography collections and discover the stories behind each image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGalleries.map((gallery) => (
              <Card key={gallery.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={gallery.coverImage}
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900">
                    {gallery.category}
                  </Badge>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {gallery.imageCount} photos
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-gray-600 transition-colors">
                    {gallery.title}
                  </CardTitle>
                  <CardDescription>{gallery.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full group">
                    <Link href={gallery.href}>
                      View Gallery
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/gallery">
                View All Galleries
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* About Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop"
                  alt="Photographer Portrait"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-white" />
              </div>
            </div>

            {/* About Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
                  Hi, I'm Michael Rodriguez
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  With over 8 years of experience in professional photography, I specialize in 
                  capturing the authentic emotions and beautiful moments that make your story unique.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  From intimate weddings to corporate events, I bring a creative eye and 
                  professional approach to every shoot, ensuring you receive stunning images 
                  that you'll treasure forever.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                  <span className="text-gray-700 dark:text-gray-300">Award-winning photographer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-gray-700 dark:text-gray-300">500+ happy clients</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                  <span className="text-gray-700 dark:text-gray-300">Based in New York, available worldwide</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/about">
                    Learn More About Me
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/portfolio">
                    View Portfolio
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6">
              Latest Insights
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Photography tips, behind-the-scenes stories, and industry insights from my experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {latestPosts.map((post) => (
              <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-gray-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="w-full group">
                    <Link href={post.href}>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">
                View All Posts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Quote className="w-12 h-12 mx-auto text-gray-300" />
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Ready to Create Beautiful Memories Together?
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed">
              Let's discuss your photography needs and create something amazing. 
              Book a consultation today and let's bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                <Link href="/contact">
                  Book Your Session
                  <Calendar className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
              >
                <Link href="/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}