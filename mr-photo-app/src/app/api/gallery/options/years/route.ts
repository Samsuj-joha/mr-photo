// src/app/api/gallery/options/years/route.ts
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Get all distinct years from gallery images
    // If year column doesn't exist, extract from createdAt
    let images
    try {
      images = await db.galleryImage.findMany({
        where: {
          year: { not: null },
          gallery: {
            published: true
          }
        },
        select: {
          year: true
        },
        distinct: ['year'],
        orderBy: {
          year: 'desc'
        }
      })

      // Format years for dropdown
      const years = images
        .filter(img => img.year !== null)
        .map(img => ({
          value: img.year!.toString(),
          label: img.year!.toString()
        }))

      return NextResponse.json({ years })
    } catch (error: any) {
      // If year column doesn't exist (P2022), extract from createdAt
      if (error?.code === 'P2022' && error?.message?.includes('year')) {
        const allImages = await db.galleryImage.findMany({
          where: {
            gallery: {
              published: true
            }
          },
          select: {
            createdAt: true
          }
        })

        // Extract unique years from createdAt
        const yearSet = new Set<number>()
        allImages.forEach(img => {
          yearSet.add(new Date(img.createdAt).getFullYear())
        })

        const years = Array.from(yearSet)
          .sort((a, b) => b - a)
          .map(year => ({
            value: year.toString(),
            label: year.toString()
          }))

        return NextResponse.json({ years })
      }
      throw error
    }
  } catch (error) {
    console.error("Error fetching years:", error)
    return NextResponse.json(
      { error: "Failed to fetch years" },
      { status: 500 }
    )
  }
}

