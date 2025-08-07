// File: /src/app/api/admin/contact/export/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET export contacts as CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const format = searchParams.get("format") || "csv" // csv or json
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {}
    
    if (status && status !== "all") {
      where.status = status
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    const contacts = await db.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })

    if (format === "json") {
      return NextResponse.json(contacts, {
        headers: {
          'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.json"`,
          'Content-Type': 'application/json',
        },
      })
    }

    // Generate CSV
    const csvHeaders = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message',
      'Status',
      'Created At'
    ]

    const csvRows = contacts.map(contact => [
      contact.id,
      contact.name,
      contact.email,
      contact.phone || '',
      contact.subject,
      `"${contact.message.replace(/"/g, '""')}"`, // Escape quotes in message
      contact.status,
      contact.createdAt.toISOString()
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

  } catch (error) {
    console.error("Error exporting contacts:", error)
    return NextResponse.json(
      { error: "Failed to export contacts" },
      { status: 500 }
    )
  }
}