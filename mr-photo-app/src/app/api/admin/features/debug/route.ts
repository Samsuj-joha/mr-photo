// src/app/api/admin/features/debug/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔍 Debug API called - fetching all features from database...')

    const features = await db.feature.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 Found ${features.length} features in database`)

    const debugData = {
      totalFeatures: features.length,
      featuresWithImages: features.filter(f => f.image).length,
      featuresWithoutImages: features.filter(f => !f.image).length,
      features: features.map(feature => ({
        id: feature.id,
        title: feature.title,
        hasImage: !!feature.image,
        imageUrl: feature.image,
        imageLength: feature.image ? feature.image.length : 0,
        publicId: feature.publicId,
        published: feature.published,
        featured: feature.featured,
        createdAt: feature.createdAt
      }))
    }

    console.log('🔍 Debug data:', debugData)

    return NextResponse.json(debugData)
  } catch (error) {
    console.error('💥 Debug API error:', error)
    return NextResponse.json(
      { error: 'Debug API failed', details: error.message },
      { status: 500 }
    )
  }
}