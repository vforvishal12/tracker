import { type NextRequest, NextResponse } from "next/server"
import { approvalSchema } from "@/lib/validations"
import { getUserById, updateLeaveRequest, deleteLeaveRequest, LEAVE_REQUESTS } from "@/lib/static-data"
import { sendLeaveRequestNotification } from "@/lib/email"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = approvalSchema.parse(body)
    const { userId } = body // Current user making the approval

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get the leave request
    const leaveRequest = LEAVE_REQUESTS.find((req) => req.id === params.id)

    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
    }

    // Get current user and request user
    const currentUser = getUserById(userId)
    const requestUser = getUserById(leaveRequest.userId)

    if (!currentUser || !requestUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions
    const canApprove =
      currentUser.role === "ADMIN" || (currentUser.role === "MANAGER" && requestUser.managerId === currentUser.id)

    if (!canApprove) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the leave request
    const updatedRequest = updateLeaveRequest(params.id, {
      status: validatedData.status,
      approverComment: validatedData.approverComment,
      approvedById: currentUser.id,
    })

    if (!updatedRequest) {
      return NextResponse.json({ error: "Failed to update request" }, { status: 500 })
    }

    // Add user info for response
    const response = {
      ...updatedRequest,
      user: {
        id: requestUser.id,
        name: requestUser.name,
        email: requestUser.email,
        department: requestUser.department,
      },
      approvedBy: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
    }

    // Send notification email
    const notificationType = validatedData.status === "APPROVED" ? "approved" : "rejected"
    await sendLeaveRequestNotification(response, notificationType)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error updating leave request:", error)
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get the leave request
    const leaveRequest = LEAVE_REQUESTS.find((req) => req.id === params.id)

    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
    }

    // Get current user
    const currentUser = getUserById(userId)

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check permissions - only the user who created it or admin can delete
    const canDelete = currentUser.role === "ADMIN" || leaveRequest.userId === currentUser.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const deleted = deleteLeaveRequest(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete request" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting leave request:", error)
    return NextResponse.json({ error: "Failed to delete leave request" }, { status: 500 })
  }
}
