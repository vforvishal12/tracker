import { z } from "zod"

export const leaveRequestSchema = z
  .object({
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
    leaveType: z.enum(["VACATION", "SICK", "PERSONAL", "MATERNITY", "PATERNITY", "BEREAVEMENT", "OTHER"]),
    note: z.string().optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })

export const approvalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  approverComment: z.string().optional(),
})

export const holidaySchema = z.object({
  name: z.string().min(1, "Holiday name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  isRecurring: z.boolean().default(false),
  description: z.string().optional(),
})
