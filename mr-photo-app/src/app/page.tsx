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
    
    // Map database records to component format
    // Ensure imageUrl field is properly mapped
    return images.map(image => ({
      id: image.id,
      title: image.title || undefined,
      description: image.description || undefined,
      imageUrl: image.imageUrl, // Ensure this field is correctly mapped
      alt: image.alt || undefined,
      linkUrl: image.linkUrl || undefined,
      linkText: image.linkText || undefined,
    }))
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


