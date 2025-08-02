// File: src/app/api/admin/portfolios/route.ts
// Portfolio API route with your actual Prisma schema and Cloudinary config

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// GET - Fetch all portfolios from your database
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        coverImage: true,
        images: true,
        featured: true,
        published: true,
        client: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Transform data to match your component interface
    const transformedPortfolios = portfolios.map(portfolio => ({
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description || '',
      gallery: portfolio.category, // Map category to gallery for your component
      coverImage: portfolio.coverImage,
      createdAt: portfolio.createdAt.toISOString(),
      views: 0 // You can add a views field to your schema later if needed
    }))
    
    return NextResponse.json(transformedPortfolios)
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    )
  }
}

// POST - Create new portfolio with Cloudinary upload
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const gallery = formData.get('gallery') as string // This will be stored as category
    const imageFile = formData.get('image') as File

    // Validate required fields
    if (!title || !description || !gallery || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload image to Cloudinary
    let coverImageUrl = ''
    
    try {
      // Convert file to buffer
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Upload to Cloudinary
      const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'mr-photography/portfolios',
            resource_type: 'image',
            transformation: [
              { width: 800, height: 600, crop: 'fill', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(buffer)
      })

      coverImageUrl = uploadResponse.secure_url
      
    } catch (uploadError) {
      console.error('Error uploading to Cloudinary:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Save portfolio to your database
    const newPortfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        category: gallery, // Store gallery as category in your schema
        coverImage: coverImageUrl,
        images: [], // Empty array initially
        featured: false,
        published: true,
        completedAt: new Date()
      }
    })

    // Transform response to match your component interface
    const transformedPortfolio = {
      id: newPortfolio.id,
      title: newPortfolio.title,
      description: newPortfolio.description || '',
      gallery: newPortfolio.category,
      coverImage: newPortfolio.coverImage,
      createdAt: newPortfolio.createdAt.toISOString(),
      views: 0
    }

    return NextResponse.json(transformedPortfolio, { status: 201 })
    
  } catch (error) {
    console.error('Error creating portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}