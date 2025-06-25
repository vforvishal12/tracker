"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "EMPLOYEE" | "MANAGER" | "ADMIN"
  managerId?: string
  department?: string
}

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: "emp-001",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "EMPLOYEE",
    managerId: "mgr-001",
    department: "Engineering",
  })

  return <UserContext.Provider value={{ currentUser, setCurrentUser }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
