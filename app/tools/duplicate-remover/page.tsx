"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("duplicate-remover")!

export default function DuplicateRemoverPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"lines" | "words">("lines")
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [keepFirst, setKeepFirst] = useState(true)
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0)
  const { toast } = useToast()

  const removeDuplicates = () => {
    if (!input.trim()) {
      setOutput("")
      setDuplicatesRemoved(0)
      return
    }

    let items: string[]
    
    if (mode === "lines") {
      items = input.split("\n")
    } else {
      items = input.split(/\s+/)
    }

    const originalCount = items.length
    const seen = new Set<string>()
    const unique: string[] = []

    for (const item of items) {
      const key = caseSensitive ? item : item.toLowerCase()
      
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(item)
      } else if (!keepFirst) {
        // If not keeping first, update to latest occurrence
        const index = unique.findIndex(u => 
          caseSensitive ? u === item : u.toLowerCase() === item.toLowerCase()
        )
        if (index !== -1) {
          unique[index] = item
        }
      }
    }

    const removed = originalCount - unique.length
    setDuplicatesRemoved(removed)
    setOutput(mode === "lines" ? unique.join("\n") : unique.join(" "))
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Unique items copied to clipboard",
    })
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Options */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={mode} onValueChange={(v) => setMode(v as "lines" | "words")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lines">Remove Duplicate Lines</TabsTrigger>
                <TabsTrigger value="words">Remove Duplicate Words</TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="case-sensitive"
                    checked={caseSensitive}
                    onCheckedChange={(checked) => setCaseSensitive(checked as boolean)}
                  />
                  <Label htmlFor="case-sensitive" className="cursor-pointer">
                    Case sensitive comparison
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keep-first"
                    checked={keepFirst}
                    onCheckedChange={(checked) => setKeepFirst(checked as boolean)}
                  />
                  <Label htmlFor="keep-first" className="cursor-pointer">
                    Keep first occurrence (uncheck to keep last)
                  </Label>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Input */}
        <div>
          <Label htmlFor="input-text" className="mb-2 block">
            Input Text
          </Label>
          <Textarea
            id="input-text"
            placeholder={mode === "lines" ? "Enter text with one item per line..." : "Enter words separated by spaces..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Action Button */}
        <Button onClick={removeDuplicates} className="w-full">
          Remove Duplicates
        </Button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="output-text">Unique Items</Label>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              id="output-text"
              value={output}
              readOnly
              className="min-h-[200px] font-mono text-sm bg-muted"
            />
            
            {/* Stats */}
            <Card className="mt-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">
                      {duplicatesRemoved === 0 ? "No duplicates found" : `Removed ${duplicatesRemoved} duplicate ${mode}`}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      Original: {mode === "lines" ? input.split("\n").length : input.split(/\s+/).length} {mode} → 
                      Unique: {mode === "lines" ? output.split("\n").filter(l => l).length : output.split(/\s+/).filter(w => w).length} {mode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
