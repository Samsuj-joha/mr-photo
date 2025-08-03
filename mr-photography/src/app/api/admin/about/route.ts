import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch about page data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const about = await db.about.findFirst()

    // If no about page exists, return default structure
    if (!about) {
      return NextResponse.json({
        id: null,
        name: "MR Photography",
        description: "Professional photographer specializing in capturing life's most precious moments with artistic vision and technical excellence.",
        profileImage: null,
        profileImagePublicId: null,
        journeyTitle: "My Photography Journey",
        journeyContent: "My journey into photography began with a simple curiosity about capturing moments that matter. Over the years, this passion has evolved into a professional career dedicated to preserving memories and telling stories through the lens.\n\nEach photograph represents a unique moment in time, a story waiting to be told, and an emotion waiting to be felt. Through years of experience and countless sessions, I've learned that the best photographs come from authentic connections and genuine moments.\n\nFrom my first camera to today's advanced equipment, the core of my work remains the same: creating beautiful, meaningful images that my clients will treasure for generations.",
        valuesTitle: "My Values & Approach",
        valuesContent: "I believe that photography is more than just taking pictures – it's about creating art that speaks to the soul and preserves the essence of every moment.\n\n**Authenticity First**: I focus on capturing genuine emotions and natural interactions, ensuring every photo feels real and heartfelt.\n\n**Personal Connection**: Taking the time to understand my clients' vision and building trust that allows for comfortable, natural sessions.\n\n**Attention to Detail**: From lighting and composition to post-processing, every aspect is carefully considered to deliver exceptional results.\n\n**Timeless Quality**: Creating images that will look just as beautiful decades from now as they do today.",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error("Error fetching about page:", error)
    return NextResponse.json(
      { error: "Failed to fetch about page data" },
      { status: 500 }
    )
  }
}

// POST - Create or update about page data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    // Check if about page already exists
    const existingAbout = await db.about.findFirst()

    if (existingAbout) {
      // Update existing about page
      const updatedAbout = await db.about.update({
        where: { id: existingAbout.id },
        data: {
          name: data.name,
          description: data.description,
          profileImage: data.profileImage,
          profileImagePublicId: data.profileImagePublicId,
          journeyTitle: data.journeyTitle,
          journeyContent: data.journeyContent,
          valuesTitle: data.valuesTitle,
          valuesContent: data.valuesContent,
          published: data.published
        }
      })

      return NextResponse.json(updatedAbout)
    } else {
      // Create new about page
      const newAbout = await db.about.create({
        data: {
          name: data.name,
          description: data.description,
          profileImage: data.profileImage,
          profileImagePublicId: data.profileImagePublicId,
          journeyTitle: data.journeyTitle,
          journeyContent: data.journeyContent,
          valuesTitle: data.valuesTitle,
          valuesContent: data.valuesContent,
          published: data.published
        }
      })

      return NextResponse.json(newAbout, { status: 201 })
    }
  } catch (error) {
    console.error("Error saving about page:", error)
    return NextResponse.json(
      { error: "Failed to save about page data" },
      { status: 500 }
    )
  }
}