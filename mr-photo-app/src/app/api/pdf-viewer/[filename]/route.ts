// src/app/api/pdf-viewer/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Await params in Next.js 15
    const { filename } = await params
    
    // Security: Only allow PDF files and prevent directory traversal
    if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 })
    }

    // Read the PDF file
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'pdfs', filename)
    
    try {
      const fileBuffer = await readFile(filePath)
      
      // Return the PDF with proper headers for inline viewing
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="' + filename + '"', // 'inline' instead of 'attachment'
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Content-Length': fileBuffer.length.toString(),
        },
      })
    } catch (fileError) {
      console.error('File not found:', fileError)
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error serving PDF:", error)
    return NextResponse.json(
      { error: "Failed to serve PDF" },
      { status: 500 }
    )
  }
}