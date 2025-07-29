// File: /src/app/pages/pricing/page.tsx

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
  Calendar,
  ArrowRight,
  CheckCircle,
  X,
  Star,
  Award,
  Gift,
  Zap,
  Crown,
  Phone
} from "lucide-react"

const pricingPlans = [
  {
    name: "Essential Portrait",
    category: "portrait",
    price: "$350",
    duration: "1 hour",
    delivery: "1-2 weeks",
    popular: false,
    description: "Perfect for individual portraits and headshots",
    features: [
      "1 hour photo session",
      "1-2 outfit changes",
      "Professional lighting",
      "25+ edited photos",
      "Online gallery",
      "Print release",
      "Basic retouching"
    ],
    notIncluded: [
      "Hair & makeup",
      "Additional locations",
      "Rush delivery"
    ]
  },
  {
    name: "Premium Portrait",
    category: "portrait",
    price: "$550",
    duration: "2 hours",
    delivery: "1-2 weeks",
    popular: true,
    description: "Comprehensive portrait session with multiple looks",
    features: [
      "2 hour photo session",
      "3-4 outfit changes",
      "Multiple locations",
      "Professional lighting",
      "50+ edited photos",
      "Online gallery",
      "Print release",
      "Advanced retouching",
      "Pre-session consultation"
    ],
    notIncluded: [
      "Hair & makeup",
      "Rush delivery"
    ]
  },
  {
    name: "Wedding Essential",
    category: "wedding",
    price: "$2,500",
    duration: "8 hours",
    delivery: "4-6 weeks",
    popular: false,
    description: "Complete wedding day coverage",
    features: [
      "8 hours coverage",
      "Engagement session",
      "Bridal preparations",
      "Ceremony & reception",
      "600+ edited photos",
      "Online gallery",
      "Print release",
      "USB with photos",
      "Timeline planning"
    ],
    notIncluded: [
      "Second photographer",
      "Raw files",
      "Same-day preview"
    ]
  },
  {
    name: "Wedding Premium",
    category: "wedding",
    price: "$3,800",
    duration: "10 hours",
    delivery: "4-6 weeks",
    popular: true,
    description: "Luxury wedding photography experience",
    features: [
      "10 hours coverage",
      "Second photographer",
      "Engagement session",
      "Bridal preparations",
      "Ceremony & reception",
      "800+ edited photos",
      "Online gallery",
      "Print release",
      "USB with photos",
      "Same-day preview",
      "Timeline planning",
      "Emergency backup"
    ],
    notIncluded: [
      "Raw files",
      "Video services"
    ]
  },
  {
    name: "Corporate Standard",
    category: "corporate",
    price: "$800",
    duration: "4 hours",
    delivery: "1 week",
    popular: false,
    description: "Professional corporate event documentation",
    features: [
      "4 hours coverage",
      "Event documentation",
      "Keynote speakers",
      "Networking sessions",
      "200+ edited photos",
      "Online gallery",
      "Commercial license",
      "Same-day previews"
    ],
    notIncluded: [
      "Video services",
      "Drone photography",
      "Rush delivery"
    ]
  },
  {
    name: "Corporate Premium",
    category: "corporate",
    price: "$1,400",
    duration: "8 hours",
    delivery: "1 week",
    popular: false,
    description: "Comprehensive corporate photography solution",
    features: [
      "8 hours coverage",
      "Multiple photographers",
      "Event documentation",
      "Team photography",
      "Headshots",
      "400+ edited photos",
      "Online gallery",
      "Commercial license",
      "Same-day previews",
      "Rush delivery included"
    ],
    notIncluded: [
      "Video services",
      "Raw files"
    ]
  }
]

const addOns = [
  {
    name: "Second Photographer",
    price: "$400",
    description: "Additional photographer for comprehensive coverage"
  },
  {
    name: "Hair & Makeup Artist",
    price: "$300",
    description: "Professional styling for your photo session"
  },
  {
    name: "Rush Delivery",
    price: "$200",
    description: "48-72 hour delivery instead of standard timeline"
  },
  {
    name: "Raw Files",
    price: "$500",
    description: "Unedited RAW files in addition to edited photos"
  },
  {
    name: "Additional Hours",
    price: "$200/hr",
    description: "Extend your photo session beyond package hours"
  },
  {
    name: "Photo Album",
    price: "$350",
    description: "Custom designed photo book (20 pages)"
  }
]

