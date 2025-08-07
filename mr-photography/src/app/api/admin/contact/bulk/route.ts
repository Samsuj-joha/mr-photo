// File: /src/app/api/admin/contact/bulk/route.ts

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// POST bulk operations on contacts
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
    const { action, ids, data } = body

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Action and contact IDs are required" },
        { status: 400 }
      )
    }

    let result
    let message

    switch (action) {
      case 'updateStatus':
        if (!data?.status) {
          return NextResponse.json(
            { error: "Status is required for update action" },
            { status: 400 }
          )
        }

        const validStatuses = ['PENDING', 'REPLIED', 'RESOLVED']
        if (!validStatuses.includes(data.status)) {
          return NextResponse.json(
            { error: "Invalid status" },
            { status: 400 }
          )
        }

        result = await db.contact.updateMany({
          where: {
            id: { in: ids }
          },
          data: {
            status: data.status
          }
        })

        message = `Successfully updated ${result.count} contact(s) to ${data.status}`
        break

      case 'delete':
        result = await db.contact.deleteMany({
          where: {
            id: { in: ids }
          }
        })

        message = `Successfully deleted ${result.count} contact(s)`
        break

      case 'markAsRead':
        // For future use if you add isRead field
        return NextResponse.json(
          { error: "Mark as read functionality not implemented yet" },
          { status: 400 }
        )

      default:
        return NextResponse.json(
          { error: "Invalid action. Supported actions: updateStatus, delete" },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message,
      affected: result.count
    })

  } catch (error) {
    console.error("Error performing bulk operation:", error)
    return NextResponse.json(
      { error: "Failed to perform bulk operation" },
      { status: 500 }
    )
  }
}