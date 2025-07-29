// File: /src/app/pages/services/page.tsx

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  Users, 
  Building,
  Camera,
  Palette,
  Mountain,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Award,
  Gift,
  Calendar,
  MapPin,
  Zap,
  DollarSign
} from "lucide-react"

const mainServices = [
  {
    id: "wedding",
    icon: Heart,
    title: "Wedding Photography",
    tagline: "Your Love Story, Beautifully Captured",
    description: "Comprehensive wedding photography services to document every precious moment of your special day.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
    features: [
      "Engagement session included",
      "Full wedding day coverage",
      "Bridal preparations",
      "Ceremony & reception",
      "600+ edited photos",
      "Online gallery delivery"
    ],
    duration: "8-12 hours",
    deliverables: "4-6 weeks",
    startingPrice: "$2,500"
  },
  {
    id: "portrait",
    icon: Users,
    title: "Portrait Photography",
    tagline: "Capturing Your Authentic Self",
    description: "Professional portrait sessions for individuals, families, couples, and personal branding.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    features: [
      "Pre-session consultation",
      "Multiple outfit changes",
      "Professional lighting",
      "Indoor/outdoor options",
      "50+ edited photos",
      "Print release included"
    ],
    duration: "1-2 hours",
    deliverables: "1-2 weeks",
    startingPrice: "$350"
  },
  {
    id: "corporate",
    icon: Building,
    title: "Corporate Events",
    tagline: "Professional Documentation",
    description: "Business events, conferences, headshots, and corporate branding photography.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    features: [
      "Event documentation",
      "Keynote speakers",
      "Networking sessions",
      "Team photography",
      "Same-day previews",
      "Commercial licensing"
    ],
    duration: "4-8 hours",
    deliverables: "1 week",
    startingPrice: "$800"
  },
  {
    id: "fashion",
    icon: Palette,
    title: "Fashion Photography",
    tagline: "Style & Creativity Combined",
    description: "Fashion shoots, model portfolios, and creative editorial photography.",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop",
    features: [
      "Creative direction",
      "Studio or location",
      "Professional styling advice",
      "Multiple looks",
      "High-fashion editing",
      "Portfolio-ready images"
    ],
    duration: "2-4 hours",
    deliverables: "2-3 weeks",
    startingPrice: "$600"
  },
  {
    id: "nature",
    icon: Mountain,
    title: "Nature & Landscape",
    tagline: "Natural Beauty Preserved",
    description: "Stunning landscape photography and nature documentation for personal or commercial use.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    features: [
      "Location scouting",
      "Golden hour sessions",
      "Weather planning",
      "Drone photography",
      "Fine art prints",
      "Licensing options"
    ],
    duration: "Half/Full day",
    deliverables: "2-3 weeks",
    startingPrice: "$450"
  },
  {
    id: "events",
    icon: Calendar,
    title: "Special Events",
    tagline: "Memorable Moments Captured",
    description: "Birthday parties, anniversaries, graduations, and other milestone celebrations.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
    features: [
      "Full event coverage",
      "Candid photography",
      "Group photos",
      "Detail shots",
      "Quick turnaround",
      "Social media ready"
    ],
    duration: "2-6 hours",
    deliverables: "1-2 weeks",
    startingPrice: "$400"
  }
]

const additionalServices = [
  {
    icon: Camera,
    title: "Photo Editing & Retouching",
    description: "Professional editing services for your existing photos",
    price: "Starting at $25/photo"
  },
  {
    icon: Gift,
    title: "Photo Albums & Prints",
    description: "Custom photo books, prints, and wall art creation",
    price: "Albums from $150"
  },
  {
    icon: Zap,
    title: "Rush Delivery",
    description: "Expedited editing and delivery for urgent needs",
    price: "+50% of package price"
  },
  {
    icon: MapPin,
    title: "Travel Photography",
    description: "Destination shoots worldwide with travel included",
    price: "Custom quote + travel"
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6">Photography Services</Badge>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 leading-tight">
              Professional Photography Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Comprehensive photography solutions for weddings, portraits, corporate events, 
              and creative projects. Every service is tailored to your unique needs and vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Book a Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pages/pricing">
                  View Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Our Photography Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From intimate portraits to grand celebrations, we offer specialized photography 
              services for every occasion and need.
            </p>
          </div>

          <div className="space-y-16">
            {mainServices.map((service, index) => (
              <div key={service.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                
                {/* Image */}
                <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={800}
                      height={600}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-6 left-6">
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                      <service.icon className="w-8 h-8 text-gray-800 dark:text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6">
                    <Badge className="bg-white/90 text-gray-900 text-lg px-4 py-2">
                      From {service.startingPrice}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div>
                    <Badge variant="outline" className="mb-3">{service.tagline}</Badge>
                    <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
                      {service.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Service Details */}
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Duration</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{service.duration}</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Delivery</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{service.deliverables}</p>
                    </div>
                    <div className="text-center">
                      <DollarSign className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Starting</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{service.startingPrice}</p>
                    </div>
                  </div>

                  <Button asChild className="w-full sm:w-auto">
                    <Link href={`/contact?service=${service.id}`}>
                      Book {service.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enhance your photography experience with our complementary services and add-ons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {additionalServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-center">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="text-sm">
                    {service.price}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              How We Work Together
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our streamlined process ensures a smooth experience from initial contact to final delivery.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Initial Consultation</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  We discuss your vision, needs, timeline, and preferences to create the perfect plan.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Planning & Preparation</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Timeline creation, location scouting, equipment preparation, and coordination.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Photo Session</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Professional photography session with premium equipment and creative direction.
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Editing & Delivery</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Professional editing and delivery through secure online gallery with print release.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Common questions about our photography services and process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How far in advance should I book?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  For weddings, we recommend booking 6-12 months in advance. For other sessions, 
                  2-4 weeks notice is usually sufficient, though we can accommodate rush requests.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you travel for shoots?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes! We're based in New York but available for destination shoots worldwide. 
                  Travel fees and accommodations are quoted separately based on location.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What's included in the session fee?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  All sessions include professional photography, basic editing, online gallery 
                  delivery, and print release. Specific inclusions vary by package.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How long until I receive my photos?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Wedding galleries are delivered within 4-6 weeks. Portrait and event sessions 
                  are typically ready within 1-2 weeks. Rush delivery is available for additional fee.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I request specific shots or poses?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Absolutely! We encourage you to share inspiration photos and specific requests. 
                  We'll work together to capture your vision while adding our creative touch.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What happens if weather affects our outdoor shoot?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We monitor weather closely and have backup plans including covered locations 
                  and rescheduling options. No additional fees for weather-related changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Let's discuss your photography needs and create something beautiful together. 
              Every project starts with a conversation about your vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8"
              >
                <Link href="/contact">
                  Book Free Consultation
                  <Calendar className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8"
              >
                <Link href="/pages/pricing">
                  View All Packages
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Flexible packages</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Professional quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}