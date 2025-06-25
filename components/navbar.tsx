"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserSelector } from "@/components/user-selector"
import { useUser } from "@/lib/user-context"
import { useEffect, useState } from "react"

export function Navbar() {
  const { currentUser } = useUser()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (currentUser && (currentUser.role === "MANAGER" || currentUser.role === "ADMIN")) {
      fetchPendingCount()
    }
  }, [currentUser])

  const fetchPendingCount = async () => {
    try {
      const response = await fetch(`/api/leave/pending-count?userId=${currentUser?.id}`)
      const data = await response.json()
      setPendingCount(data.count || 0)
    } catch (error) {
      console.error("Failed to fetch pending count:", error)
    }
  }

  if (!currentUser) return null

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Holiday Tracker</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/calendar"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Calendar
              </Link>
              {(currentUser.role === "MANAGER" || currentUser.role === "ADMIN") && (
                <Link
                  href="/approvals"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                >
                  <span>Approvals</span>
                  {pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {pendingCount}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <UserSelector />
            <ThemeToggle />

            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{currentUser.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
