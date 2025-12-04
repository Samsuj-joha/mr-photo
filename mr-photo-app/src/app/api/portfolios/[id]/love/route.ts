// File: src/app/api/portfolios/[id]/love/route.ts
// API route for incrementing love count on Portfolio projects

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST - Increment love count for a portfolio project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15
    const { id } = await params

    // Find the portfolio to make sure it exists
    const portfolio = await db.portfolio.findUnique({
      where: { id }
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // For now, we'll simulate love count since it's not in your current schema
    // You can add a loves field to your Portfolio model later by updating your Prisma schema:
    // 
    // model Portfolio {
    //   ...existing fields...
    //   loves Int @default(0)
    // }
    //
    // Then run: npx prisma db push
    //
    // After that, you can update this to:
    // const updatedPortfolio = await db.portfolio.update({
    //   where: { id },
    //   data: { loves: { increment: 1 } }
    // })
    
    const simulatedLoves = Math.floor(Math.random() * 50) + 1 // Random love count for demo
    
    return NextResponse.json({
      id: portfolio.id,
      loves: simulatedLoves
    })
    
  } catch (error) {
    console.error('Error updating love count:', error)
    return NextResponse.json(
      { error: 'Failed to update love count' },
      { status: 500 }
    )
  }
}