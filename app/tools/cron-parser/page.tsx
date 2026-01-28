"use client"

import { useState, useMemo } from "react"
import { Calendar, Clock, AlertCircle } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const tool = getToolById("cron-parser")!

const CRON_PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at noon", value: "0 12 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every 1st of month at midnight", value: "0 0 1 * *" },
  { label: "Every 15 minutes", value: "*/15 * * * *" },
  { label: "Every weekday at 6 PM", value: "0 18 * * 1-5" },
]

function parseCronField(value: string, min: number, max: number, names?: string[]): string {
  if (value === "*") return "every"
  if (value.includes("/")) {
    const [range, step] = value.split("/")
    if (range === "*") return `every ${step}`
    return `every ${step} (${range})`
  }
  if (value.includes("-")) {
    const [start, end] = value.split("-")
    const startName = names?.[parseInt(start)] || start
    const endName = names?.[parseInt(end)] || end
    return `${startName} through ${endName}`
  }
  if (value.includes(",")) {
    const values = value.split(",")
    return values.map(v => names?.[parseInt(v)] || v).join(", ")
  }
  return names?.[parseInt(value)] || value
}

function parseCronExpression(cron: string): { description: string; error?: string; parts?: any } {
  const parts = cron.trim().split(/\s+/)
  
  if (parts.length !== 5) {
    return { description: "", error: "Cron expression must have exactly 5 fields" }
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  try {
    const minuteDesc = parseCronField(minute, 0, 59)
    const hourDesc = parseCronField(hour, 0, 23)
    const dayOfMonthDesc = parseCronField(dayOfMonth, 1, 31)
    const monthDesc = parseCronField(month, 1, 12, monthNames)
    const dayOfWeekDesc = parseCronField(dayOfWeek, 0, 6, dayNames)

    let description = "Runs "

    // Handle special cases first
    if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      description = "Runs every minute"
    } else if (minute !== "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      description = `Runs at minute ${minuteDesc} of every hour`
    } else if (minute !== "*" && hour !== "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      description = `Runs every day at ${hourDesc.padStart(2, '0')}:${minute.padStart(2, '0')}`
    } else if (dayOfWeek !== "*" && hour !== "*" && minute !== "*") {
      description = `Runs on ${dayOfWeekDesc} at ${hourDesc.padStart(2, '0')}:${minute.padStart(2, '0')}`
    } else {
      // General case
      const timePart = minute !== "*" || hour !== "*" 
        ? `at ${hour === "*" ? "every hour" : hourDesc.padStart(2, '0')}:${minute === "*" ? "00" : minute.padStart(2, '0')}`
        : ""
      
      const dayPart = dayOfMonth !== "*" ? `on day ${dayOfMonthDesc}` : ""
      const monthPart = month !== "*" ? `in ${monthDesc}` : ""
      const dowPart = dayOfWeek !== "*" ? `on ${dayOfWeekDesc}` : ""

      description = `Runs ${[timePart, dayPart, dowPart, monthPart].filter(Boolean).join(" ")}`
    }

    return {
      description,
      parts: {
        minute: { value: minute, description: minuteDesc },
        hour: { value: hour, description: hourDesc },
        dayOfMonth: { value: dayOfMonth, description: dayOfMonthDesc },
        month: { value: month, description: monthDesc },
        dayOfWeek: { value: dayOfWeek, description: dayOfWeekDesc },
      }
    }
  } catch (e) {
    return { description: "", error: "Invalid cron expression" }
  }
}

function getNextRuns(cron: string, count: number = 5): Date[] {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return []

  const [minuteStr, hourStr, dayOfMonthStr, monthStr, dayOfWeekStr] = parts
  const results: Date[] = []
  const now = new Date()
  let current = new Date(now)
  current.setSeconds(0)
  current.setMilliseconds(0)

  const matches = (value: string, current: number, min: number, max: number): boolean => {
    if (value === "*") return true
    if (value.includes("/")) {
      const [range, step] = value.split("/")
      const stepNum = parseInt(step)
      if (range === "*") return current % stepNum === 0
      return false
    }
    if (value.includes("-")) {
      const [start, end] = value.split("-").map(Number)
      return current >= start && current <= end
    }
    if (value.includes(",")) {
      return value.split(",").map(Number).includes(current)
    }
    return current === parseInt(value)
  }

  let iterations = 0
  while (results.length < count && iterations < 10000) {
    iterations++
    current = new Date(current.getTime() + 60000) // Add 1 minute

    const minute = current.getMinutes()
    const hour = current.getHours()
    const dayOfMonth = current.getDate()
    const month = current.getMonth() + 1
    const dayOfWeek = current.getDay()

    if (
      matches(minuteStr, minute, 0, 59) &&
      matches(hourStr, hour, 0, 23) &&
      matches(dayOfMonthStr, dayOfMonth, 1, 31) &&
      matches(monthStr, month, 1, 12) &&
      matches(dayOfWeekStr, dayOfWeek, 0, 6)
    ) {
      results.push(new Date(current))
    }
  }

  return results
}

export default function CronParserPage() {
  const [expression, setExpression] = useState("0 0 * * *")

  const parsed = useMemo(() => parseCronExpression(expression), [expression])
  const nextRuns = useMemo(() => {
    if (parsed.error) return []
    return getNextRuns(expression, 5)
  }, [expression, parsed.error])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Cron Expression</label>
            <CopyButton value={expression} />
          </div>
          <Input
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="0 0 * * *"
            className="font-mono text-lg"
          />
          <p className="text-xs text-muted-foreground">
            Format: minute hour day-of-month month day-of-week
          </p>
        </div>

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Quick Examples</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {CRON_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                onClick={() => setExpression(preset.value)}
                className="justify-start text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Error */}
        {parsed.error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{parsed.error}</AlertDescription>
          </Alert>
        )}

        {/* Description */}
        {!parsed.error && parsed.description && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="size-5" />
                Schedule Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{parsed.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Field Breakdown */}
        {!parsed.error && parsed.parts && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Field Breakdown</label>
            <div className="grid gap-2">
              {Object.entries(parsed.parts).map(([field, data]: [string, any]) => (
                <div key={field} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className="w-28 text-sm font-medium capitalize text-muted-foreground">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    {data.value}
                  </div>
                  <div className="text-sm flex-1">
                    {data.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Runs */}
        {!parsed.error && nextRuns.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="size-4" />
              Next {nextRuns.length} Executions
            </label>
            <div className="rounded-lg border bg-card">
              {nextRuns.map((date, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-b last:border-b-0"
                >
                  <span className="text-sm font-mono">
                    {date.toLocaleString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((date.getTime() - Date.now()) / 1000 / 60)} min from now
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Cron Expression Format:</p>
          <div className="font-mono text-xs bg-muted p-3 rounded-lg">
            <div>* * * * *</div>
            <div>│ │ │ │ │</div>
            <div>│ │ │ │ └─── Day of Week (0-6, 0=Sunday)</div>
            <div>│ │ │ └───── Month (1-12)</div>
            <div>│ │ └─────── Day of Month (1-31)</div>
            <div>│ └───────── Hour (0-23)</div>
            <div>└─────────── Minute (0-59)</div>
          </div>
          <p className="text-xs">
            Special characters: * (any), - (range), , (list), / (step)
          </p>
        </div>
      </div>
    </ToolWrapper>
  )
}
