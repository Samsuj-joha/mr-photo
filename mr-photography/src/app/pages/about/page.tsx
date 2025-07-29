// File: /src/app/pages/about/page.tsx

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Award, 
  Heart, 
  Users,
  MapPin,
  Calendar,
  Star,
  Quote,
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb,
  Zap
} from "lucide-react"

const achievements = [
  {
    icon: Award,
    title: "Award Winner",
    description: "2023 Wedding Photographer of the Year"
  },
  {
    icon: Users,
    title: "500+ Happy Clients",
    description: "Trusted by couples worldwide"
  },
  {
    icon: Camera,
    title: "8+ Years Experience",
    description: "Professional photography since 2016"
  },
  {
    icon: Star,
    title: "5-Star Rated",
    description: "Consistently rated excellence"
  }
]

const values = [
  {
    icon: Heart,
    title: "Passion-Driven",
    description: "Every photo is created with love and dedication to the craft"
  },
  {
    icon: Target,
    title: "Detail-Oriented",
    description: "Meticulous attention to every element that makes a perfect shot"
  },
  {
    icon: Lightbulb,
    title: "Creative Vision",
    description: "Unique perspective that brings your story to life"
  },
  {
    icon: Zap,
    title: "Professional Excellence",
    description: "Reliable, punctual, and committed to exceeding expectations"
  }
]

const testimonials = [
  {
    name: "Sarah & John",
    role: "Wedding Clients",
    content: "Michael captured our wedding day perfectly. Every emotion, every moment was beautifully preserved. We couldn't be happier with our photos!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Emma Thompson",
    role: "Portrait Client",
    content: "The portrait session was amazing. Michael made me feel comfortable and the results were beyond my expectations. Highly recommended!",
    image: "https://images.unsplash.com/photo-1494790108755-2616b55e81eb?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "TechCorp Inc.",
    role: "Corporate Client",
    content: "Professional, reliable, and talented. Michael documented our annual conference beautifully. The photos perfectly captured our company culture.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Content */}
            <div className="space-y-8">
              <div>
                <Badge className="mb-4">About Me</Badge>
                <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 leading-tight">
                  Hi, I'm Michael Rodriguez
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  A passionate photographer dedicated to capturing life's most precious moments 
                  through the art of storytelling with light and emotion.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Based in New York with over 8 years of experience, I specialize in wedding, 
                  portrait, and event photography. My goal is to create timeless images that 
                  you'll treasure forever.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg flex items-center justify-center shrink-0">
                      <achievement.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Let's Work Together
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/portfolio">
                    View My Work
                  </Link>
                </Button>
              </div>
            </div>

            {/* Photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop"
                  alt="Michael Rodriguez - Professional Photographer"
                  width={600}
                  height={750}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
                <Camera className="w-16 h-16 text-white" />
              </div>
              <div className="absolute top-6 right-6 bg-white dark:bg-gray-900 rounded-full p-4 shadow-lg">
                <Quote className="w-8 h-8 text-gray-800 dark:text-gray-200" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
                My Photography Journey
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                From a hobby to a passion, to a lifelong career capturing moments that matter
              </p>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2016</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">The Beginning</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Started as a hobby, photographing friends and family events. Quickly realized 
                    this was more than just a pastime.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2018</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Going Pro</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Launched MR Photography professionally. Shot my first wedding and 
                    knew I had found my calling.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2024</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Today</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    500+ happy clients, award-winning work, and still as passionate 
                    as day one about capturing your story.
                  </p>
                </div>

              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8">
                <Quote className="w-12 h-12 text-gray-400 mb-6 mx-auto" />
                <blockquote className="text-xl text-gray-700 dark:text-gray-300 text-center leading-relaxed italic">
                  "Photography is not just about capturing what you see, but about revealing 
                  the emotions and stories that exist between the moments. Every click of the 
                  shutter is an opportunity to freeze time and create a lasting memory."
                </blockquote>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-6 font-medium">
                  - Michael Rodriguez
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              My Values & Approach
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide every photo session and client relationship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              What Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real testimonials from real clients who trusted me with their special moments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-400 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ready to Tell Your Story?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Let's create beautiful memories together. Contact me today to discuss your photography needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Link href="/contact">
                  Get In Touch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Link href="/pages/pricing">
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