// Email service stub - integrate with your preferred email provider
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  // TODO: Integrate with SendGrid, Resend, or your email provider
  console.log(`📧 Email would be sent to: ${to}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${html}`)

  // For demo purposes, we'll just log
  return { success: true }
}

export async function sendLeaveRequestNotification(request: any, type: "submitted" | "approved" | "rejected") {
  const templates = {
    submitted: {
      subject: `Leave Request Submitted - ${request.user.name}`,
      html: `
        <h2>New Leave Request</h2>
        <p><strong>Employee:</strong> ${request.user.name}</p>
        <p><strong>Dates:</strong> ${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}</p>
        <p><strong>Type:</strong> ${request.leaveType}</p>
        ${request.note ? `<p><strong>Note:</strong> ${request.note}</p>` : ""}
      `,
    },
    approved: {
      subject: `Leave Request Approved`,
      html: `
        <h2>Your leave request has been approved!</h2>
        <p><strong>Dates:</strong> ${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}</p>
        <p><strong>Type:</strong> ${request.leaveType}</p>
        ${request.approverComment ? `<p><strong>Manager Comment:</strong> ${request.approverComment}</p>` : ""}
      `,
    },
    rejected: {
      subject: `Leave Request Rejected`,
      html: `
        <h2>Your leave request has been rejected</h2>
        <p><strong>Dates:</strong> ${new Date(request.startDate).toLocaleDateString()} - ${new Date(request.endDate).toLocaleDateString()}</p>
        <p><strong>Type:</strong> ${request.leaveType}</p>
        ${request.approverComment ? `<p><strong>Manager Comment:</strong> ${request.approverComment}</p>` : ""}
      `,
    },
  }

  const template = templates[type]
  const recipient = type === "submitted" ? request.user.manager?.email : request.user.email

  if (recipient) {
    await sendEmail({
      to: recipient,
      subject: template.subject,
      html: template.html,
    })
  }
}
