// File: src/app/api/portfolios/[id]/route.ts
// API route for fetching single Portfolio project by ID

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch single portfolio project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const portfolio = await db.portfolio.findUnique({
      where: { 
        id,
        published: true // Only show published portfolios
      }
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Transform data to match your component interface
    const transformedPortfolio = {
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description || '',
      gallery: portfolio.category, // Use category as gallery type
      coverImage: portfolio.coverImage,
      loves: Math.floor(Math.random() * 50) + 1, // Simulated - you can add this field later
      createdAt: portfolio.createdAt.toISOString(),
      client: portfolio.client || '', // Include client information
      completedAt: portfolio.completedAt ? portfolio.completedAt.toISOString() : null
    }
    
    return NextResponse.json(transformedPortfolio)
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}