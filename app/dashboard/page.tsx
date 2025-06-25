"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LeaveRequestForm } from "@/components/leave-request-form"
import { CalendarDays, Clock, CheckCircle, Users } from "lucide-react"

interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  leaveType: string
  status: string
  note?: string
  approverComment?: string
}

export default function Dashboard() {
  const { currentUser } = useUser()
  const [userRequests, setUserRequests] = useState<LeaveRequest[]>([])
  const [stats, setStats] = useState({
    totalDaysOff: 0,
    pendingCount: 0,
    approvedCount: 0,
    teamStats: null as any,
  })

  useEffect(() => {
    if (currentUser) {
      fetchUserRequests()
      fetchStats()
    }
  }, [currentUser])

  const fetchUserRequests = async () => {
    try {
      const response = await fetch(`/api/leave?userId=${currentUser?.id}`)
      if (response.ok) {
        const data = await response.json()
        setUserRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/leave/stats?userId=${currentUser?.id}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {currentUser.name?.split(" ")[0]}!</h1>
            <p className="text-muted-foreground mt-1">Manage your time off and view your team's schedule</p>
          </div>
          <LeaveRequestForm onSuccess={fetchUserRequests} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Off This Year</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDaysOff}</div>
              <p className="text-xs text-muted-foreground">Approved leave days in 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedCount}</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          {stats.teamStats && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Overview</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.teamStats.pendingRequests}</div>
                <p className="text-xs text-muted-foreground">
                  Pending approvals from {stats.teamStats.teamMembers} team members
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
