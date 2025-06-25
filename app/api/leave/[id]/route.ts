import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { approvalSchema } from "@/lib/validations"
import { sendLeaveRequestNotification } from "@/lib/email"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = approvalSchema.parse(body)

    // Get the leave request
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
      include: {
        user: {
          include: {
            manager: true,
          },
        },
      },
    })

    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
    }

    // Check permissions
    const canApprove =
      session.user.role === "ADMIN" ||
      (session.user.role === "MANAGER" && leaveRequest.user.managerId === session.user.id)

    if (!canApprove) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the leave request
    const updatedRequest = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        status: validatedData.status,
        approverComment: validatedData.approverComment,
        approvedById: session.user.id,
      },
      include: {
        user: true,
        approvedBy: true,
      },
    })

    // Send notification email
    const notificationType = validatedData.status === "APPROVED" ? "approved" : "rejected"
    await sendLeaveRequestNotification(updatedRequest, notificationType)

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating leave request:", error)
    return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the leave request
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
    })

    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
    }

    // Check permissions - only the user who created it or admin can delete
    const canDelete = session.user.role === "ADMIN" || leaveRequest.userId === session.user.id

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.leaveRequest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting leave request:", error)
    return NextResponse.json({ error: "Failed to delete leave request" }, { status: 500 })
  }
}
