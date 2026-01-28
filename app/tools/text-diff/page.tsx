"use client"

import { useState, useMemo } from "react"
import { ArrowLeftRight, Trash2 } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tool = getToolById("text-diff")!

type DiffLine = {
  type: "added" | "removed" | "unchanged" | "modified"
  leftContent?: string
  rightContent?: string
  leftLineNo?: number
  rightLineNo?: number
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n")
  const lines2 = text2.split("\n")
  
  const m = lines1.length
  const n = lines2.length
  
  // Build LCS table
  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (lines1[i - 1] === lines2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  // Backtrack to collect changes
  const rawDiff: Array<{ type: "unchanged" | "removed" | "added"; leftLine?: number; rightLine?: number; content: string }> = []
  let i = m, j = n
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      rawDiff.push({ type: "unchanged", leftLine: i, rightLine: j, content: lines1[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rawDiff.push({ type: "added", rightLine: j, content: lines2[j - 1] })
      j--
    } else if (i > 0) {
      rawDiff.push({ type: "removed", leftLine: i, content: lines1[i - 1] })
      i--
    }
  }
  
  const reversed = rawDiff.reverse()
  
  // Group consecutive removed/added blocks and pair them
  const result: DiffLine[] = []
  let idx = 0
  
  while (idx < reversed.length) {
    const current = reversed[idx]
    
    if (current.type === "removed") {
      // Collect all consecutive removals
      const removes: typeof current[] = []
      while (idx < reversed.length && reversed[idx].type === "removed") {
        removes.push(reversed[idx])
        idx++
      }
      
      // Collect all consecutive additions that follow
      const adds: typeof current[] = []
      while (idx < reversed.length && reversed[idx].type === "added") {
        adds.push(reversed[idx])
        idx++
      }
      
      // Pair them side by side
      const maxLen = Math.max(removes.length, adds.length)
      for (let k = 0; k < maxLen; k++) {
        const remove = removes[k]
        const add = adds[k]
        
        if (remove && add) {
          // Both sides have content - show as modified
          result.push({
            type: "modified",
            leftContent: remove.content,
            rightContent: add.content,
            leftLineNo: remove.leftLine,
            rightLineNo: add.rightLine,
          })
        } else if (remove) {
          // Only removed
          result.push({
            type: "removed",
            leftContent: remove.content,
            leftLineNo: remove.leftLine,
          })
        } else if (add) {
          // Only added
          result.push({
            type: "added",
            rightContent: add.content,
            rightLineNo: add.rightLine,
          })
        }
      }
    } else if (current.type === "added") {
      // Standalone addition
      result.push({
        type: "added",
        rightContent: current.content,
        rightLineNo: current.rightLine,
      })
      idx++
    } else {
      // Unchanged
      result.push({
        type: "unchanged",
        leftContent: current.content,
        rightContent: current.content,
        leftLineNo: current.leftLine,
        rightLineNo: current.rightLine,
      })
      idx++
    }
  }
  
  return result
}

function DiffView({ diff, side }: { diff: DiffLine[]; side: "left" | "right" }) {
  return (
    <div className="font-mono text-sm">
      {diff.map((line, index) => {
        const content = side === "left" ? line.leftContent : line.rightContent
        const lineNo = side === "left" ? line.leftLineNo : line.rightLineNo
        const hasContent = content !== undefined
        
        const isDifferent = line.type === "removed" || line.type === "added" || line.type === "modified"
        const showHighlight = isDifferent && hasContent

        return (
          <div
            key={index}
            className={cn(
              "flex border-b border-border/30 min-h-[22px]",
              showHighlight && side === "left" && "bg-amber-500/10 dark:bg-amber-500/15",
              showHighlight && side === "right" && "bg-blue-500/10 dark:bg-blue-500/15",
              !hasContent && "bg-muted/40"
            )}
          >
            {/* Line number */}
            <div className={cn(
              "w-8 flex-shrink-0 px-1 text-right text-muted-foreground/70 text-xs flex items-center justify-end select-none",
              showHighlight && side === "left" && "bg-amber-500/5",
              showHighlight && side === "right" && "bg-blue-500/5",
            )}>
              {hasContent && lineNo}
            </div>
            
            {/* Diff indicator */}
            <div className={cn(
              "w-5 flex-shrink-0 flex items-center justify-center text-xs font-medium select-none",
              showHighlight && side === "left" && "text-amber-700 dark:text-amber-400",
              showHighlight && side === "right" && "text-blue-700 dark:text-blue-400",
            )}>
              {showHighlight && "•"}
            </div>
            
            {/* Content */}
            <div className={cn(
              "flex-1 px-2 py-1 whitespace-pre-wrap break-words",
              !hasContent && "text-transparent"
            )}>
              {content || " "}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function TextDiffPage() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [showDiff, setShowDiff] = useState(false)

  const diff = useMemo(() => {
    if (!text1 && !text2) return []
    return computeDiff(text1, text2)
  }, [text1, text2])

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === "added").length
    const removed = diff.filter(d => d.type === "removed").length
    const unchanged = diff.filter(d => d.type === "unchanged").length
    return { added, removed, unchanged, total: diff.length }
  }, [diff])

  const swapTexts = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
    if (showDiff) setShowDiff(false)
  }

  const clearAll = () => {
    setText1("")
    setText2("")
    setShowDiff(false)
  }

  const handleCompare = () => {
    setShowDiff(true)
  }

  const hasDiff = diff.length > 0 && showDiff

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-4">
        {/* Top Actions & Stats */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={swapTexts} className="gap-2">
              <ArrowLeftRight className="size-3.5" />
              Swap
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll} className="gap-2">
              <Trash2 className="size-3.5" />
              Clear
            </Button>
          </div>
          
          {/* Stats */}
          {hasDiff && (
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                <span className="size-2 rounded-full bg-amber-500"></span>
                {stats.removed} diff
              </span>
              <span className="flex items-center gap-1 text-blue-700 dark:text-blue-400 font-medium">
                <span className="size-2 rounded-full bg-blue-500"></span>
                {stats.added} diff
              </span>
              <span className="text-muted-foreground">{stats.unchanged} unchanged</span>
            </div>
          )}
        </div>

        {/* Editor / Diff View */}
        {!hasDiff ? (
          <>
            {/* Input Mode */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Original</label>
                <Textarea
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  placeholder="Paste the original text here..."
                  className="font-mono text-sm min-h-[400px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Modified</label>
                <Textarea
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  placeholder="Paste the modified text here..."
                  className="font-mono text-sm min-h-[400px] resize-none"
                />
              </div>
            </div>

            {/* Compare Button */}
            <Button 
              onClick={handleCompare} 
              className="w-full"
              disabled={!text1 && !text2}
            >
              Compare Differences
            </Button>
          </>
        ) : (
          <>
            {/* Diff View Mode - VS Code / GitHub style */}
            <div className="grid md:grid-cols-2 border rounded-lg overflow-hidden bg-card">
              {/* Left side - Original with deletions */}
              <div className="border-r border-border">
                <div className="bg-muted/60 px-3 py-1.5 text-xs font-medium border-b border-border flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-amber-500/70"></span>
                  Original
                </div>
                <div className="max-h-[450px] overflow-auto">
                  <DiffView diff={diff} side="left" />
                </div>
              </div>
              
              {/* Right side - Modified with additions */}
              <div>
                <div className="bg-muted/60 px-3 py-1.5 text-xs font-medium border-b border-border flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-full bg-blue-500/70"></span>
                  Modified
                </div>
                <div className="max-h-[450px] overflow-auto">
                  <DiffView diff={diff} side="right" />
                </div>
              </div>
            </div>

            {/* Back to Edit Button */}
            <Button 
              variant="outline" 
              onClick={() => setShowDiff(false)} 
              className="w-full"
            >
              ← Back to Edit
            </Button>
          </>
        )}

        {/* Empty State */}
        {!hasDiff && !text1 && !text2 && (
          <p className="text-center text-muted-foreground text-sm">
            Paste text in both fields and click "Compare" to see differences
          </p>
        )}
      </div>
    </ToolWrapper>
  )
}