export default function PricingPage() {
  const getIcon = (category: string) => {
    switch (category) {
      case 'portrait': return Users
      case 'wedding': return Heart
      case 'corporate': return Building
      default: return Camera
    }
  }

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6">Transparent Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 leading-tight">
              Photography Packages & Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              Clear, transparent pricing for all photography services. No hidden fees, 
              no surprises. Choose the package that fits your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get Custom Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pages/services">
                  View All Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Portrait Packages */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-800 dark:text-gray-200 mr-3" />
                <h2 className="text-3xl font-light text-gray-900 dark:text-white">
                  Portrait Photography
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Professional portraits for individuals, families, couples, and personal branding
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.filter(plan => plan.category === 'portrait').map((plan, index) => (
                <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-gray-800 dark:ring-gray-200' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 w-full">
                      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-center py-2 text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={plan.popular ? 'pt-12' : ''}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {plan.popular && <Star className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/ {plan.duration}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.notIncluded.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                          <X className="w-4 h-4 text-gray-400 mr-2" />
                          Add-ons Available
                        </h4>
                        <ul className="space-y-2">
                          {plan.notIncluded.map((item, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-500 dark:text-gray-400">
                              <X className="w-4 h-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      asChild 
                      className={`w-full ${plan.popular ? 'bg-gray-800 hover:bg-gray-700' : ''}`}
                    >
                      <Link href={`/contact?package=${plan.name.toLowerCase().replace(' ', '-')}`}>
                        Book {plan.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Wedding Packages */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-800 dark:text-gray-200 mr-3" />
                <h2 className="text-3xl font-light text-gray-900 dark:text-white">
                  Wedding Photography
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Comprehensive wedding photography to capture every moment of your special day
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.filter(plan => plan.category === 'wedding').map((plan, index) => (
                <Card key={index} className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-gray-800 dark:ring-gray-200' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 left-0 w-full">
                      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white text-center py-2 text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={plan.popular ? 'pt-12' : ''}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      {plan.popular && <Crown className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/ {plan.duration}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      asChild 
                      className={`w-full ${plan.popular ? 'bg-gray-800 hover:bg-gray-700' : ''}`}
                    >
                      <Link href={`/contact?package=${plan.name.toLowerCase().replace(' ', '-')}`}>
                        Book {plan.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Corporate Packages */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Building className="w-8 h-8 text-gray-800 dark:text-gray-200 mr-3" />
                <h2 className="text-3xl font-light text-gray-900 dark:text-white">
                  Corporate Photography
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Professional documentation for business events, conferences, and corporate needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {pricingPlans.filter(plan => plan.category === 'corporate').map((plan, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400">/ {plan.duration}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        What's Included
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/contact?package=${plan.name.toLowerCase().replace(' ', '-')}`}>
                        Book {plan.name}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Add-ons & Extras
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Enhance your photography package with additional services and options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {addon.name}
                    </h3>
                    <Badge variant="outline">{addon.price}</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {addon.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
              Pricing FAQ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Common questions about our pricing and payment process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What's included in the package price?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  All packages include professional photography, editing, online gallery, 
                  print release, and the specified number of edited photos. Travel within 
                  30 miles is included.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How does payment work?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We require a 50% deposit to secure your date, with the remaining balance 
                  due on the day of the shoot. We accept cash, check, and all major credit cards.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Are there any hidden fees?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No hidden fees! Our pricing is transparent. Additional costs only apply 
                  for add-ons you choose, travel beyond 30 miles, or special requests 
                  discussed in advance.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Can I customize a package?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Absolutely! We can customize any package to fit your specific needs and 
                  budget. Contact us for a personalized quote based on your requirements.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What if I need to reschedule?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We understand life happens! Rescheduling is free with at least 48 hours 
                  notice. For weather-related changes, there are no fees regardless of timing.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer payment plans?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Yes! For wedding packages over $2,000, we offer payment plans. Contact us 
                  to discuss a schedule that works for your budget.
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
            <Gift className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ready to Book Your Session?
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Don't see exactly what you need? Let's create a custom package that 
              fits your vision and budget perfectly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8"
              >
                <Link href="/contact">
                  Get Custom Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8"
              >
                <Link href="tel:+15551234567">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Link>
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Free Consultation</h3>
                <p className="text-gray-300 text-sm">Discuss your needs with no commitment</p>
              </div>
              <div>
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Flexible Packages</h3>
                <p className="text-gray-300 text-sm">Customizable options for every budget</p>
              </div>
              <div>
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Satisfaction Guaranteed</h3>
                <p className="text-gray-300 text-sm">Your happiness is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}