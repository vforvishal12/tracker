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

    const whereClause: any = {
      status: "PENDING",
    }

    // Role-based filtering
    if (user.role === "MANAGER") {
      whereClause.user = {
        managerId: userId,
      }
    } else if (user.role === "EMPLOYEE") {
      // Employees can't see pending counts for others
      return NextResponse.json({ count: 0 })
    }
    // ADMIN can see all pending requests

    const count = await prisma.leaveRequest.count({
      where: whereClause,
    })

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching pending count:", error)
    return NextResponse.json({ error: "Failed to fetch pending count" }, { status: 500 })
  }
}
