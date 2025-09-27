// src/app/api/gallery/options/countries/route.ts - FIXED VERSION
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("🌍 Fetching countries from database...")
    
    // First, let's check if we have any galleries at all
    const totalGalleries = await db.gallery.count()
    console.log(`📊 Total galleries in database: ${totalGalleries}`)
    
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

    console.log(`✅ Found ${countries.length} unique countries:`, countries)

    // If no countries found, let's check unpublished galleries too
    if (countries.length === 0) {
      console.log("🔍 No published countries found, checking all galleries...")
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
      console.log(`📋 All countries (including unpublished):`, allCountries)
    }

    const formattedCountries = countries.map(country => ({
      value: country.country,
      label: country.country!.charAt(0).toUpperCase() + country.country!.slice(1),
      count: country._count.country
    }))

    console.log(`🎯 Returning formatted countries:`, formattedCountries)

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