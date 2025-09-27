// File: src/app/api/portfolios/categories/route.ts
// API route to fetch dynamic portfolio categories

import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all unique portfolio categories with counts
export async function GET() {
  try {
    // Get all published portfolios with their categories
    const portfolios = await db.portfolio.findMany({
      where: {
        published: true
      },
      select: {
        category: true
      }
    })

    // Count portfolios by category
    const categoryMap = new Map<string, number>()
    let totalCount = 0

    portfolios.forEach(portfolio => {
      if (portfolio.category) {
        const count = categoryMap.get(portfolio.category) || 0
        categoryMap.set(portfolio.category, count + 1)
        totalCount++
      }
    })

    // Convert to array and sort by count (descending)
    const categories = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category,
        count
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      success: true,
      totalCount,
      categories
    })
    
  } catch (error) {
    console.error('Error fetching portfolio categories:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch categories',
        totalCount: 0,
        categories: []
      },
      { status: 500 }
    )
  }
}