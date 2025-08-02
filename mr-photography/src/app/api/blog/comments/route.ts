// File: src/app/api/blog/comments/route.ts
// API endpoint for handling blog comments

import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST - Submit a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, postTitle, name, email, website, message } = body

    console.log('💬 New comment submission:', { postId, name, email })

    // Validate required fields
    if (!postId || !name || !email || !message) {
      return NextResponse.json(
        { error: "Post ID, name, email, and message are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Check if the blog post exists
    const blogPost = await db.blog.findUnique({
      where: { id: postId }
    })

    if (!blogPost) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      )
    }

    // For now, we'll save comments to your Contact table since you don't have a Comment model
    // You can create a proper Comment model later if needed
    const comment = await db.contact.create({
      data: {
        name,
        email,
        phone: website || null, // Using phone field for website temporarily
        subject: `Comment on: ${postTitle}`,
        message: `Blog Post ID: ${postId}\n\nComment:\n${message}`,
        status: 'PENDING'
      }
    })

    console.log('✅ Comment saved to database:', comment.id)

    // You could also send email notification here
    // await sendCommentNotificationEmail(comment)

    return NextResponse.json({
      success: true,
      message: "Comment submitted successfully! It will be reviewed before appearing on the site.",
      commentId: comment.id
    }, { status: 201 })

  } catch (error) {
    console.error("❌ Error submitting comment:", error)
    return NextResponse.json(
      { 
        error: "Failed to submit comment",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

// GET - Fetch comments for a blog post (for future use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      )
    }

    // For now, fetch from Contact table where subject contains the post title
    // Later you can create a proper Comment model
    const comments = await db.contact.findMany({
      where: {
        message: {
          contains: `Blog Post ID: ${postId}`
        },
        status: 'REPLIED' // Only show approved comments
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform the data to comment format
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      name: comment.name,
      email: comment.email, // Don't expose email in real app
      website: comment.phone || null,
      message: comment.message.split('\n\nComment:\n')[1] || comment.message,
      createdAt: comment.createdAt
    }))

    return NextResponse.json({
      comments: formattedComments,
      count: formattedComments.length
    })

  } catch (error) {
    console.error("❌ Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}