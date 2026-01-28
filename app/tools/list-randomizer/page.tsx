"use client"

import { useState, useCallback } from "react"
import { Shuffle, Copy, Check, Sparkles } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tool = getToolById("list-randomizer")!

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ListRandomizerPage() {
  const [input, setInput] = useState("")
  const [mode, setMode] = useState<"shuffle" | "pick">("shuffle")
  const [pickCount, setPickCount] = useState(1)
  const [results, setResults] = useState<string[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [copied, setCopied] = useState(false)

  const items = input
    .split("\n")
    .map(item => item.trim())
    .filter(item => item.length > 0)

  const handleShuffle = useCallback(() => {
    if (items.length === 0) return
    setResults(shuffleArray(items))
    setWinner(null)
  }, [items])

  const handlePick = useCallback(() => {
    if (items.length === 0) return
    const count = Math.min(pickCount, items.length)
    const shuffled = shuffleArray(items)
    setResults(shuffled.slice(0, count))
    setWinner(null)
  }, [items, pickCount])

  const handlePickWinner = useCallback(() => {
    if (items.length === 0) return
    setIsAnimating(true)
    setWinner(null)
    setResults([])

    // Animate through items
    let iterations = 0
    const maxIterations = 20
    const interval = setInterval(() => {
      setWinner(items[Math.floor(Math.random() * items.length)])
      iterations++
      
      if (iterations >= maxIterations) {
        clearInterval(interval)
        const finalWinner = items[Math.floor(Math.random() * items.length)]
        setWinner(finalWinner)
        setIsAnimating(false)
      }
    }, 100)
  }, [items])

  const copyResults = () => {
    navigator.clipboard.writeText(results.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <Label htmlFor="input" className="mb-2 block">
            Enter items (one per line)
          </Label>
          <Textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apple&#10;Banana&#10;Cherry&#10;Date&#10;..."
            rows={8}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {items.length} item{items.length !== 1 ? "s" : ""} in list
          </p>
        </div>

        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as "shuffle" | "pick")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shuffle">Shuffle List</TabsTrigger>
            <TabsTrigger value="pick">Pick Random</TabsTrigger>
          </TabsList>

          <TabsContent value="shuffle" className="mt-4">
            <Button 
              onClick={handleShuffle} 
              className="w-full" 
              size="lg"
              disabled={items.length === 0}
            >
              <Shuffle className="size-4 mr-2" />
              Shuffle List
            </Button>
          </TabsContent>

          <TabsContent value="pick" className="mt-4 space-y-4">
            <div>
              <Label htmlFor="pickCount" className="mb-2 block">
                How many to pick?
              </Label>
              <Input
                id="pickCount"
                type="number"
                min={1}
                max={items.length || 1}
                value={pickCount}
                onChange={(e) => setPickCount(Math.max(1, Number(e.target.value)))}
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={handlePick}
                disabled={items.length === 0}
                variant="outline"
              >
                <Shuffle className="size-4 mr-2" />
                Pick {pickCount}
              </Button>
              <Button 
                onClick={handlePickWinner}
                disabled={items.length === 0 || isAnimating}
              >
                <Sparkles className="size-4 mr-2" />
                Pick Winner
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Winner Display */}
        {winner && (
          <div className={`
            p-6 rounded-lg text-center transition-all
            ${isAnimating 
              ? "bg-muted animate-pulse" 
              : "bg-primary/10 border-2 border-primary"
            }
          `}>
            <p className="text-sm text-muted-foreground mb-2">
              {isAnimating ? "Selecting..." : "Winner!"}
            </p>
            <p className="text-2xl font-bold">{winner}</p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !winner && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Results</Label>
              <Button variant="ghost" size="sm" onClick={copyResults}>
                {copied ? (
                  <Check className="size-4 mr-1" />
                ) : (
                  <Copy className="size-4 mr-1" />
                )}
                Copy
              </Button>
            </div>
            <div className="space-y-1">
              {results.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-2 bg-muted rounded-md"
                >
                  <span className="text-xs text-muted-foreground font-mono w-6">
                    {index + 1}.
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
