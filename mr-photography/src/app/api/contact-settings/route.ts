// File: /src/app/api/contact-settings/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET contact settings for public use
export async function GET() {
  try {
    // For now, we'll return default settings since your schema doesn't have ContactSettings
    // You can modify this to use a settings table or environment variables
    const settings = {
      title: "Get In Touch",
      subtitle: "Ready to capture your special moments? Let's discuss your photography needs and create something beautiful together.",
      phone: process.env.CONTACT_PHONE || "+1 (555) 123-4567",
      phoneDescription: "Mon-Fri 9AM-6PM EST",
      email: process.env.CONTACT_EMAIL || "hello@mr-photography.com",
      emailDescription: "We'll respond within 24 hours",
      location: process.env.CONTACT_LOCATION || "New York, NY",
      locationDescription: "Available worldwide",
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
        instagram: process.env.INSTAGRAM_URL || "#",
        facebook: process.env.FACEBOOK_URL || "#",
        twitter: process.env.TWITTER_URL || "#"
      },
      quickInfoTitle: "Ready to Book?",
      quickInfoDescription: "I typically respond to inquiries within 24 hours. For urgent requests, please call directly."
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching contact settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact settings" },
      { status: 500 }
    )
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
    
    // For now, we'll just return the updated settings
    // In a real app, you'd save this to a database table
    // You can extend your schema to include a ContactSettings model
    
    return NextResponse.json({
      message: "Contact settings updated successfully",
      settings: body
    })
  } catch (error) {
    console.error("Error updating contact settings:", error)
    return NextResponse.json(
      { error: "Failed to update contact settings" },
      { status: 500 }
    )
  }
}