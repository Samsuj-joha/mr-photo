// src/app/api/admin/books/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch single book
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const book = await db.book.findUnique({
      where: { id },
      include: { tags: true }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error fetching book:", error)
    return NextResponse.json(
      { error: "Failed to fetch book" },
      { status: 500 }
    )
  }
}

// PUT - Update book
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    console.log("🔄 Updating book with ID:", id)
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      console.log("❌ Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    console.log("📝 Update data received:", JSON.stringify(data, null, 2))
    
    // Validate required fields
    if (!data.title || !data.volume || !data.description) {
      console.log("❌ Missing required fields")
      return NextResponse.json(
        { error: "Title, volume, and description are required" },
        { status: 400 }
      )
    }

    // Check if book exists first
    const existingBook = await db.book.findUnique({
      where: { id },
      include: { tags: true }
    })

    if (!existingBook) {
      console.log("❌ Book not found:", id)
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    console.log("📚 Found existing book:", existingBook.title)
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    console.log("🔗 Generated slug:", slug)

    // Check if slug already exists (but not for current book)
    const slugExists = await db.book.findFirst({
      where: { 
        slug: slug,
        NOT: { id }
      }
    })

    if (slugExists) {
      console.log("❌ Slug already exists:", slug)
      return NextResponse.json(
        { error: "A book with this title already exists" },
        { status: 400 }
      )
    }

    // Prepare update data with safe type conversion
    const updateData = {
      title: data.title,
      subtitle: data.subtitle || null,
      author: data.author || "Moshiur Rahman",
      description: data.description,
      volume: data.volume,
      pages: data.pages ? parseInt(String(data.pages)) : 0,
      rating: data.rating ? parseFloat(String(data.rating)) : 0.0,
      category: data.category || "",
      coverImage: data.coverImage || null,
      coverImagePublicId: data.coverImagePublicId || null,
      pdfUrl: data.pdfUrl || null,
      pdfPublicId: data.pdfPublicId || null,
      slug: slug,
      featured: Boolean(data.featured),
      published: Boolean(data.published),
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : existingBook.publishedAt
    }

    console.log("📝 Prepared update data:", JSON.stringify(updateData, null, 2))

    // Update the book
    const book = await db.book.update({
      where: { id },
      data: updateData
    })

    console.log("✅ Book updated successfully")

    // Delete existing tags
    console.log("🏷️ Deleting existing tags...")
    await db.bookTag.deleteMany({
      where: { bookId: id }
    })

    // Add new tags
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      console.log("🏷️ Adding new tags:", data.tags.length)
      
      const tagPromises = data.tags.map((tag: { name: string; color: string }, index: number) => {
        console.log(`🏷️ Creating tag ${index + 1}:`, tag.name, tag.color)
        return db.bookTag.create({
          data: {
            name: tag.name,
            color: tag.color || 'blue',
            bookId: book.id
          }
        })
      })

      await Promise.all(tagPromises)
      console.log("✅ All tags created successfully")
    }

    // Fetch the complete book with tags
    console.log("📚 Fetching complete book with tags...")
    const completeBook = await db.book.findUnique({
      where: { id: book.id },
      include: { tags: true }
    })

    console.log("✅ Book update completed successfully")
    return NextResponse.json(completeBook)
    
  } catch (error) {
    console.error("❌ Error updating book:", error)
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "A book with this title already exists" },
          { status: 400 }
        )
      }
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { error: "Book not found" },
          { status: 404 }
        )
      }
      if (error.message.includes('Invalid `prisma.book.update()`')) {
        return NextResponse.json(
          { error: "Invalid data provided for book update" },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    )
  }
}

// DELETE - Delete book
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params
    
    console.log("🗑️ Deleting book with ID:", id)
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the book first to access file publicIds for cleanup
    const book = await db.book.findUnique({
      where: { id }
    })

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    console.log("📚 Found book to delete:", book.title)

    // Delete files if they exist
    if (book.coverImagePublicId) {
      try {
        console.log("🖼️ Deleting cover image:", book.coverImagePublicId)
        const { deleteImage } = await import("@/lib/cloudinary")
        await deleteImage(book.coverImagePublicId)
        console.log("✅ Cover image deleted")
      } catch (error) {
        console.error("❌ Error deleting cover image:", error)
      }
    }

    if (book.pdfPublicId) {
      try {
        console.log("📄 Deleting PDF:", book.pdfPublicId)
        if (book.pdfPublicId.includes('.pdf')) {
          // Delete local PDF file
          const { unlink } = await import('fs/promises')
          const path = await import('path')
          const filepath = path.join(process.cwd(), 'public', 'uploads', 'pdfs', book.pdfPublicId)
          await unlink(filepath)
          console.log("✅ Local PDF deleted")
        } else {
          // Delete from Cloudinary
          const { deleteImage } = await import("@/lib/cloudinary")
          await deleteImage(book.pdfPublicId)
          console.log("✅ Cloudinary PDF deleted")
        }
      } catch (error) {
        console.error("❌ Error deleting PDF file:", error)
      }
    }

    // Delete the book (tags will be deleted automatically due to cascade)
    await db.book.delete({
      where: { id }
    })

    console.log("✅ Book deleted successfully")
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error("❌ Error deleting book:", error)
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    )
  }
}