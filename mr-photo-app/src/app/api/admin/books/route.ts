// src/app/api/admin/books/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch all books (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const books = await db.book.findMany({
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

// POST - Create new book
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.volume || !data.description) {
      return NextResponse.json(
        { error: "Title, volume, and description are required" },
        { status: 400 }
      )
    }
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingBook = await db.book.findUnique({
      where: { slug }
    })

    if (existingBook) {
      return NextResponse.json(
        { error: "A book with this title already exists" },
        { status: 400 }
      )
    }

    // Get the highest order number
    const lastBook = await db.book.findFirst({
      orderBy: { order: 'desc' }
    })
    
    const newOrder = lastBook ? lastBook.order + 1 : 0

    // Create the book
    const book = await db.book.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        author: data.author || "Moshiur Rahman",
        description: data.description,
        volume: data.volume,
        pages: parseInt(data.pages) || 0,
        rating: parseFloat(data.rating) || 5.0,
        category: data.category || "",
        coverImage: data.coverImage || null,
        coverImagePublicId: data.coverImagePublicId || null,
        pdfUrl: data.pdfUrl || null,
        pdfPublicId: data.pdfPublicId || null,
        slug: slug,
        featured: Boolean(data.featured),
        published: Boolean(data.published),
        order: newOrder,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date()
      }
    })

    // Add tags if provided
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      await Promise.all(
        data.tags.map((tag: { name: string; color: string }) =>
          db.bookTag.create({
            data: {
              name: tag.name,
              color: tag.color || 'blue',
              bookId: book.id
            }
          })
        )
      )
    }

    // Fetch the complete book with tags
    const completeBook = await db.book.findUnique({
      where: { id: book.id },
      include: { tags: true }
    })

    return NextResponse.json(completeBook, { status: 201 })
  } catch (error) {
    console.error("Error creating book:", error)
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "A book with this title already exists" },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    )
  }
}