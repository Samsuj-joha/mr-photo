// src/app/api/features/route.ts - FIXED PUBLIC API
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/features - Get published features for public site
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    
    const where: any = { published: true }
    
    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }

    // Fetch features (Prisma manages connection pool automatically)
    const features = await db.feature.findMany({
      where,
      orderBy: [
        { featured: 'desc' }, // Featured first
        { order: 'asc' },     // Then by order
        { createdAt: 'desc' } // Then by creation date
      ]
    })

    // Return with caching headers for better performance
    return NextResponse.json(features, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
    
  } catch (error) {
    console.error('💥 Unexpected error in features API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}