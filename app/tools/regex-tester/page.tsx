"use client"

import { useState, useCallback, useMemo } from "react"
import { AlertCircle, Info } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

const tool = getToolById("regex-tester")!

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("")
  const [testString, setTestString] = useState("")
  const [flags, setFlags] = useState({
    g: true,
    i: false,
    m: false,
    s: false,
  })

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join("")
  }, [flags])

  const { regex, error, matches } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: "", matches: [] }
    }

    try {
      const re = new RegExp(pattern, flagString)
      const matchesArr: { match: string; index: number; groups?: Record<string, string> }[] = []
      
      if (testString) {
        let match
        if (flags.g) {
          while ((match = re.exec(testString)) !== null) {
            matchesArr.push({
              match: match[0],
              index: match.index,
              groups: match.groups,
            })
            if (match.index === re.lastIndex) {
              re.lastIndex++
            }
          }
        } else {
          match = re.exec(testString)
          if (match) {
            matchesArr.push({
              match: match[0],
              index: match.index,
              groups: match.groups,
            })
          }
        }
      }

      return { regex: re, error: "", matches: matchesArr }
    } catch (e) {
      return { regex: null, error: e instanceof Error ? e.message : "Invalid regex", matches: [] }
    }
  }, [pattern, testString, flagString, flags.g])

  const highlightedText = useMemo(() => {
    if (!regex || !testString || matches.length === 0) {
      return testString
    }

    const parts: { text: string; isMatch: boolean }[] = []
    let lastIndex = 0

    matches.forEach((m) => {
      if (m.index > lastIndex) {
        parts.push({ text: testString.slice(lastIndex, m.index), isMatch: false })
      }
      parts.push({ text: m.match, isMatch: true })
      lastIndex = m.index + m.match.length
    })

    if (lastIndex < testString.length) {
      parts.push({ text: testString.slice(lastIndex), isMatch: false })
    }

    return parts
  }, [regex, testString, matches])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Pattern Input */}
        <div>
          <Label htmlFor="pattern" className="mb-2 block">Regular Expression</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            <Input
              id="pattern"
              placeholder="Enter regex pattern..."
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="font-mono"
            />
            <span className="text-muted-foreground">/{flagString}</span>
          </div>
        </div>

        {/* Flags */}
        <div>
          <Label className="mb-3 block">Flags</Label>
          <div className="flex flex-wrap gap-4">
            {[
              { key: "g", label: "Global (g)", desc: "Find all matches" },
              { key: "i", label: "Case-insensitive (i)", desc: "Ignore case" },
              { key: "m", label: "Multiline (m)", desc: "^ and $ match line boundaries" },
              { key: "s", label: "Dotall (s)", desc: ". matches newlines" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`flag-${key}`}
                  checked={flags[key as keyof typeof flags]}
                  onCheckedChange={(checked) =>
                    setFlags((f) => ({ ...f, [key]: checked === true }))
                  }
                />
                <label htmlFor={`flag-${key}`} className="text-sm cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Test String */}
        <div>
          <Label htmlFor="test" className="mb-2 block">Test String</Label>
          <Textarea
            id="test"
            placeholder="Enter text to test against..."
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="font-mono text-sm min-h-[120px]"
          />
        </div>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Results</Label>
            <Badge variant="secondary">
              {matches.length} match{matches.length !== 1 ? "es" : ""}
            </Badge>
          </div>
          
          {/* Highlighted Text */}
          <div className="p-4 rounded-lg bg-muted font-mono text-sm min-h-[80px] whitespace-pre-wrap break-all">
            {Array.isArray(highlightedText) ? (
              highlightedText.map((part, i) =>
                part.isMatch ? (
                  <mark key={i} className="bg-primary/30 text-primary-foreground px-0.5 rounded">
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )
            ) : (
              <span className="text-muted-foreground">
                {testString || "Enter a test string to see results..."}
              </span>
            )}
          </div>

          {/* Match Details */}
          {matches.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label className="text-sm">Match Details</Label>
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {matches.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="shrink-0">
                      {i + 1}
                    </Badge>
                    <code className="px-2 py-1 bg-muted rounded text-xs">
                      {m.match}
                    </code>
                    <span className="text-muted-foreground text-xs">
                      at index {m.index}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolWrapper>
  )
}
