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

    return NextResponse.json(books)
  } catch (error) {
    console.error("Error fetching books:", error)
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    )
  }
}