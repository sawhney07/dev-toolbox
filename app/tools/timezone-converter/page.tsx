"use client"

import { useState, useEffect } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("timezone-converter")!

const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: 0 },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: -5 },
  { value: "America/Chicago", label: "Central Time (CT)", offset: -6 },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: -7 },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: -8 },
  { value: "America/Anchorage", label: "Alaska Time (AKT)", offset: -9 },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HST)", offset: -10 },
  { value: "Europe/London", label: "London (GMT/BST)", offset: 0 },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", offset: 1 },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: 1 },
  { value: "Europe/Moscow", label: "Moscow (MSK)", offset: 3 },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: 4 },
  { value: "Asia/Kolkata", label: "India (IST)", offset: 5.5 },
  { value: "Asia/Shanghai", label: "China (CST)", offset: 8 },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: 9 },
  { value: "Asia/Seoul", label: "Seoul (KST)", offset: 9 },
  { value: "Australia/Sydney", label: "Sydney (AEDT/AEST)", offset: 10 },
  { value: "Pacific/Auckland", label: "Auckland (NZDT/NZST)", offset: 12 },
]

export default function TimezoneConverterPage() {
  const [inputDate, setInputDate] = useState("")
  const [inputTime, setInputTime] = useState("")
  const [fromTimezone, setFromTimezone] = useState("UTC")
  const [toTimezones, setToTimezones] = useState<string[]>(["America/New_York", "Europe/London", "Asia/Tokyo"])
  const [convertedTimes, setConvertedTimes] = useState<{ timezone: string; time: string; date: string }[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Set default to current date and time
  useEffect(() => {
    const now = new Date()
    setInputDate(now.toISOString().split("T")[0])
    setInputTime(now.toTimeString().slice(0, 5))
  }, [])

  const convertTimezone = () => {
    if (!inputDate || !inputTime) {
      toast({
        title: "Missing Input",
        description: "Please enter both date and time",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a date object in the source timezone
      const dateTimeString = `${inputDate}T${inputTime}:00`
      const sourceDate = new Date(dateTimeString)

      const results = toTimezones.map((tz) => {
        const converted = new Date(sourceDate.toLocaleString("en-US", { timeZone: fromTimezone }))
        const targetTime = new Date(converted.toLocaleString("en-US", { timeZone: tz }))
        
        return {
          timezone: tz,
          time: targetTime.toLocaleTimeString("en-US", { 
            timeZone: tz, 
            hour: "2-digit", 
            minute: "2-digit",
            second: "2-digit",
            hour12: true 
          }),
          date: targetTime.toLocaleDateString("en-US", { 
            timeZone: tz,
            weekday: "short",
            year: "numeric", 
            month: "short", 
            day: "numeric"
          }),
        }
      })

      setConvertedTimes(results)
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: error instanceof Error ? error.message : "Failed to convert timezone",
        variant: "destructive",
      })
    }
  }

  const addTimezone = (tz: string) => {
    if (!toTimezones.includes(tz)) {
      setToTimezones([...toTimezones, tz])
    }
  }

  const removeTimezone = (tz: string) => {
    setToTimezones(toTimezones.filter(t => t !== tz))
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Time copied to clipboard",
    })
  }

  const getTimezoneLabel = (tz: string) => {
    return TIMEZONES.find(t => t.value === tz)?.label || tz
  }

  const formatCurrentTime = (tz: string) => {
    return currentTime.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    })
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Current Time in Selected Timezones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {toTimezones.map((tz) => (
                <div key={tz} className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">{getTimezoneLabel(tz)}</p>
                  <p className="text-xl font-bold font-mono">{formatCurrentTime(tz)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Converter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Convert Specific Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="input-date">Date</Label>
                <Input
                  id="input-date"
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="input-time">Time</Label>
                <Input
                  id="input-time"
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="from-timezone">From Timezone</Label>
                <Select value={fromTimezone} onValueChange={setFromTimezone}>
                  <SelectTrigger id="from-timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Timezone */}
            <div>
              <Label htmlFor="add-timezone">Add Timezone to Convert To</Label>
              <div className="flex gap-2">
                <Select onValueChange={addTimezone}>
                  <SelectTrigger id="add-timezone">
                    <SelectValue placeholder="Select timezone to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.filter(tz => !toTimezones.includes(tz.value)).map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Timezones */}
            <div>
              <Label className="mb-2 block">Converting To:</Label>
              <div className="flex flex-wrap gap-2">
                {toTimezones.map((tz) => (
                  <div
                    key={tz}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
                  >
                    <span>{TIMEZONES.find(t => t.value === tz)?.label || tz}</span>
                    <button
                      onClick={() => removeTimezone(tz)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={convertTimezone} className="w-full">
              Convert Time
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {convertedTimes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Converted Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {convertedTimes.map((result) => (
                  <div
                    key={result.timezone}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{getTimezoneLabel(result.timezone)}</p>
                      <p className="text-sm text-muted-foreground">{result.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold font-mono">{result.time}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(`${result.date} ${result.time}`)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolWrapper>
  )
}
