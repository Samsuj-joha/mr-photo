// File: src/app/api/portfolios/route.ts
// API route for fetching Portfolio projects (not Gallery images)

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all published portfolio projects
export async function GET() {
  try {
    const portfolios = await db.portfolio.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match your component interface
    const transformedPortfolios = portfolios.map(portfolio => ({
      id: portfolio.id,
      title: portfolio.title,
      description: portfolio.description || '',
      gallery: portfolio.category, // Use category as gallery type
      coverImage: portfolio.coverImage,
      loves: Math.floor(Math.random() * 50) + 1, // Simulated - you can add this field later
      createdAt: portfolio.createdAt.toISOString()
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