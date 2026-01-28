"use client"

import { useState, useCallback } from "react"
import { Dices, Copy, Check, Plus, Trash2 } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const tool = getToolById("random-number")!

function generateRandomNumber(min: number, max: number, isInteger: boolean): number {
  const random = Math.random() * (max - min) + min
  return isInteger ? Math.floor(random) : Number(random.toFixed(4))
}

export default function RandomNumberPage() {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [count, setCount] = useState(1)
  const [isInteger, setIsInteger] = useState(true)
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [results, setResults] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    if (min >= max) {
      setResults([])
      return
    }

    const numbers: number[] = []
    const maxUniqueCount = isInteger ? max - min + 1 : Infinity
    const targetCount = allowDuplicates ? count : Math.min(count, maxUniqueCount)

    while (numbers.length < targetCount) {
      const num = generateRandomNumber(min, max, isInteger)
      if (allowDuplicates || !numbers.includes(num)) {
        numbers.push(num)
      }
    }

    setResults(numbers)
  }, [min, max, count, isInteger, allowDuplicates])

  const copyAll = () => {
    navigator.clipboard.writeText(results.join(", "))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Range Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min" className="mb-2 block">Minimum</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="font-mono"
            />
          </div>
          <div>
            <Label htmlFor="max" className="mb-2 block">Maximum</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="font-mono"
            />
          </div>
        </div>

        {/* Count Input */}
        <div>
          <Label htmlFor="count" className="mb-2 block">How many numbers?</Label>
          <Input
            id="count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value))))}
            className="font-mono"
          />
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="integer">Integer only</Label>
            <Switch
              id="integer"
              checked={isInteger}
              onCheckedChange={setIsInteger}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="duplicates">Allow duplicates</Label>
            <Switch
              id="duplicates"
              checked={allowDuplicates}
              onCheckedChange={setAllowDuplicates}
            />
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generate} className="w-full" size="lg">
          <Dices className="size-4 mr-2" />
          Generate Random Number{count > 1 ? "s" : ""}
        </Button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Results</Label>
              <Button variant="ghost" size="sm" onClick={copyAll}>
                {copied ? (
                  <Check className="size-4 mr-1" />
                ) : (
                  <Copy className="size-4 mr-1" />
                )}
                Copy all
              </Button>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              {results.length <= 10 ? (
                <div className="flex flex-wrap gap-2">
                  {results.map((num, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-background rounded-md font-mono text-lg font-semibold"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="font-mono text-sm break-all">
                  {results.join(", ")}
                </div>
              )}
            </div>
            {results.length > 1 && (
              <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg text-sm">
                <div>
                  <span className="text-muted-foreground">Sum:</span>
                  <span className="ml-2 font-mono font-medium">
                    {results.reduce((a, b) => a + b, 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg:</span>
                  <span className="ml-2 font-mono font-medium">
                    {(results.reduce((a, b) => a + b, 0) / results.length).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Count:</span>
                  <span className="ml-2 font-mono font-medium">{results.length}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
