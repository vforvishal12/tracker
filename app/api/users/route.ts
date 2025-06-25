import { NextResponse } from "next/server"
import { USERS } from "@/lib/static-data"

export async function GET() {
  try {
    const users = USERS.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      managerId: user.managerId,
      department: user.department,
    })).sort((a, b) => {
      // Sort by role first (ADMIN, MANAGER, EMPLOYEE), then by name
      const roleOrder = { ADMIN: 0, MANAGER: 1, EMPLOYEE: 2 }
      const roleComparison = roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder]
      if (roleComparison !== 0) return roleComparison
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
