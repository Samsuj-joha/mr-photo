// src/app/api/admin/features/[id]/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { deleteImage } from '@/lib/cloudinary'

// GET /api/admin/features/[id] - Get single feature for admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const feature = await db.feature.findUnique({
      where: { id }
    })

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(feature)
  } catch (error) {
    console.error('Error fetching feature:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feature' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/features/[id] - Update feature
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔄 Updating feature...')
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { id } = await params

    console.log('📦 Update data received:', {
      id,
      title: data.title,
      hasImage: !!data.image,
      imageUrl: data.image ? data.image.substring(0, 50) + '...' : 'none',
      publicId: data.publicId
    })

    // Check if feature exists
    const existingFeature = await db.feature.findUnique({
      where: { id }
    })

    if (!existingFeature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    console.log('📋 Existing feature:', {
      title: existingFeature.title,
      hasImage: !!existingFeature.image,
      existingPublicId: existingFeature.publicId
    })

    // If image is being changed and old image exists, delete it from Cloudinary
    if (data.publicId && 
        existingFeature.publicId && 
        data.publicId !== existingFeature.publicId) {
      try {
        console.log('🗑️ Deleting old image:', existingFeature.publicId)
        await deleteImage(existingFeature.publicId)
        console.log('✅ Old image deleted')
      } catch (error) {
        console.error('❌ Error deleting old image:', error)
        // Continue with update even if image deletion fails
      }
    }

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Update feature with all fields including image data
    const feature = await db.feature.update({
      where: { id },
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        image: data.image || null,        // ✅ FIXED: Properly handle image updates
        publicId: data.publicId || null,  // ✅ FIXED: Properly handle publicId updates
        icon: data.icon || null,
        published: data.published ?? true,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      }
    })

    console.log('✅ Feature updated successfully:', {
      id: feature.id,
      title: feature.title,
      hasImage: !!feature.image,
      finalImageUrl: feature.image
    })

    return NextResponse.json(feature)
  } catch (error) {
    console.error('❌ Error updating feature:', error)
    return NextResponse.json(
      { error: 'Failed to update feature', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/features/[id] - Delete feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Get feature to delete associated image
    const feature = await db.feature.findUnique({
      where: { id }
    })

    if (!feature) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary if it exists
    if (feature.publicId) {
      try {
        await deleteImage(feature.publicId)
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error)
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete feature from database
    await db.feature.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Feature deleted successfully' })
  } catch (error) {
    console.error('Error deleting feature:', error)
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    )
  }
}