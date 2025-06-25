import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate stats
    const currentYear = new Date().getFullYear()
    const yearStart = new Date(currentYear, 0, 1)
    const yearEnd = new Date(currentYear, 11, 31)

    const approvedRequests = await prisma.leaveRequest.findMany({
      where: {
        userId: userId,
        status: "APPROVED",
        startDate: { gte: yearStart },
        endDate: { lte: yearEnd },
      },
    })

    const totalDaysOff = approvedRequests.reduce((total, request) => {
      const start = new Date(request.startDate)
      const end = new Date(request.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return total + diffDays
    }, 0)

    const userRequests = await prisma.leaveRequest.findMany({
      where: { userId: userId },
    })

    const pendingCount = userRequests.filter((r) => r.status === "PENDING").length
    const approvedCount = userRequests.filter((r) => r.status === "APPROVED").length

    // Manager/Admin stats
    let teamStats = null
    if (user.role === "MANAGER" || user.role === "ADMIN") {
      const teamRequests = await prisma.leaveRequest.findMany({
        where:
          user.role === "ADMIN"
            ? {}
            : {
                user: { managerId: userId },
              },
        include: { user: true },
      })

      teamStats = {
        totalRequests: teamRequests.length,
        pendingRequests: teamRequests.filter((r) => r.status === "PENDING").length,
        teamMembers:
          user.role === "ADMIN" ? await prisma.user.count() : await prisma.user.count({ where: { managerId: userId } }),
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
