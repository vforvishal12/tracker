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

    const whereClause: any = {
      status: "PENDING",
    }

    // Role-based filtering
    if (session.user.role === "MANAGER") {
      whereClause.user = {
        managerId: session.user.id,
      }
    } else if (session.user.role === "EMPLOYEE") {
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
