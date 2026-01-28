"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Trash2 } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const tool = getToolById("uuid-generator")!

function generateUUID(): string {
  return crypto.randomUUID()
}

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [format, setFormat] = useState<"default" | "uppercase" | "no-dashes">("default")

  const formatUuid = useCallback(
    (uuid: string) => {
      switch (format) {
        case "uppercase":
          return uuid.toUpperCase()
        case "no-dashes":
          return uuid.replace(/-/g, "")
        default:
          return uuid
      }
    },
    [format]
  )

  const generate = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => formatUuid(generateUUID()))
    setUuids(newUuids)
  }, [count, formatUuid])

  const copyAll = useCallback(() => {
    navigator.clipboard.writeText(uuids.join("\n"))
  }, [uuids])

  const clear = useCallback(() => {
    setUuids([])
  }, [])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Count Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Number of UUIDs</Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {count}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={([value]) => setCount(value)}
            min={1}
            max={20}
            step={1}
          />
        </div>

        {/* Format Options */}
        <div>
          <Label className="mb-3 block">Format</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "default", label: "Standard", example: "550e8400-e29b-41d4-a716-446655440000" },
              { id: "uppercase", label: "Uppercase", example: "550E8400-E29B-41D4-A716-446655440000" },
              { id: "no-dashes", label: "No Dashes", example: "550e8400e29b41d4a716446655440000" },
            ].map(({ id, label }) => (
              <Button
                key={id}
                variant={format === id ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat(id as typeof format)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex gap-2">
          <Button onClick={generate} className="flex-1" size="lg">
            <RefreshCw className="size-4 mr-2" />
            Generate {count > 1 ? `${count} UUIDs` : "UUID"}
          </Button>
          {uuids.length > 0 && (
            <Button onClick={clear} variant="outline" size="lg">
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>

        {/* Generated UUIDs */}
        {uuids.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Generated UUIDs</Label>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                Copy All
              </Button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  <code className="flex-1 font-mono text-sm break-all">
                    {uuid}
                  </code>
                  <CopyButton value={uuid} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>UUID v4 (random) generated using the Web Crypto API.</p>
          <p>UUIDs are 128-bit identifiers that are practically unique.</p>
        </div>
      </div>
    </ToolWrapper>
  )
}
