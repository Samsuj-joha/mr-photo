// src/app/page.tsx
import { HomeSlider } from "@/components/home/HomeSlider"
import { db } from "@/lib/db"

export const revalidate = 0

async function getSliderImages() {
  try {
    const images = await db.homeSlider.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    })
    
    // Return all active images - let the browser handle image loading errors
    // The HomeSlider component has built-in error handling for failed images
    // This ensures all images are shown, even if validation has issues
    return images
  } catch (error) {
    console.error("Error fetching slider images:", error)
    return []
  }
}

export default async function HomePage() {
  const sliderImages = await getSliderImages()

  return (
    <div className="">
      {/* Hero Slider Section */}
      <section className="relative">
        <HomeSlider 
          images={sliderImages}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </section>


    </div>
  )
}


