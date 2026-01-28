"use client"

import { useState, useCallback } from "react"
import { RefreshCw } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const tool = getToolById("coin-flip")!

export default function CoinFlipPage() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [history, setHistory] = useState<Array<"heads" | "tails">>([])

  const flip = useCallback(() => {
    setIsFlipping(true)
    
    // Simulate flip animation
    const flipDuration = 1000
    const flipInterval = 100
    let flips = 0
    const maxFlips = flipDuration / flipInterval

    const interval = setInterval(() => {
      setResult(Math.random() > 0.5 ? "heads" : "tails")
      flips++
      
      if (flips >= maxFlips) {
        clearInterval(interval)
        const finalResult = Math.random() > 0.5 ? "heads" : "tails"
        setResult(finalResult)
        setHistory(prev => [finalResult, ...prev].slice(0, 20))
        setIsFlipping(false)
      }
    }, flipInterval)
  }, [])

  const clearHistory = () => {
    setHistory([])
    setResult(null)
  }

  const headsCount = history.filter(h => h === "heads").length
  const tailsCount = history.filter(h => h === "tails").length

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-8">
        {/* Coin Display */}
        <div className="flex flex-col items-center justify-center py-8">
          <div
            className={`
              w-40 h-40 rounded-full flex items-center justify-center
              text-4xl font-bold transition-all duration-200
              ${isFlipping ? "animate-pulse scale-110" : ""}
              ${result === "heads" 
                ? "bg-amber-500/20 text-amber-500 border-4 border-amber-500" 
                : result === "tails"
                ? "bg-slate-500/20 text-slate-400 border-4 border-slate-400"
                : "bg-muted border-4 border-border text-muted-foreground"
              }
            `}
          >
            {result ? (
              <span className="capitalize">{result === "heads" ? "H" : "T"}</span>
            ) : (
              <span className="text-2xl">?</span>
            )}
          </div>
          
          {result && !isFlipping && (
            <p className="mt-4 text-2xl font-semibold capitalize">{result}</p>
          )}
        </div>

        {/* Flip Button */}
        <Button 
          onClick={flip} 
          className="w-full" 
          size="lg"
          disabled={isFlipping}
        >
          <RefreshCw className={`size-4 mr-2 ${isFlipping ? "animate-spin" : ""}`} />
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </Button>

        {/* Statistics */}
        {history.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Statistics</Label>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Clear
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                <p className="text-3xl font-bold text-amber-500">{headsCount}</p>
                <p className="text-sm text-muted-foreground">Heads</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {history.length > 0 ? ((headsCount / history.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <div className="p-4 bg-slate-500/10 rounded-lg text-center">
                <p className="text-3xl font-bold text-slate-400">{tailsCount}</p>
                <p className="text-sm text-muted-foreground">Tails</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {history.length > 0 ? ((tailsCount / history.length) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>

            {/* History */}
            <div>
              <Label className="mb-2 block text-sm">Recent Flips</Label>
              <div className="flex flex-wrap gap-2">
                {history.map((h, i) => (
                  <span
                    key={i}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${h === "heads" 
                        ? "bg-amber-500/20 text-amber-500" 
                        : "bg-slate-500/20 text-slate-400"
                      }
                    `}
                  >
                    {h === "heads" ? "H" : "T"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
