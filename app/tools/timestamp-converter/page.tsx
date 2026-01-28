"use client"

import { useState, useCallback, useEffect } from "react"
import { Clock, RefreshCw } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const tool = getToolById("timestamp-converter")!

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState("")
  const [datetime, setDatetime] = useState("")
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [error, setError] = useState("")

  // Update current time every second
  useEffect(() => {
    const update = () => setCurrentTime(Math.floor(Date.now() / 1000))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleTimestampChange = useCallback((value: string) => {
    setTimestamp(value)
    setError("")
    
    if (!value.trim()) {
      setDatetime("")
      return
    }

    const num = parseInt(value, 10)
    if (isNaN(num)) {
      setError("Invalid timestamp")
      return
    }

    // Detect if milliseconds or seconds
    const isMilliseconds = num > 9999999999
    const date = new Date(isMilliseconds ? num : num * 1000)
    
    if (isNaN(date.getTime())) {
      setError("Invalid timestamp")
      return
    }

    // Format as ISO string for datetime-local input
    const localIso = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setDatetime(localIso)
  }, [])

  const handleDatetimeChange = useCallback((value: string) => {
    setDatetime(value)
    setError("")
    
    if (!value) {
      setTimestamp("")
      return
    }

    const date = new Date(value)
    if (isNaN(date.getTime())) {
      setError("Invalid date")
      return
    }

    setTimestamp(Math.floor(date.getTime() / 1000).toString())
  }, [])

  const setNow = useCallback(() => {
    const now = new Date()
    setTimestamp(Math.floor(now.getTime() / 1000).toString())
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
    setDatetime(localIso)
    setError("")
  }, [])

  const parsedDate = timestamp ? new Date(parseInt(timestamp, 10) * 1000) : null

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Current Timestamp */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Unix Timestamp</p>
                <p className="text-2xl font-mono font-bold">{currentTime}</p>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton value={currentTime.toString()} />
                <Button variant="outline" size="sm" onClick={setNow}>
                  <RefreshCw className="size-4 mr-1" />
                  Use Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unix Timestamp Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Unix Timestamp (seconds)</Label>
            <CopyButton value={timestamp} />
          </div>
          <Input
            placeholder="Enter Unix timestamp..."
            value={timestamp}
            onChange={(e) => handleTimestampChange(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Date/Time Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Date & Time (Local)</Label>
          </div>
          <Input
            type="datetime-local"
            value={datetime}
            onChange={(e) => handleDatetimeChange(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Parsed Details */}
        {parsedDate && !error && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <Label className="block text-sm">Converted Values</Label>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">UTC</span>
                <code className="font-mono">{parsedDate.toUTCString()}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Local</span>
                <code className="font-mono">{parsedDate.toString()}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISO 8601</span>
                <code className="font-mono">{parsedDate.toISOString()}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Milliseconds</span>
                <code className="font-mono">{parsedDate.getTime()}</code>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relative</span>
                <code className="font-mono">
                  {formatRelativeTime(parsedDate)}
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffSecs = Math.abs(Math.floor(diffMs / 1000))
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  const isFuture = diffMs > 0
  const prefix = isFuture ? "in " : ""
  const suffix = isFuture ? "" : " ago"

  if (diffSecs < 60) return `${prefix}${diffSecs} seconds${suffix}`
  if (diffMins < 60) return `${prefix}${diffMins} minutes${suffix}`
  if (diffHours < 24) return `${prefix}${diffHours} hours${suffix}`
  return `${prefix}${diffDays} days${suffix}`
}
