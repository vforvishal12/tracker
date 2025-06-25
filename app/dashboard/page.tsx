import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { CalendarDays, Clock, CheckCircle, Users } from "lucide-react"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch user's leave requests
  const userRequests = await prisma.leaveRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  })

  // Calculate stats
  const currentYear = new Date().getFullYear()
  const yearStart = new Date(currentYear, 0, 1)
  const yearEnd = new Date(currentYear, 11, 31)

  const approvedRequests = await prisma.leaveRequest.findMany({
    where: {
      userId: session.user.id,
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

  const pendingCount = userRequests.filter((r) => r.status === "PENDING").length
  const approvedCount = userRequests.filter((r) => r.status === "APPROVED").length

  // Manager/Admin stats
  let teamStats = null
  if (session.user.role === "MANAGER" || session.user.role === "ADMIN") {
    const teamRequests = await prisma.leaveRequest.findMany({
      where:
        session.user.role === "ADMIN"
          ? {}
          : {
              user: { managerId: session.user.id },
            },
      include: { user: true },
    })

    teamStats = {
      totalRequests: teamRequests.length,
      pendingRequests: teamRequests.filter((r) => r.status === "PENDING").length,
      teamMembers:
        session.user.role === "ADMIN"
          ? await prisma.user.count()
          : await prisma.user.count({ where: { managerId: session.user.id } }),
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {session.user.name?.split(" ")[0]}!</h1>
            <p className="text-muted-foreground mt-1">Manage your time off and view your team's schedule</p>
          </div>
          <LeaveRequestForm />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Off This Year</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysOff}</div>
              <p className="text-xs text-muted-foreground">Approved leave days in {currentYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          {teamStats && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Overview</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamStats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Pending approvals from {teamStats.teamMembers} team members
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Your latest time off requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {userRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No leave requests yet</p>
                <p className="text-sm">Click "Request Time Off" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {new Date(request.startDate).toLocaleDateString()} -{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </span>
                        <Badge variant="outline">{request.leaveType}</Badge>
                      </div>
                      {request.note && <p className="text-sm text-muted-foreground">{request.note}</p>}
                      {request.approverComment && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Manager comment:</strong> {request.approverComment}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        request.status === "APPROVED"
                          ? "default"
                          : request.status === "PENDING"
                            ? "secondary"
                            : request.status === "REJECTED"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
