// Static data for demo purposes - no database required

export interface User {
  id: string
  name: string
  email: string
  role: "EMPLOYEE" | "MANAGER" | "ADMIN"
  managerId?: string
  department: string
  startDate: string
}

export interface LeaveRequest {
  id: string
  userId: string
  startDate: string
  endDate: string
  leaveType: "VACATION" | "SICK" | "PERSONAL" | "MATERNITY" | "PATERNITY" | "BEREAVEMENT" | "OTHER"
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  note?: string
  approverComment?: string
  approvedById?: string
  createdAt: string
  updatedAt: string
}

export interface Holiday {
  id: string
  name: string
  date: string
  isRecurring: boolean
  description?: string
}

// Sample Users Data
export const USERS: User[] = [
  // Admin
  {
    id: "admin-001",
    name: "Admin User",
    email: "admin@company.com",
    role: "ADMIN",
    department: "HR",
    startDate: "2019-01-01",
  },

  // Managers
  {
    id: "mgr-001",
    name: "Sarah Manager",
    email: "sarah.manager@company.com",
    role: "MANAGER",
    department: "Engineering",
    startDate: "2020-01-15",
  },
  {
    id: "mgr-002",
    name: "Mike Director",
    email: "mike.director@company.com",
    role: "MANAGER",
    department: "Marketing",
    startDate: "2019-03-20",
  },
  {
    id: "mgr-003",
    name: "Lisa Team Lead",
    email: "lisa.lead@company.com",
    role: "MANAGER",
    department: "Sales",
    startDate: "2021-06-10",
  },

  // Employees
  {
    id: "emp-001",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-001",
    department: "Engineering",
    startDate: "2022-03-15",
  },
  {
    id: "emp-002",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-001",
    department: "Engineering",
    startDate: "2021-07-20",
  },
  {
    id: "emp-003",
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-001",
    department: "Engineering",
    startDate: "2022-01-10",
  },
  {
    id: "emp-010",
    name: "Ivy Thomas",
    email: "ivy.thomas@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-002",
    department: "Marketing",
    startDate: "2022-01-20",
  },
  {
    id: "emp-011",
    name: "Jack Jackson",
    email: "jack.jackson@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-002",
    department: "Marketing",
    startDate: "2021-08-15",
  },
  {
    id: "emp-019",
    name: "Ruby Clark",
    email: "ruby.clark@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-003",
    department: "Sales",
    startDate: "2022-01-12",
  },
  {
    id: "emp-020",
    name: "Sam Rodriguez",
    email: "sam.rodriguez@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-003",
    department: "Sales",
    startDate: "2021-07-28",
  },
]

// Sample Leave Requests Data
export const LEAVE_REQUESTS: LeaveRequest[] = [
  // Approved requests
  {
    id: "req-001",
    userId: "emp-001",
    startDate: "2024-07-15",
    endDate: "2024-07-19",
    leaveType: "VACATION",
    status: "APPROVED",
    note: "Summer vacation with family",
    approvedById: "mgr-001",
    approverComment: "Enjoy your vacation!",
    createdAt: "2024-06-15T10:00:00Z",
    updatedAt: "2024-06-16T09:00:00Z",
  },
  {
    id: "req-002",
    userId: "emp-010",
    startDate: "2024-08-05",
    endDate: "2024-08-09",
    leaveType: "VACATION",
    status: "APPROVED",
    note: "Beach vacation",
    approvedById: "mgr-002",
    approverComment: "Have a great time!",
    createdAt: "2024-07-05T14:30:00Z",
    updatedAt: "2024-07-06T11:15:00Z",
  },
  {
    id: "req-003",
    userId: "emp-019",
    startDate: "2024-06-20",
    endDate: "2024-06-21",
    leaveType: "PERSONAL",
    status: "APPROVED",
    note: "Personal matters",
    approvedById: "mgr-003",
    approverComment: "Approved",
    createdAt: "2024-06-10T16:45:00Z",
    updatedAt: "2024-06-11T08:30:00Z",
  },

  // Pending requests
  {
    id: "req-004",
    userId: "emp-002",
    startDate: "2024-08-12",
    endDate: "2024-08-16",
    leaveType: "VACATION",
    status: "PENDING",
    note: "Anniversary trip",
    createdAt: "2024-07-20T12:00:00Z",
    updatedAt: "2024-07-20T12:00:00Z",
  },
  {
    id: "req-005",
    userId: "emp-011",
    startDate: "2024-07-22",
    endDate: "2024-07-26",
    leaveType: "VACATION",
    status: "PENDING",
    note: "Family reunion",
    createdAt: "2024-07-15T09:30:00Z",
    updatedAt: "2024-07-15T09:30:00Z",
  },
  {
    id: "req-006",
    userId: "emp-020",
    startDate: "2024-09-02",
    endDate: "2024-09-06",
    leaveType: "VACATION",
    status: "PENDING",
    note: "Labor Day extended weekend",
    createdAt: "2024-08-01T15:20:00Z",
    updatedAt: "2024-08-01T15:20:00Z",
  },
  {
    id: "req-007",
    userId: "emp-003",
    startDate: "2024-08-01",
    endDate: "2024-08-02",
    leaveType: "SICK",
    status: "PENDING",
    note: "Medical appointment",
    createdAt: "2024-07-25T11:45:00Z",
    updatedAt: "2024-07-25T11:45:00Z",
  },

  // Rejected requests
  {
    id: "req-008",
    userId: "emp-002",
    startDate: "2024-12-23",
    endDate: "2024-12-30",
    leaveType: "VACATION",
    status: "REJECTED",
    note: "Christmas vacation",
    approvedById: "mgr-001",
    approverComment: "Too many people already off during this period",
    createdAt: "2024-11-15T13:00:00Z",
    updatedAt: "2024-11-20T10:30:00Z",
  },

  // More approved requests for calendar display
  {
    id: "req-009",
    userId: "emp-003",
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    leaveType: "VACATION",
    status: "APPROVED",
    note: "July 4th vacation",
    approvedById: "mgr-001",
    approverComment: "Approved",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-02T14:00:00Z",
  },
  {
    id: "req-010",
    userId: "emp-011",
    startDate: "2024-08-19",
    endDate: "2024-08-23",
    leaveType: "VACATION",
    status: "APPROVED",
    note: "Summer break",
    approvedById: "mgr-002",
    approverComment: "Enjoy!",
    createdAt: "2024-07-19T16:30:00Z",
    updatedAt: "2024-07-20T09:15:00Z",
  },
]

