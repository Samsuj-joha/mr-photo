// src/app/features/page.tsx - MINIMAL TEST VERSION
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features | MR-PHOTOGRAPHY',
  description: 'Photography features and services.',
}

// Fetch features from API
async function getFeatures() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/features`, {
      cache: 'no-store',
    })
    
    if (!response.ok) throw new Error('API failed')
    const data = await response.json()
    if (!Array.isArray(data)) return []
    
    return data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export default async function FeaturesPage() {
  const features = await getFeatures()
  const publishedFeatures = features.filter((f: any) => f.published)

  return (
    <div className="min-h-screen pt-8">
      <h1 className="text-3xl font-bold mb-8">Features</h1>
      
      {/* ABSOLUTE MINIMAL IMAGE TEST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {publishedFeatures.map((feature: any) => (
          <div key={feature.id} className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Image container */}
            <div className="w-full h-48 bg-gray-100">
              {feature.image ? (
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}