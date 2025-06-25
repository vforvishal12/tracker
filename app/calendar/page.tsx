"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import { CalendarBoard } from "@/components/calendar-board"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { View } from "react-big-calendar"

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    userId?: string
    userName?: string
    status?: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
    leaveType?: string
    note?: string
    department?: string
    type?: string
    description?: string
  }
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<View>("month" as View)

  useEffect(() => {
    if (session) {
      fetchEvents()
    }
  }, [session])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/calendar/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(
          data.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    // TODO: Show event details modal
    console.log("Selected event:", event)
  }

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    // TODO: Open leave request form with pre-filled dates
    console.log("Selected slot:", slotInfo)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Team Calendar</h1>
            <p className="text-muted-foreground mt-1">View team schedules and upcoming time off</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
              🟡 Pending
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
              🟢 Approved
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">
              🔴 Rejected
            </Badge>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        ) : (
          <CalendarBoard
            events={events}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            view={currentView}
            onViewChange={setCurrentView}
          />
        )}
      </div>
    </div>
  )
}
