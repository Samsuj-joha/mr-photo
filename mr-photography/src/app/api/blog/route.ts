// File: /src/app/api/blog/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const published = searchParams.get("published")
    const tag = searchParams.get("tag")

    const where: any = {}
    
    if (featured !== null) {
      where.featured = featured === "true"
    }
    
    if (published !== null) {
      where.published = published === "true"
    }

    if (tag) {
      where.tags = {
        has: tag
      }
    }

    const blogs = await db.blog.findMany({
      where,
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

// POST - Create new blog post (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      title, 
      slug, 
      content, 
      excerpt, 
      coverImage, 
      published, 
      featured,
      tags 
    } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    })

    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 400 }
      )
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || "",
        coverImage: coverImage || null,
        published: published || false,
        featured: featured || false,
        tags: tags || [],
      }
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}