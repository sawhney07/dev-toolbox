"use client"

import { useState, useCallback } from "react"
import { ArrowLeftRight, AlertCircle } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tool = getToolById("yaml-json")!

// Simple YAML parser (handles common cases)
function parseYAML(yaml: string): unknown {
  const lines = yaml.split("\n")
  const result: Record<string, unknown> = {}
  const stack: { indent: number; obj: Record<string, unknown>; key?: string }[] = [
    { indent: -1, obj: result },
  ]
  let currentArray: unknown[] | null = null
  let currentArrayKey: string | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith("#")) continue
    
    const indent = line.search(/\S/)
    const content = line.trim()
    
    // Handle array items
    if (content.startsWith("- ")) {
      const value = content.slice(2).trim()
      
      // Find parent object
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }
      const parent = stack[stack.length - 1].obj
      
      if (currentArrayKey && currentArray) {
        // Check if it's a key-value pair
        if (value.includes(": ")) {
          const [k, v] = value.split(": ").map(s => s.trim())
          currentArray.push({ [k]: parseValue(v) })
        } else {
          currentArray.push(parseValue(value))
        }
      }
      continue
    }
    
    // Handle key-value pairs
    const colonIndex = content.indexOf(":")
    if (colonIndex > 0) {
      const key = content.slice(0, colonIndex).trim()
      const value = content.slice(colonIndex + 1).trim()
      
      // Pop stack to correct level
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop()
      }
      
      const parent = stack[stack.length - 1].obj
      
      if (value === "" || value === "|" || value === ">") {
        // Check if next line is an array or nested object
        const nextLine = lines[i + 1]
        if (nextLine && nextLine.trim().startsWith("-")) {
          currentArray = []
          currentArrayKey = key
          parent[key] = currentArray
        } else {
          // Nested object
          const newObj: Record<string, unknown> = {}
          parent[key] = newObj
          stack.push({ indent, obj: newObj, key })
        }
      } else {
        parent[key] = parseValue(value)
        currentArray = null
        currentArrayKey = null
      }
    }
  }
  
  return result
}

function parseValue(value: string): unknown {
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }
  
  // Boolean
  if (value === "true" || value === "True" || value === "TRUE") return true
  if (value === "false" || value === "False" || value === "FALSE") return false
  
  // Null
  if (value === "null" || value === "~" || value === "") return null
  
  // Number
  if (!isNaN(Number(value)) && value !== "") return Number(value)
  
  // String
  return value
}

// Convert JSON to YAML
function jsonToYAML(obj: unknown, indent = 0): string {
  const spaces = "  ".repeat(indent)
  
  if (obj === null) return "null"
  if (typeof obj === "boolean") return obj ? "true" : "false"
  if (typeof obj === "number") return String(obj)
  if (typeof obj === "string") {
    // Quote strings with special characters
    if (obj.includes(":") || obj.includes("#") || obj.includes("\n") || 
        obj.startsWith(" ") || obj.endsWith(" ")) {
      return `"${obj.replace(/"/g, '\\"')}"`
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]"
    return obj
      .map((item) => {
        const value = jsonToYAML(item, indent + 1)
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const lines = value.split("\n")
          return `${spaces}- ${lines[0]}\n${lines.slice(1).map(l => spaces + "  " + l).join("\n")}`
        }
        return `${spaces}- ${value}`
      })
      .join("\n")
  }
  
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return "{}"
    return entries
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          const nested = jsonToYAML(value, indent + 1)
          return `${spaces}${key}:\n${nested}`
        }
        return `${spaces}${key}: ${jsonToYAML(value, indent)}`
      })
      .join("\n")
  }
  
  return String(obj)
}

export default function YamlJsonPage() {
  const [mode, setMode] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indentSize, setIndentSize] = useState(2)

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      if (mode === "yaml-to-json") {
        const parsed = parseYAML(input)
        setOutput(JSON.stringify(parsed, null, indentSize))
      } else {
        const parsed = JSON.parse(input)
        setOutput(jsonToYAML(parsed))
      }
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid input")
      setOutput("")
    }
  }, [input, mode, indentSize])

  const swapMode = () => {
    setMode(mode === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json")
    setInput(output)
    setOutput("")
    setError("")
  }

  const sampleYAML = `# Sample YAML
name: John Doe
age: 30
active: true
address:
  street: 123 Main St
  city: New York
skills:
  - JavaScript
  - Python
  - Go`

  const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "active": true,
  "address": {
    "street": "123 Main St",
    "city": "New York"
  },
  "skills": ["JavaScript", "Python", "Go"]
}`

  const loadSample = () => {
    setInput(mode === "yaml-to-json" ? sampleYAML : sampleJSON)
    setOutput("")
    setError("")
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Mode Selection */}
        <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setOutput(""); setError("") }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
            <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Options */}
        {mode === "yaml-to-json" && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">JSON Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="text-sm border rounded-md px-3 py-1.5 bg-background"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        )}

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {mode === "yaml-to-json" ? "YAML Input" : "JSON Input"}
            </label>
            <Button variant="ghost" size="sm" onClick={loadSample}>
              Load Sample
            </Button>
          </div>
          <Textarea
            placeholder={mode === "yaml-to-json" 
              ? "name: John\nage: 30" 
              : '{"name": "John", "age": 30}'
            }
            value={input}
            onChange={(e) => { setInput(e.target.value); setError("") }}
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={convert} className="flex-1">
            Convert
          </Button>
          <Button variant="outline" onClick={swapMode} disabled={!output}>
            <ArrowLeftRight className="size-4 mr-2" />
            Swap & Convert Back
          </Button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {mode === "yaml-to-json" ? "JSON Output" : "YAML Output"}
            </label>
            <CopyButton value={output} />
          </div>
          <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto max-h-[400px] font-mono whitespace-pre-wrap">
            {output || <span className="text-muted-foreground">
              {mode === "yaml-to-json" ? "JSON output will appear here..." : "YAML output will appear here..."}
            </span>}
          </pre>
        </div>
      </div>
    </ToolWrapper>
  )
}
