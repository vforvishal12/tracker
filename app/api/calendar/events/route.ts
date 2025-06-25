import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const whereClause: any = {}

    // Date filtering
    if (start && end) {
      whereClause.OR = [
        {
          startDate: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
        {
          endDate: {
            gte: new Date(start),
            lte: new Date(end),
          },
        },
        {
          AND: [{ startDate: { lte: new Date(start) } }, { endDate: { gte: new Date(end) } }],
        },
      ]
    }

    // Role-based filtering
    if (session.user.role === "EMPLOYEE") {
      // Employees can only see approved requests from their team
      whereClause.status = "APPROVED"
      // TODO: Add team/department filtering based on business requirements
    } else if (session.user.role === "MANAGER") {
      // Managers can see all requests from their direct reports
      whereClause.user = {
        managerId: session.user.id,
      }
    }
    // ADMIN can see all requests

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
      },
    })

    // Transform to calendar events format
    const events = leaveRequests.map((request) => ({
      id: request.id,
      title: `${request.user.name} - ${request.leaveType}`,
      start: new Date(request.startDate),
      end: new Date(request.endDate),
      resource: {
        userId: request.user.id,
        userName: request.user.name,
        status: request.status,
        leaveType: request.leaveType,
        note: request.note,
        department: request.user.department,
      },
    }))

    // Also fetch company holidays
    const holidays = await prisma.holiday.findMany({
      where:
        start && end
          ? {
              date: {
                gte: new Date(start),
                lte: new Date(end),
              },
            }
          : {},
    })

    const holidayEvents = holidays.map((holiday) => ({
      id: `holiday-${holiday.id}`,
      title: `🏢 ${holiday.name}`,
      start: new Date(holiday.date),
      end: new Date(holiday.date),
      resource: {
        type: "holiday",
        description: holiday.description,
      },
    }))

    return NextResponse.json([...events, ...holidayEvents])
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return NextResponse.json({ error: "Failed to fetch calendar events" }, { status: 500 })
  }
}
