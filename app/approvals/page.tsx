"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/lib/user-context"
import { Navbar } from "@/components/navbar"
import { ApprovalsList } from "@/components/approvals-list"

interface LeaveRequest {
  id: string
  startDate: string
  endDate: string
  leaveType: string
  note?: string
  user: {
    id: string
    name: string
    email: string
    department?: string
  }
}

export default function ApprovalsPage() {
  const { currentUser } = useUser()
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser && (currentUser.role === "MANAGER" || currentUser.role === "ADMIN")) {
      fetchPendingRequests()
    }
  }, [currentUser])

  const fetchPendingRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/leave?userId=${currentUser?.id}&status=PENDING`)
      if (response.ok) {
        const data = await response.json()
        setPendingRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch pending requests:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  if (currentUser.role === "EMPLOYEE") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve leave requests from your team</p>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <ApprovalsList requests={pendingRequests} onUpdate={fetchPendingRequests} />
        )}
      </div>
    </div>
  )
}
