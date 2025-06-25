export const dynamic = "force-dynamic"
import { type NextRequest, NextResponse } from "next/server"
import { getUserById, getLeaveRequestsByManagerId, LEAVE_REQUESTS } from "@/lib/static-data"

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

    let count = 0

    // Role-based filtering
    if (user.role === "MANAGER") {
      const teamRequests = getLeaveRequestsByManagerId(userId)
      count = teamRequests.filter((request) => request.status === "PENDING").length
    } else if (user.role === "ADMIN") {
      count = LEAVE_REQUESTS.filter((request) => request.status === "PENDING").length
    } else {
      // Employees can't see pending counts for others
      count = 0
    }

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching pending count:", error)
    return NextResponse.json({ error: "Failed to fetch pending count" }, { status: 500 })
  }
}
