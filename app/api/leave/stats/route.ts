import { type NextRequest, NextResponse } from "next/server"
import {
  getUserById,
  getLeaveRequestsByUserId,
  getLeaveRequestsByManagerId,
  LEAVE_REQUESTS,
  USERS,
} from "@/lib/static-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user
    const user = getUserById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user's requests
    const userRequests = getLeaveRequestsByUserId(userId)

    // Calculate stats
    const currentYear = new Date().getFullYear()

    const approvedRequests = userRequests.filter((request) => {
      const startDate = new Date(request.startDate)
      const endDate = new Date(request.endDate)
      return (
        request.status === "APPROVED" &&
        startDate.getFullYear() === currentYear &&
        endDate.getFullYear() === currentYear
      )
    })

    const totalDaysOff = approvedRequests.reduce((total, request) => {
      const start = new Date(request.startDate)
      const end = new Date(request.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return total + diffDays
    }, 0)

    const pendingCount = userRequests.filter((r) => r.status === "PENDING").length
    const approvedCount = userRequests.filter((r) => r.status === "APPROVED").length

    // Manager/Admin stats
    let teamStats = null
    if (user.role === "MANAGER" || user.role === "ADMIN") {
      const teamRequests = user.role === "ADMIN" ? LEAVE_REQUESTS : getLeaveRequestsByManagerId(userId)

      teamStats = {
        totalRequests: teamRequests.length,
        pendingRequests: teamRequests.filter((r) => r.status === "PENDING").length,
        teamMembers: user.role === "ADMIN" ? USERS.length : USERS.filter((u) => u.managerId === userId).length,
      }
    }

    return NextResponse.json({
      totalDaysOff,
      pendingCount,
      approvedCount,
      teamStats,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
