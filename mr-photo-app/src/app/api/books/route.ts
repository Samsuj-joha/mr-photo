import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch published books for public site
export async function GET() {
  try {
    const books = await db.book.findMany({
      where: {
        published: true
      },
      include: {
        tags: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Return with caching headers for better performance
    return NextResponse.json(books, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    )
  }
}