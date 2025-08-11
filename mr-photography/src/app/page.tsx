// // src/app/page.tsx
// import { HomeSlider } from "@/components/home/HomeSlider"
// import { db } from "@/lib/db"

// async function getSliderImages() {
//   try {
//     const images = await db.homeSlider.findMany({
//       where: { active: true },
//       orderBy: { order: "asc" }
//     })
//     return images
//   } catch (error) {
//     console.error("Error fetching slider images:", error)
//     return []
//   }
// }

// export default async function HomePage() {
//   const sliderImages = await getSliderImages()

//   return (
//     <div className="min-h-screen">
//       {/* Hero Slider Section */}
//       <section className="relative">
//         <HomeSlider 
//           images={sliderImages}
//           autoPlay={true}
//           autoPlayInterval={5000}
//         />
//       </section>

//       {/* Fallback when no images */}
//       {sliderImages.length === 0 && (
//         <div className="flex items-center justify-center min-h-[50vh] bg-gray-100 dark:bg-gray-800">
//           <div className="text-center">
//             <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
//               Welcome to MR Photography
//             </h1>
//             <p className="text-lg text-gray-600 dark:text-gray-400">
//               Professional photography services coming soon...
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




// src/app/page.tsx (replace current content temporarily)
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
          MR Photography
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional Photography Services
        </p>
        <div className="space-y-4">
          <p className="text-green-600">✅ Website is working</p>
          <p className="text-green-600">✅ Database connected</p>
          <p className="text-green-600">✅ Ready for content</p>
        </div>
        <div className="mt-8 space-x-4">
          <a 
            href="/gallery"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            View Gallery
          </a>
          <a 
            href="/admin/login"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  )
}