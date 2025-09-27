import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const dbUrl = process.env.DATABASE_URL
    const nextAuthUrl = process.env.NEXTAUTH_URL
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: {
        hasDatabase: !!dbUrl,
        databaseHost: dbUrl ? dbUrl.split('@')[1]?.split(':')[0] : 'Not found',
        nextAuthUrl: nextAuthUrl,
        nodeEnv: process.env.NODE_ENV
      },
      message: "Debug API working"
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}