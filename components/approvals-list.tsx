"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, XCircle, Calendar, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

interface ApprovalsListProps {
  requests: LeaveRequest[]
}

export function ApprovalsList({ requests }: ApprovalsListProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAction = async () => {
    if (!selectedRequest || !action) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/leave/${selectedRequest.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "approve" ? "APPROVED" : "REJECTED",
          approverComment: comment || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update request")
      }

      toast({
        title: "Success!",
        description: `Leave request has been ${action === "approve" ? "approved" : "rejected"}.`,
      })

      setSelectedRequest(null)
      setAction(null)
      setComment("")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update leave request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDialog = (request: LeaveRequest, actionType: "approve" | "reject") => {
    setSelectedRequest(request)
    setAction(actionType)
    setComment("")
  }

  const closeDialog = () => {
    setSelectedRequest(null)
    setAction(null)
    setComment("")
  }

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
          <p className="text-muted-foreground">No pending leave requests to review.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">{request.user.name}</CardTitle>
                  </div>
                  {request.user.department && <Badge variant="outline">{request.user.department}</Badge>}
                </div>
                <Badge variant="secondary">{calculateDays(request.startDate, request.endDate)} days</Badge>
              </div>
              <CardDescription>{request.user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">{new Date(request.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Leave Type</p>
                    <Badge variant="outline">{request.leaveType}</Badge>
                  </div>
                </div>

                {request.note && (
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Note</p>
                      <p className="text-sm text-muted-foreground">{request.note}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-4">
                  <Button onClick={() => openDialog(request, "approve")} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => openDialog(request, "reject")}
                    className="flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{action === "approve" ? "Approve" : "Reject"} Leave Request</DialogTitle>
            <DialogDescription>
              {selectedRequest && (
                <>
                  {action === "approve" ? "Approve" : "Reject"} leave request from{" "}
                  <strong>{selectedRequest.user.name}</strong> for{" "}
                  {new Date(selectedRequest.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedRequest.endDate).toLocaleDateString()}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                placeholder={`Add a comment for ${action === "approve" ? "approval" : "rejection"}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isSubmitting}
              variant={action === "approve" ? "default" : "destructive"}
            >
              {isSubmitting ? "Processing..." : action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
