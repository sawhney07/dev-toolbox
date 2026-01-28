"use client"

import { useState, useCallback } from "react"
import { AlertCircle, Minimize2, Maximize2 } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const tool = getToolById("json-formatter")!

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indentSize, setIndentSize] = useState(2)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indentSize))
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setOutput("")
    }
  }, [input, indentSize])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON")
      setOutput("")
    }
  }, [input])

  const handleInputChange = (value: string) => {
    setInput(value)
    setError("")
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Input JSON</label>
            <div className="flex items-center gap-2">
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="text-sm border rounded-md px-2 py-1 bg-background"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
          </div>
          <Textarea
            placeholder='{"example": "Paste your JSON here..."}'
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
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
          <Button onClick={format} className="flex-1">
            <Maximize2 className="size-4 mr-2" />
            Format / Beautify
          </Button>
          <Button onClick={minify} variant="outline" className="flex-1 bg-transparent">
            <Minimize2 className="size-4 mr-2" />
            Minify
          </Button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={output} />
          </div>
          <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto max-h-[400px] font-mono whitespace-pre-wrap">
            {output || <span className="text-muted-foreground">Formatted JSON will appear here...</span>}
          </pre>
        </div>
      </div>
    </ToolWrapper>
  )
}
