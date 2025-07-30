// src/app/page.tsx - Fixed version
import { HomeSlider } from "@/components/home/HomeSlider"
import { db } from "@/lib/db"

async function getSliderImages() {
  try {
    const images = await db.homeSlider.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    })
    return images
  } catch (error) {
    console.error("Error fetching slider images:", error)
    return []
  }
}

export default async function HomePage() {
  const sliderImages = await getSliderImages()

  return (
    <div className="min-h-screen">
      {/* Hero Slider Section */}
      <section className="relative">
        <HomeSlider 
          images={sliderImages}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </section>

      {/* Fallback when no images */}
      {sliderImages.length === 0 && (
        <div className="flex items-center justify-center min-h-[70vh] bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
              Welcome to MR Photography
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Professional photography services coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}