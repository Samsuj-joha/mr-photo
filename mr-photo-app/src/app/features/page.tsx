


// // src/app/features/page.tsx
// "use client"

// import { useState, useEffect } from 'react'
// import Image from 'next/image'
// import { FeatureImageModal } from '@/components/feature/FeatureImageModal'

// interface Feature {
//   id: string
//   title: string
//   description: string
//   image: string
//   published: boolean
// }

// // Function to truncate text to specific word count
// function truncateText(text: string, wordLimit: number): string {
//   const words = text.split(' ')
//   if (words.length <= wordLimit) return text
//   return words.slice(0, wordLimit).join(' ') + '...'
// }

// export default function FeaturesPage() {
//   const [features, setFeatures] = useState<Feature[]>([])
//   const [loading, setLoading] = useState(true)
//   const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   // Fetch features from API
//   useEffect(() => {
//     async function fetchFeatures() {
//       try {
//         const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
//         const response = await fetch(`${baseUrl}/api/features`, {
//           cache: 'no-store',
//         })
        
//         if (!response.ok) throw new Error('API failed')
//         const data = await response.json()
        
//         if (Array.isArray(data)) {
//           const publishedFeatures = data.filter((f: Feature) => f.published)
//           setFeatures(publishedFeatures)
//         }
//       } catch (error) {
//         console.error('Error fetching features:', error)
//         setFeatures([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchFeatures()
//   }, [])

//   // Handle card click to open modal
//   const handleCardClick = (feature: Feature) => {
//     setSelectedFeature(feature)
//     setIsModalOpen(true)
//   }

//   // Handle modal close
//   const handleModalClose = () => {
//     setIsModalOpen(false)
//     setSelectedFeature(null)
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-8">
//         <div className="w-full">
//           <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white px-4">
//             Features
//           </h1>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
//                 <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
//                 <div className="p-4 space-y-3">
//                   <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
//                   <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
//                   <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="min-h-screen pt-8 ">
//         <div className="w-full">
//           {/* Header Section */}
//           <div className="mb-12 px-4">
//             <h1 className="text-4xl text-left md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
//               Photography Features
//             </h1>
//           </div>

//           {/* Features Grid */}
//           {features.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
//               {features.map((feature) => (
//                 <div 
//                   key={feature.id} 
//                   onClick={() => handleCardClick(feature)}
//                   className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
//                 >
//                   {/* Image container */}
//                   <div className="relative w-full h-48 overflow-hidden">
//                     {feature.image ? (
//                       <Image 
//                         src={feature.image} 
//                         alt={feature.title}
//                         fill
//                         className="object-cover transition-transform duration-300 group-hover:scale-110"
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
//                         <div className="text-center">
//                           <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           <span className="text-sm">No Image</span>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Overlay on hover */}
//                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
//                       <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
//                         <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                         <span className="text-sm font-medium">View Details</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Content */}
//                   <div className="p-6">
//                     <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
//                       {feature.title}
//                     </h3>
//                     <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
//                       {truncateText(feature.description, 25)}
//                     </p>
                    
//                     {/* Click indicator */}
//                     <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
//                       <span>Click to view details</span>
//                       <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-16 px-4">
//               <div className="max-w-md mx-auto">
//                 <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//                 <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
//                   No Features Available
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">
//                   Features will be displayed here once they are published.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Feature Image Modal */}
//       <FeatureImageModal 
//         feature={selectedFeature}
//         isOpen={isModalOpen}
//         onClose={handleModalClose}
//       />
//     </>
//   )
// }




// src/app/features/page.tsx
"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FeatureImageModal } from '@/components/feature/FeatureImageModal'

interface Feature {
  id: string
  title: string
  description: string
  image: string
  published: boolean
}

// Function to truncate text to specific word count
function truncateText(text: string, wordLimit: number): string {
  const words = text.split(' ')
  if (words.length <= wordLimit) return text
  return words.slice(0, wordLimit).join(' ') + '...'
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch features from API
  useEffect(() => {
    async function fetchFeatures() {
      try {
        // FIXED: Use relative URL instead of baseUrl
        const response = await fetch('/api/features', {
          cache: 'no-store',
        })
        
        if (!response.ok) throw new Error('API failed')
        const data = await response.json()
        
        if (Array.isArray(data)) {
          const publishedFeatures = data.filter((f: Feature) => f.published)
          setFeatures(publishedFeatures)
        }
      } catch (error) {
        console.error('Error fetching features:', error)
        setFeatures([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  // Handle card click to open modal
  const handleCardClick = (feature: Feature) => {
    setSelectedFeature(feature)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedFeature(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="w-full">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 dark:text-white px-4">
            Features
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen pt-8 ">
        <div className="w-full">
          {/* Header Section */}
          <div className="mb-12 px-4">
            <h1 className="text-4xl text-left md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Photography Features
            </h1>
          </div>

          {/* Features Grid */}
          {features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  onClick={() => handleCardClick(feature)}
                  className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {/* Image container */}
                  <div className="relative w-full h-48 overflow-hidden">
                    {feature.image ? (
                      <Image 
                        src={feature.image} 
                        alt={feature.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">No Image</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm font-medium">View Details</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {truncateText(feature.description, 25)}
                    </p>
                    
                    {/* Click indicator */}
                    <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <span>Click to view details</span>
                      <svg className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No Features Available
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Features will be displayed here once they are published.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feature Image Modal */}
      <FeatureImageModal 
        feature={selectedFeature}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}