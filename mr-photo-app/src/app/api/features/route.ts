// src/app/api/features/route.ts - FIXED PUBLIC API
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/features - Get published features for public site
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Public features API called...')
    
    // Test database connection first
    try {
      await db.$connect()
      console.log('✅ Database connected successfully')
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json(
        { error: 'Database connection failed', details: dbError.message },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    
    console.log('🔍 Query params:', { featured })
    
    const where: any = { published: true }
    
    if (featured !== null && featured !== undefined) {
      where.featured = featured === 'true'
    }

    console.log('📋 Where clause:', where)

    // Check if Feature table exists
    try {
      const tableExists = await db.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'Feature'
        );
      `
      console.log('📊 Feature table exists:', tableExists)
    } catch (tableError) {
      console.error('❌ Feature table check failed:', tableError)
      return NextResponse.json(
        { error: 'Feature table does not exist. Please run: npx prisma migrate dev' },
        { status: 500 }
      )
    }

    // Fetch features
    let features
    try {
      features = await db.feature.findMany({
        where,
        orderBy: [
          { featured: 'desc' }, // Featured first
          { order: 'asc' },     // Then by order
          { createdAt: 'desc' } // Then by creation date
        ]
      })
      
      console.log(`✅ Successfully fetched ${features.length} features`)
      
      // Log each feature for debugging
      features.forEach((feature, index) => {
        console.log(`Feature ${index + 1}:`, {
          id: feature.id,
          title: feature.title,
          published: feature.published,
          featured: feature.featured,
          hasImage: !!feature.image,
          imageUrl: feature.image ? feature.image.substring(0, 50) + '...' : 'none'
        })
      })
      
    } catch (fetchError) {
      console.error('❌ Error fetching features:', fetchError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch features', 
          details: fetchError.message,
          hint: 'The Feature table might not exist. Run: npx prisma migrate dev'
        },
        { status: 500 }
      )
    }

    // Make sure we return an array
    if (!Array.isArray(features)) {
      console.error('❌ Features is not an array:', typeof features, features)
      return NextResponse.json(
        { error: 'Invalid data format returned from database' },
        { status: 500 }
      )
    }

    console.log('✅ Returning features array with length:', features.length)
    return NextResponse.json(features)
    
  } catch (error) {
    console.error('💥 Unexpected error in features API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}