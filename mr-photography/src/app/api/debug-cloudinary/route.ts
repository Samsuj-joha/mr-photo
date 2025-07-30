// File: /src/app/api/debug-cloudinary/route.ts

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const config = {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing",
      apiKey: process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing", 
      apiSecret: process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing",
      cloudNameValue: process.env.CLOUDINARY_CLOUD_NAME,
      apiKeyValue: process.env.CLOUDINARY_API_KEY?.substring(0, 6) + "...", // Show first 6 chars only
    }

    console.log("Cloudinary Environment Check:", config)

    return NextResponse.json({
      message: "Cloudinary Environment Check",
      config,
      nextStep: "Check your .env.local file has the correct variables"
    })

  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: "Debug failed", details: String(error) },
      { status: 500 }
    )
  }
}