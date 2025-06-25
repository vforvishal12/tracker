import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { ApprovalsList } from "@/components/approvals-list"

export default async function ApprovalsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === "EMPLOYEE") {
    redirect("/dashboard")
  }

  // Fetch pending requests based on role
  const whereClause: any = {
    status: "PENDING",
  }

  if (session.user.role === "MANAGER") {
    whereClause.user = {
      managerId: session.user.id,
    }
  }
  // ADMIN can see all pending requests

  const pendingRequests = await prisma.leaveRequest.findMany({
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
    orderBy: {
      createdAt: "asc",
    },
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve leave requests from your team</p>
        </div>

        <ApprovalsList requests={pendingRequests} />
      </div>
    </div>
  )
}
