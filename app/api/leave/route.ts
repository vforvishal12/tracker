import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { leaveRequestSchema } from "@/lib/validations"
import { sendLeaveRequestNotification } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = leaveRequestSchema.parse({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    })

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: session.user.id,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        leaveType: validatedData.leaveType,
        note: validatedData.note,
        status: "PENDING",
      },
      include: {
        user: {
          include: {
            manager: true,
          },
        },
      },
    })

    // Send notification email
    await sendLeaveRequestNotification(leaveRequest, "submitted")

    return NextResponse.json(leaveRequest)
  } catch (error) {
    console.error("Error creating leave request:", error)
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    const whereClause: any = {}

    // Role-based filtering
    if (session.user.role === "EMPLOYEE") {
      whereClause.userId = session.user.id
    } else if (session.user.role === "MANAGER") {
      if (userId) {
        // Check if user is a direct report
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })
        if (user?.managerId !== session.user.id) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
        whereClause.userId = userId
      } else {
        // Get all direct reports' requests
        whereClause.user = {
          managerId: session.user.id,
        }
      }
    }
    // ADMIN can see all requests (no additional filtering)

    if (status) {
      whereClause.status = status
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(leaveRequests)
  } catch (error) {
    console.error("Error fetching leave requests:", error)
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 })
  }
}
