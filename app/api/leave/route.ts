import { type NextRequest, NextResponse } from "next/server"
import { leaveRequestSchema } from "@/lib/validations"
import {
  getUserById,
  getLeaveRequestsByUserId,
  getLeaveRequestsByManagerId,
  LEAVE_REQUESTS,
  addLeaveRequest,
} from "@/lib/static-data"

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
    const leaveRequest = addLeaveRequest({
      userId: userId,
      startDate: validatedData.startDate.toISOString().split("T")[0],
      endDate: validatedData.endDate.toISOString().split("T")[0],
      leaveType: validatedData.leaveType,
      note: validatedData.note,
      status: "PENDING",
    })

    // Add user info for response
    const user = getUserById(userId)
    const response = {
      ...leaveRequest,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            department: user.department,
          }
        : null,
    }

    return NextResponse.json(response)
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
    const user = getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let leaveRequests = []

    // Role-based filtering
    if (user.role === "EMPLOYEE") {
      leaveRequests = getLeaveRequestsByUserId(userId)
    } else if (user.role === "MANAGER") {
      // Get all direct reports' requests
      leaveRequests = getLeaveRequestsByManagerId(userId)
    } else if (user.role === "ADMIN") {
      // Admin can see all requests
      leaveRequests = [...LEAVE_REQUESTS]
    }

    // Filter by status if provided
    if (status) {
      leaveRequests = leaveRequests.filter((request) => request.status === status)
    }

    // Add user info to each request
    const requestsWithUserInfo = leaveRequests.map((request) => {
      const requestUser = getUserById(request.userId)
      const approver = request.approvedById ? getUserById(request.approvedById) : null

      return {
        ...request,
        user: requestUser
          ? {
              id: requestUser.id,
              name: requestUser.name,
              email: requestUser.email,
              department: requestUser.department,
            }
          : null,
        approvedBy: approver
          ? {
              id: approver.id,
              name: approver.name,
              email: approver.email,
            }
          : null,
      }
    })

    // Sort by creation date (newest first)
    requestsWithUserInfo.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(requestsWithUserInfo)
  } catch (error) {
    console.error("Error fetching leave requests:", error)
    return NextResponse.json({ error: "Failed to fetch leave requests" }, { status: 500 })
  }
}
