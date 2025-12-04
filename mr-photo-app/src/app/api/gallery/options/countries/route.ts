// src/app/api/gallery/options/countries/route.ts - FIXED VERSION
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // First, let's check if we have any galleries at all
    const totalGalleries = await db.gallery.count()
    
    // Get unique countries from published galleries
    const countries = await db.gallery.groupBy({
      by: ['country'],
      where: {
        published: true,
        country: { 
          not: null,
          not: "" // Exclude empty strings
        }
      },
      _count: {
        country: true
      }
    })

    // If no countries found, let's check unpublished galleries too
    if (countries.length === 0) {
      const allCountries = await db.gallery.groupBy({
        by: ['country'],
        where: {
          country: { 
            not: null,
            not: ""
          }
        },
        _count: {
          country: true
        }
      })
    }

    const formattedCountries = countries.map(country => ({
      value: country.country,
      label: country.country!.charAt(0).toUpperCase() + country.country!.slice(1),
      count: country._count.country
    }))

    return NextResponse.json({ 
      countries: formattedCountries,
      debug: {
        totalGalleries,
        countriesFound: countries.length,
        rawCountries: countries
      }
    })
  } catch (error) {
    console.error("❌ Error fetching countries:", error)
    return NextResponse.json(
      { 
        countries: [],
        error: "Failed to fetch countries",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}