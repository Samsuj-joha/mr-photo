// src/app/api/admin/features/route.ts - CREATE THIS FILE
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/features - Get all features for admin
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin features API called...')
    
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

    // Check authentication
    let session
    try {
      session = await getServerSession(authOptions)
      console.log('🔐 Session check:', session ? 'Found' : 'Not found')
    } catch (authError) {
      console.error('❌ Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 500 }
      )
    }
    
    if (!session || session.user.role !== 'ADMIN') {
      console.log('🚫 Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('👤 Admin user authenticated:', session.user.email)

    // Check if Feature table exists
    try {
      const tableExists = await db.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'Feature'
        );
      `
      console.log('📊 Feature table exists check:', tableExists)
    } catch (tableError) {
      console.error('❌ Feature table check failed:', tableError)
      return NextResponse.json(
        { error: 'Feature table does not exist. Please run: npx prisma migrate dev' },
        { status: 500 }
      )
    }

    // Try to fetch features
    try {
      console.log('🔍 Attempting to fetch features...')
      const features = await db.feature.findMany({
        orderBy: [
          { featured: 'desc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      })
      
      console.log(`✅ Successfully fetched ${features.length} features`)
      
      // Ensure we return an array
      if (!Array.isArray(features)) {
        console.error('❌ Features is not an array:', typeof features)
        return NextResponse.json(
          { error: 'Invalid data format returned from database' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(features)
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

  } catch (error) {
    console.error('❌ Unexpected error in admin features API:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/features - Create new feature
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new feature...')
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    console.log('📦 Received data:', {
      title: data.title,
      hasImage: !!data.image,
      imageUrl: data.image ? data.image.substring(0, 50) + '...' : 'none',
      publicId: data.publicId
    })
    
    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Create feature with all fields
    const feature = await db.feature.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        image: data.image || null,        // ✅ FIXED: Ensure image is saved
        publicId: data.publicId || null,  // ✅ FIXED: Ensure publicId is saved
        icon: data.icon || null,
        published: data.published ?? true,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      }
    })

    console.log('✅ Feature created successfully:', {
      id: feature.id,
      title: feature.title,
      hasImage: !!feature.image,
      imageUrl: feature.image
    })

    return NextResponse.json(feature, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating feature:', error)
    return NextResponse.json(
      { error: 'Failed to create feature', details: error.message },
      { status: 500 }
    )
  }
}