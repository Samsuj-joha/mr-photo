import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db" // Use your existing db import

// GET - Fetch all blogs (auth temporarily disabled for testing)
export async function GET() {
  try {
    console.log('📋 Fetching blogs from database...')
    
    const blogs = await db.blog.findMany({
      orderBy: { createdAt: "desc" }
    })

    console.log(`✅ Found ${blogs.length} blogs`)
    return NextResponse.json(blogs)
  } catch (error) {
    console.error("❌ Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// POST - Create new blog post (auth temporarily disabled for testing)
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new blog post...')
    
    const body = await request.json()
    const { title, excerpt, content, coverImage, tags, featured, published } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if slug already exists
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    })

    let finalSlug = slug
    if (existingBlog) {
      // Add timestamp to make slug unique
      finalSlug = `${slug}-${Date.now()}`
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        tags: tags || [],
        featured: featured || false,
        published: published || false,
      }
    })

    console.log('✅ Blog created:', blog.id)
    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating blog:", error)
    return NextResponse.json(
      { error: "Failed to create blog", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}