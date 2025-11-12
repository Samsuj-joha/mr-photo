// src/app/api/admin/home-slider/test-image/route.ts
// Test if a specific Cloudinary image URL is accessible
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get("url")

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      )
    }

    // Test the image URL with different methods
    const tests = {
      head: null as any,
      get: null as any,
      cors: null as any,
    }

    // Test 1: HEAD request
    try {
      const headResponse = await fetch(imageUrl, { method: 'HEAD' })
      tests.head = {
        status: headResponse.status,
        ok: headResponse.ok,
        headers: {
          'content-type': headResponse.headers.get('content-type'),
          'content-length': headResponse.headers.get('content-length'),
          'access-control-allow-origin': headResponse.headers.get('access-control-allow-origin'),
          'cache-control': headResponse.headers.get('cache-control'),
        }
      }
    } catch (error) {
      tests.head = { error: error instanceof Error ? error.message : 'Unknown error' }
    }

    // Test 2: GET request (partial - just headers)
    try {
      const getResponse = await fetch(imageUrl, { 
        method: 'GET',
        headers: { 'Range': 'bytes=0-0' } // Just get first byte
      })
      tests.get = {
        status: getResponse.status,
        ok: getResponse.ok,
        headers: {
          'content-type': getResponse.headers.get('content-type'),
          'content-length': getResponse.headers.get('content-length'),
          'access-control-allow-origin': getResponse.headers.get('access-control-allow-origin'),
          'accept-ranges': getResponse.headers.get('accept-ranges'),
        }
      }
    } catch (error) {
      tests.get = { error: error instanceof Error ? error.message : 'Unknown error' }
    }

    // Test 3: Check if URL is a valid Cloudinary URL format
    const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/[^\/]+\/image\/upload\/v\d+\/.+/
    const isValidCloudinaryUrl = cloudinaryPattern.test(imageUrl)

    return NextResponse.json({
      imageUrl,
      isValidCloudinaryUrl,
      tests,
      recommendations: {
        // Check if CORS is an issue
        corsIssue: !tests.head?.headers?.['access-control-allow-origin'] && tests.head?.ok,
        // Check if URL format is correct
        urlFormatIssue: !isValidCloudinaryUrl,
        // Check if image exists
        imageExists: tests.head?.ok || tests.get?.ok,
      }
    })
  } catch (error) {
    console.error("Error testing image URL:", error)
    return NextResponse.json(
      { error: "Failed to test image URL" },
      { status: 500 }
    )
  }
}

