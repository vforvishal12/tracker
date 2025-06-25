"use client"

import { Calendar, momentLocalizer, type View, Views } from "react-big-calendar"
import moment from "moment"
import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    userId: string
    userName: string
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
    leaveType: string
    note?: string
    department?: string
  }
}

interface CalendarBoardProps {
  events: CalendarEvent[]
  onSelectEvent?: (event: CalendarEvent) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void
  view?: View
  onViewChange?: (view: View) => void
}

export function CalendarBoard({
  events,
  onSelectEvent,
  onSelectSlot,
  view = Views.MONTH,
  onViewChange,
}: CalendarBoardProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentView, setCurrentView] = useState<View>(view)

  const handleNavigate = useCallback((newDate: Date) => {
    setCurrentDate(newDate)
  }, [])

  const handleViewChange = useCallback(
    (newView: View) => {
      setCurrentView(newView)
      onViewChange?.(newView)
    },
    [onViewChange],
  )

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const status = event.resource.status.toLowerCase()
    const baseStyle = {
      borderRadius: "6px",
      border: "none",
      fontSize: "12px",
      fontWeight: "500",
      padding: "2px 6px",
    }

    const statusStyles = {
      pending: { backgroundColor: "#eab308", color: "#fef3c7" },
      approved: { backgroundColor: "#22c55e", color: "#dcfce7" },
      rejected: { backgroundColor: "#ef4444", color: "#fecaca" },
      cancelled: { backgroundColor: "#6b7280", color: "#f3f4f6" },
    }

    return {
      style: {
        ...baseStyle,
        ...statusStyles[status as keyof typeof statusStyles],
      },
    }
  }, [])

  const formats = useMemo(
    () => ({
      timeGutterFormat: "HH:mm",
      eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
        return `${moment(start).format("MMM D")} - ${moment(end).format("MMM D")}`
      },
      dayHeaderFormat: "dddd MMM D",
      monthHeaderFormat: "MMMM YYYY",
    }),
    [],
  )

  const CustomEvent = ({ event }: { event: CalendarEvent }) => (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer w-full h-full flex items-center">
          <span className="truncate">{event.title}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80" side="top">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{event.resource.userName}</h4>
            <Badge
              variant={
                event.resource.status === "APPROVED"
                  ? "default"
                  : event.resource.status === "PENDING"
                    ? "secondary"
                    : event.resource.status === "REJECTED"
                      ? "destructive"
                      : "outline"
              }
            >
              {event.resource.status}
            </Badge>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Dates: </span>
              {moment(event.start).format("MMM D, YYYY")} - {moment(event.end).format("MMM D, YYYY")}
            </div>
            <div>
              <span className="font-medium">Type: </span>
              {event.resource.leaveType}
            </div>
            {event.resource.department && (
              <div>
                <span className="font-medium">Department: </span>
                {event.resource.department}
              </div>
            )}
            {event.resource.note && (
              <div>
                <span className="font-medium">Note: </span>
                {event.resource.note}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  const CustomToolbar = ({ label, onNavigate, onView }: any) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("PREV")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold min-w-[200px] text-center">{label}</h2>
        <Button variant="outline" size="sm" onClick={() => onNavigate("NEXT")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate("TODAY")}>
          Today
        </Button>
        <div className="flex items-center space-x-1">
          {[
            { view: Views.DAY, label: "Day" },
            { view: Views.WEEK, label: "Week" },
            { view: Views.MONTH, label: "Month" },
            { view: Views.AGENDA, label: "Agenda" },
          ].map(({ view: viewType, label }) => (
            <Button
              key={viewType}
              variant={currentView === viewType ? "default" : "outline"}
              size="sm"
              onClick={() => onView(viewType)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5" />
          <span>Team Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              view={currentView}
              onView={handleViewChange}
              date={currentDate}
              onNavigate={handleNavigate}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
              formats={formats}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar,
              }}
              popup
              showMultiDayTimes
              step={60}
              timeslots={1}
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
