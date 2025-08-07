// File: /src/app/api/admin/contact/stats/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET contact statistics for admin dashboard
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
    const period = searchParams.get("period") || "30" // days

    const periodDate = new Date()
    periodDate.setDate(periodDate.getDate() - parseInt(period))

    // Get overall stats
    const [
      totalContacts,
      pendingContacts,
      repliedContacts,
      resolvedContacts,
      recentContacts,
      contactsThisPeriod
    ] = await Promise.all([
      db.contact.count(),
      db.contact.count({ where: { status: 'PENDING' } }),
      db.contact.count({ where: { status: 'REPLIED' } }),
      db.contact.count({ where: { status: 'RESOLVED' } }),
      db.contact.count({ 
        where: { 
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        } 
      }),
      db.contact.count({ 
        where: { 
          createdAt: { gte: periodDate } 
        } 
      }),
    ])

    // Get daily stats for the period
    const dailyStats = await db.contact.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: periodDate }
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Process daily stats to fill gaps
    const dailyStatsMap = new Map()
    const today = new Date()
    const days = parseInt(period)

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      dailyStatsMap.set(dateKey, 0)
    }

    dailyStats.forEach(stat => {
      const dateKey = new Date(stat.createdAt).toISOString().split('T')[0]
      dailyStatsMap.set(dateKey, stat._count.id)
    })

    const chartData = Array.from(dailyStatsMap.entries()).map(([date, count]) => ({
      date,
      contacts: count
    }))

    // Get recent contacts for quick view
    const recentContactsList = await db.contact.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true
      }
    })

    // Get top subjects/categories
    const subjectStats = await db.contact.groupBy({
      by: ['subject'],
      _count: {
        subject: true,
      },
      orderBy: {
        _count: {
          subject: 'desc'
        }
      },
      take: 5
    })

    const response = {
      overview: {
        total: totalContacts,
        pending: pendingContacts,
        replied: repliedContacts,
        resolved: resolvedContacts,
        recent24h: recentContacts,
        thisPeriod: contactsThisPeriod
      },
      chartData,
      recentContacts: recentContactsList,
      topSubjects: subjectStats.map(stat => ({
        subject: stat.subject,
        count: stat._count.subject
      })),
      growth: {
        period: parseInt(period),
        total: contactsThisPeriod,
        avgPerDay: Math.round(contactsThisPeriod / parseInt(period))
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error("Error fetching contact stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch contact statistics" },
      { status: 500 }
    )
  }
}