// Sample Holidays Data
export const HOLIDAYS: Holiday[] = [
  {
    id: "hol-001",
    name: "New Year's Day",
    date: "2024-01-01",
    isRecurring: true,
    description: "New Year's Day holiday",
  },
  {
    id: "hol-002",
    name: "Martin Luther King Jr. Day",
    date: "2024-01-15",
    isRecurring: true,
    description: "MLK Day",
  },
  {
    id: "hol-003",
    name: "Presidents Day",
    date: "2024-02-19",
    isRecurring: true,
    description: "Presidents Day",
  },
  {
    id: "hol-004",
    name: "Memorial Day",
    date: "2024-05-27",
    isRecurring: true,
    description: "Memorial Day",
  },
  {
    id: "hol-005",
    name: "Independence Day",
    date: "2024-07-04",
    isRecurring: true,
    description: "Independence Day",
  },
  {
    id: "hol-006",
    name: "Labor Day",
    date: "2024-09-02",
    isRecurring: true,
    description: "Labor Day",
  },
  {
    id: "hol-007",
    name: "Columbus Day",
    date: "2024-10-14",
    isRecurring: true,
    description: "Columbus Day",
  },
  {
    id: "hol-008",
    name: "Veterans Day",
    date: "2024-11-11",
    isRecurring: true,
    description: "Veterans Day",
  },
  {
    id: "hol-009",
    name: "Thanksgiving",
    date: "2024-11-28",
    isRecurring: true,
    description: "Thanksgiving Day",
  },
  {
    id: "hol-010",
    name: "Christmas Day",
    date: "2024-12-25",
    isRecurring: true,
    description: "Christmas Day",
  },
]

// Helper functions to simulate database operations
export function getUserById(id: string): User | undefined {
  return USERS.find((user) => user.id === id)
}

export function getUsersByManagerId(managerId: string): User[] {
  return USERS.filter((user) => user.managerId === managerId)
}

export function getLeaveRequestsByUserId(userId: string): LeaveRequest[] {
  return LEAVE_REQUESTS.filter((request) => request.userId === userId)
}

export function getLeaveRequestsByManagerId(managerId: string): LeaveRequest[] {
  const directReports = getUsersByManagerId(managerId)
  const directReportIds = directReports.map((user) => user.id)
  return LEAVE_REQUESTS.filter((request) => directReportIds.includes(request.userId))
}

export function getPendingLeaveRequests(): LeaveRequest[] {
  return LEAVE_REQUESTS.filter((request) => request.status === "PENDING")
}

export function addLeaveRequest(request: Omit<LeaveRequest, "id" | "createdAt" | "updatedAt">): LeaveRequest {
  const newRequest: LeaveRequest = {
    ...request,
    id: `req-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  LEAVE_REQUESTS.push(newRequest)
  return newRequest
}

export function updateLeaveRequest(id: string, updates: Partial<LeaveRequest>): LeaveRequest | null {
  const index = LEAVE_REQUESTS.findIndex((request) => request.id === id)
  if (index === -1) return null

  LEAVE_REQUESTS[index] = {
    ...LEAVE_REQUESTS[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return LEAVE_REQUESTS[index]
}

export function deleteLeaveRequest(id: string): boolean {
  const index = LEAVE_REQUESTS.findIndex((request) => request.id === id)
  if (index === -1) return false

  LEAVE_REQUESTS.splice(index, 1)
  return true
}
