import { type NextRequest, NextResponse } from "next/server"
import { getUserById, LEAVE_REQUESTS, HOLIDAYS, USERS } from "@/lib/static-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user
    const user = getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let leaveRequests = [...LEAVE_REQUESTS]

    // Role-based filtering
    if (user.role === "EMPLOYEE") {
      // Employees can only see approved requests from their team
      leaveRequests = leaveRequests.filter((request) => request.status === "APPROVED")
      // TODO: Add team/department filtering based on business requirements
    } else if (user.role === "MANAGER") {
      // Managers can see all requests from their direct reports
      const directReportIds = USERS.filter((u) => u.managerId === userId).map((u) => u.id)
      leaveRequests = leaveRequests.filter((request) => directReportIds.includes(request.userId))
    }
    // ADMIN can see all requests

    // Date filtering
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      leaveRequests = leaveRequests.filter((request) => {
        const requestStart = new Date(request.startDate)
        const requestEnd = new Date(request.endDate)

        return (
          (requestStart >= startDate && requestStart <= endDate) ||
          (requestEnd >= startDate && requestEnd <= endDate) ||
          (requestStart <= startDate && requestEnd >= endDate)
        )
      })
    }

    // Transform to calendar events format
    const events = leaveRequests.map((request) => {
      const requestUser = getUserById(request.userId)
      return {
        id: request.id,
        title: `${requestUser?.name || "Unknown"} - ${request.leaveType}`,
        start: new Date(request.startDate),
        end: new Date(request.endDate),
        resource: {
          userId: request.userId,
          userName: requestUser?.name || "Unknown",
          status: request.status,
          leaveType: request.leaveType,
          note: request.note,
          department: requestUser?.department,
        },
      }
    })

    // Also fetch company holidays
    let holidays = [...HOLIDAYS]

    // Date filtering for holidays
    if (start && end) {
      const startDate = new Date(start)
      const endDate = new Date(end)

      holidays = holidays.filter((holiday) => {
        const holidayDate = new Date(holiday.date)
        return holidayDate >= startDate && holidayDate <= endDate
      })
    }

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
