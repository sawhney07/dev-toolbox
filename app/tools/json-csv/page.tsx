"use client"

import { useState, useCallback } from "react"
import { ArrowDown, ArrowUp, AlertCircle } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

const tool = getToolById("json-csv")!

function jsonToCsv(json: unknown[]): string {
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error("Input must be a non-empty array of objects")
  }

  // Get all unique keys
  const keys = [...new Set(json.flatMap((obj) => Object.keys(obj as Record<string, unknown>)))]

  // Create header row
  const header = keys.map((key) => `"${key}"`).join(",")

  // Create data rows
  const rows = json.map((obj) => {
    const record = obj as Record<string, unknown>
    return keys
      .map((key) => {
        const value = record[key]
        if (value === null || value === undefined) return ""
        if (typeof value === "string") return `"${value.replace(/"/g, '""')}"`
        if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        return String(value)
      })
      .join(",")
  })

  return [header, ...rows].join("\n")
}

function csvToJson(csv: string): unknown[] {
  const lines = csv.trim().split("\n")
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row")
  }

  // Parse header
  const headers = parseCsvLine(lines[0])

  // Parse data rows
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const obj: Record<string, string> = {}
    headers.forEach((header, i) => {
      obj[header] = values[i] || ""
    })
    return obj
  })
}

function parseCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ",") {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }
  }
  result.push(current)
  return result
}

export default function JsonCsvPage() {
  const [jsonInput, setJsonInput] = useState("")
  const [csvOutput, setCsvOutput] = useState("")
  const [csvInput, setCsvInput] = useState("")
  const [jsonOutput, setJsonOutput] = useState("")
  const [jsonToCsvError, setJsonToCsvError] = useState("")
  const [csvToJsonError, setCsvToJsonError] = useState("")

  const handleJsonToCsv = useCallback(() => {
    if (!jsonInput.trim()) {
      setCsvOutput("")
      setJsonToCsvError("")
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      const csv = jsonToCsv(parsed)
      setCsvOutput(csv)
      setJsonToCsvError("")
    } catch (e) {
      setJsonToCsvError(e instanceof Error ? e.message : "Invalid JSON")
      setCsvOutput("")
    }
  }, [jsonInput])

  const handleCsvToJson = useCallback(() => {
    if (!csvInput.trim()) {
      setJsonOutput("")
      setCsvToJsonError("")
      return
    }

    try {
      const json = csvToJson(csvInput)
      setJsonOutput(JSON.stringify(json, null, 2))
      setCsvToJsonError("")
    } catch (e) {
      setCsvToJsonError(e instanceof Error ? e.message : "Invalid CSV")
      setJsonOutput("")
    }
  }, [csvInput])

  return (
    <ToolWrapper tool={tool}>
      <Tabs defaultValue="json-to-csv" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="json-to-csv">JSON to CSV</TabsTrigger>
          <TabsTrigger value="csv-to-json">CSV to JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="json-to-csv" className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">JSON Array</label>
            <Textarea
              placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <Button onClick={handleJsonToCsv} className="w-full">
            <ArrowDown className="size-4 mr-2" />
            Convert to CSV
          </Button>

          {jsonToCsvError && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{jsonToCsvError}</AlertDescription>
            </Alert>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">CSV Output</label>
              <CopyButton value={csvOutput} />
            </div>
            <Textarea
              value={csvOutput}
              readOnly
              placeholder="CSV output will appear here..."
              className="font-mono text-sm min-h-[120px] bg-muted"
            />
          </div>
        </TabsContent>

        <TabsContent value="csv-to-json" className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">CSV Data</label>
            <Textarea
              placeholder="name,age&#10;John,30&#10;Jane,25"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <Button onClick={handleCsvToJson} className="w-full">
            <ArrowUp className="size-4 mr-2" />
            Convert to JSON
          </Button>

          {csvToJsonError && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{csvToJsonError}</AlertDescription>
            </Alert>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">JSON Output</label>
              <CopyButton value={jsonOutput} />
            </div>
            <Textarea
              value={jsonOutput}
              readOnly
              placeholder="JSON output will appear here..."
              className="font-mono text-sm min-h-[120px] bg-muted"
            />
          </div>
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}
