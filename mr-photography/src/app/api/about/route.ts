import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch published about page data for public site
export async function GET() {
  try {
    const about = await db.about.findFirst({
      where: {
        published: true
      }
    })

    if (!about) {
      return NextResponse.json({ error: "About page not found" }, { status: 404 })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error("Error fetching about page:", error)
    return NextResponse.json(
      { error: "Failed to fetch about page" },
      { status: 500 }
    )
  }
}