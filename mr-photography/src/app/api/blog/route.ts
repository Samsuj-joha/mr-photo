// // File: /src/app/api/blog/route.ts

// import { NextRequest, NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/lib/auth"
// import { db } from "@/lib/db"

// // GET - Fetch all blog posts
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const featured = searchParams.get("featured")
//     const published = searchParams.get("published")
//     const tag = searchParams.get("tag")

//     const where: any = {}
    
//     if (featured !== null) {
//       where.featured = featured === "true"
//     }
    
//     if (published !== null) {
//       where.published = published === "true"
//     }

//     if (tag) {
//       where.tags = {
//         has: tag
//       }
//     }

//     const blogs = await db.blog.findMany({
//       where,
//       orderBy: { createdAt: "desc" }
//     })

//     return NextResponse.json(blogs)
//   } catch (error) {
//     console.error("Error fetching blogs:", error)
//     return NextResponse.json(
//       { error: "Failed to fetch blogs" },
//       { status: 500 }
//     )
//   }
// }

// // POST - Create new blog post (Admin only)
// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions)
    
//     if (!session || session.user.role !== "ADMIN") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       )
//     }

//     const body = await request.json()
//     const { 
//       title, 
//       slug, 
//       content, 
//       excerpt, 
//       coverImage, 
//       published, 
//       featured,
//       tags 
//     } = body

//     if (!title || !slug || !content) {
//       return NextResponse.json(
//         { error: "Title, slug, and content are required" },
//         { status: 400 }
//       )
//     }

//     // Check if slug already exists
//     const existingBlog = await db.blog.findUnique({
//       where: { slug }
//     })

//     if (existingBlog) {
//       return NextResponse.json(
//         { error: "A blog post with this slug already exists" },
//         { status: 400 }
//       )
//     }

//     const blog = await db.blog.create({
//       data: {
//         title,
//         slug,
//         content,
//         excerpt: excerpt || "",
//         coverImage: coverImage || null,
//         published: published || false,
//         featured: featured || false,
//         tags: tags || [],
//       }
//     })

//     return NextResponse.json(blog, { status: 201 })
//   } catch (error) {
//     console.error("Error creating blog:", error)
//     return NextResponse.json(
//       { error: "Failed to create blog post" },
//       { status: 500 }
//     )
//   }
// }




// File: src/app/api/blog/route.ts
// Public API endpoint for blog posts (no auth required)

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET - Fetch published blog posts for public consumption
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const tag = searchParams.get("tag")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    console.log('📖 Fetching public blog posts...')

    // Build where clause for filtering
    const where: any = {
      published: true // Only published posts for public
    }

    if (featured !== null) {
      where.featured = featured === "true"
    }

    if (tag) {
      where.tags = {
        has: tag
      }
    }

    // Build query options
    const queryOptions: any = {
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverImage: true,
        published: true,
        featured: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      }
    }

    // Add pagination if specified
    if (limit) {
      queryOptions.take = parseInt(limit)
    }

    if (offset) {
      queryOptions.skip = parseInt(offset)
    }

    const blogs = await db.blog.findMany(queryOptions)

    console.log(`✅ Found ${blogs.length} published blog posts`)

    // Also get total count for pagination
    const totalCount = await db.blog.count({ where })

    return NextResponse.json({
      blogs,
      pagination: {
        total: totalCount,
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : 0,
        hasMore: limit ? (parseInt(offset || "0") + parseInt(limit)) < totalCount : false
      }
    })

  } catch (error) {
    console.error("❌ Error fetching public blogs:", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// HEAD - For checking if posts exist (useful for SEO/meta)
export async function HEAD() {
  try {
    const count = await db.blog.count({
      where: { published: true }
    })
    
    return new Response(null, {
      status: 200,
      headers: {
        'X-Total-Posts': count.toString(),
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    })
  } catch (error) {
    return new Response(null, { status: 500 })
  }
}