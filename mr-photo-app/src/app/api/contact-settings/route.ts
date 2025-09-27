// File: /src/app/api/contact-settings/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET contact settings for public use
export async function GET() {
  try {
    let settings
    
    try {
      settings = await db.contactSettings.findFirst({
        orderBy: { updatedAt: "desc" }
      })
    } catch (dbError) {
      console.log("Database not available, using default settings")
      settings = null
    }

    if (!settings) {
      // Return default settings with your real business information
      return NextResponse.json({
        title: "Get In Touch",
        subtitle: "Ready to capture your special moments? Let's discuss your photography needs and create something beautiful together.",
        phone: "+88 02 9882107-8",
        phoneDescription: "Mon-Fri 9AM-6PM BST",
        email: "info@paragongroup-bd.com",
        emailDescription: "We'll respond within 24 hours",
        location: "Paragon House 5, C/A Bir Uttam AK Khandakar Rd, Mohakhali",
        locationDescription: "Dhaka 1212, Bangladesh",
        responseTime: "24 Hours",
        responseTimeDescription: "Typical response time",
        businessHours: {
          monday: "9:00 AM - 6:00 PM",
          tuesday: "9:00 AM - 6:00 PM",
          wednesday: "9:00 AM - 6:00 PM",
          thursday: "9:00 AM - 6:00 PM",
          friday: "9:00 AM - 6:00 PM",
          saturday: "10:00 AM - 4:00 PM",
          sunday: "By Appointment"
        },
        emergencyNote: "Emergency shoots available 24/7",
        socialLinks: {
          instagram: "https://instagram.com/mr_photography_bd",
          facebook: "https://facebook.com/mrphotographybd",
          twitter: "https://twitter.com/mr_photo_bd"
        },
        quickInfoTitle: "Ready to Book?",
        quickInfoDescription: "We typically respond to inquiries within 24 hours. For urgent requests, please call directly."
      })
    }


    if (typeof settings.socialLinks === 'string') {
      try {
        settings.socialLinks = JSON.parse(settings.socialLinks)
      } catch {
        settings.socialLinks = {
          instagram: "https://instagram.com/mr_photography_bd",
          facebook: "https://facebook.com/mrphotographybd",
          twitter: "https://twitter.com/mr_photo_bd"
        }
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching contact settings:", error)
    
    // Return fallback settings if everything fails
    return NextResponse.json({
      title: "Get In Touch",
      subtitle: "Ready to capture your special moments? Let's discuss your photography needs and create something beautiful together.",
      phone: "+88 02 9882107-8",
      phoneDescription: "Mon-Fri 9AM-6PM BST",
      email: "info@paragongroup-bd.com",
      emailDescription: "We'll respond within 24 hours",
      location: "Paragon House 5, C/A Bir Uttam AK Khandakar Rd, Mohakhali",
      locationDescription: "Dhaka 1212, Bangladesh",
      responseTime: "24 Hours",
      responseTimeDescription: "Typical response time",
      businessHours: {
        monday: "9:00 AM - 6:00 PM",
        tuesday: "9:00 AM - 6:00 PM",
        wednesday: "9:00 AM - 6:00 PM",
        thursday: "9:00 AM - 6:00 PM",
        friday: "9:00 AM - 6:00 PM",
        saturday: "10:00 AM - 4:00 PM",
        sunday: "By Appointment"
      },
      emergencyNote: "Emergency shoots available 24/7",
      socialLinks: {
        instagram: "https://instagram.com/mr_photography_bd",
        facebook: "https://facebook.com/mrphotographybd",
        twitter: "https://twitter.com/mr_photo_bd"
      },
      quickInfoTitle: "Ready to Book?",
      quickInfoDescription: "We typically respond to inquiries within 24 hours. For urgent requests, please call directly."
    })
  }
}

// POST/PUT update contact settings (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Check if settings already exist
    const existingSettings = await db.contactSettings.findFirst()
    
    let settings
    if (existingSettings) {
      // Update existing settings
      settings = await db.contactSettings.update({
        where: { id: existingSettings.id },
        data: body
      })
    } else {
      // Create new settings
      settings = await db.contactSettings.create({
        data: body
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating contact settings:", error)
    return NextResponse.json(
      { error: "Failed to update contact settings" },
      { status: 500 }
    )
  }
}