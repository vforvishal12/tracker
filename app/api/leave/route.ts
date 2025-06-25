import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { leaveRequestSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leaveRequestSchema.parse({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    })

    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Create leave request
    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        userId: userId,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        leaveType: validatedData.leaveType,
        note: validatedData.note,
        status: "PENDING",
      },
      include: {
        user: true,
      },
    })

    return NextResponse.json(leaveRequest)
  } catch (error) {
    console.error("Error creating leave request:", error)
    return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const whereClause: any = {}

    // Role-based filtering
    if (user.role === "EMPLOYEE") {
      whereClause.userId = userId
    } else if (user.role === "MANAGER") {
      // Get all direct reports' requests
      whereClause.user = {
        managerId: userId,
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
