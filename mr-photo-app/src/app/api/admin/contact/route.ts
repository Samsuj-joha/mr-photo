// File: /src/app/api/admin/contact/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET - Fetch all contacts for admin
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
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status && status !== "all") {
      where.status = status
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
      ]
    }

    const [contacts, totalCount] = await Promise.all([
      db.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.contact.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    // Get stats for dashboard
    const stats = await db.contact.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    const statsFormatted = {
      total: totalCount,
      pending: stats.find(s => s.status === 'PENDING')?._count.status || 0,
      replied: stats.find(s => s.status === 'REPLIED')?._count.status || 0,
      resolved: stats.find(s => s.status === 'RESOLVED')?._count.status || 0,
    }

    return NextResponse.json({
      contacts,
      stats: statsFormatted,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}

// DELETE - Bulk delete contacts
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { ids } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Contact IDs are required" },
        { status: 400 }
      )
    }

    await db.contact.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    })

    return NextResponse.json({ 
      message: `Successfully deleted ${ids.length} contact(s)` 
    })

  } catch (error) {
    console.error("Error deleting contacts:", error)
    return NextResponse.json(
      { error: "Failed to delete contacts" },
      { status: 500 }
    )
  }
}