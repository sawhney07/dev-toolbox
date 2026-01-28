"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, ArrowDownAZ, ArrowUpAZ } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("text-sorter")!

export default function TextSorterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [sortMode, setSortMode] = useState<"words" | "lines">("lines")
  const [sortType, setSortType] = useState<"alphabetical" | "reverse" | "length">("alphabetical")
  const { toast } = useToast()

  const sortText = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    let items: string[]
    
    if (sortMode === "lines") {
      items = input.split("\n").filter(line => line.trim())
    } else {
      items = input.split(/\s+/).filter(word => word.trim())
    }

    let sorted: string[]
    
    switch (sortType) {
      case "alphabetical":
        sorted = [...items].sort((a, b) => a.localeCompare(b))
        break
      case "reverse":
        sorted = [...items].sort((a, b) => b.localeCompare(a))
        break
      case "length":
        sorted = [...items].sort((a, b) => a.length - b.length || a.localeCompare(b))
        break
      default:
        sorted = items
    }

    setOutput(sortMode === "lines" ? sorted.join("\n") : sorted.join(" "))
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Sorted text copied to clipboard",
    })
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Options */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={sortMode} onValueChange={(v) => setSortMode(v as "words" | "lines")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lines">Sort Lines</TabsTrigger>
                <TabsTrigger value="words">Sort Words</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <Label className="mb-3 block">Sort Order</Label>
                <RadioGroup value={sortType} onValueChange={(v) => setSortType(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alphabetical" id="alphabetical" />
                    <Label htmlFor="alphabetical" className="cursor-pointer flex items-center">
                      <ArrowDownAZ className="w-4 h-4 mr-2" />
                      Alphabetical (A-Z)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reverse" id="reverse" />
                    <Label htmlFor="reverse" className="cursor-pointer flex items-center">
                      <ArrowUpAZ className="w-4 h-4 mr-2" />
                      Reverse Alphabetical (Z-A)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="length" id="length" />
                    <Label htmlFor="length" className="cursor-pointer">
                      By Length (shortest to longest)
                    </Label>
                  </div>
                </RadioGroup>
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
            placeholder={sortMode === "lines" ? "Enter text with one item per line..." : "Enter words separated by spaces..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Action Button */}
        <Button onClick={sortText} className="w-full">
          Sort Text
        </Button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="output-text">Sorted Text</Label>
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
            <p className="text-sm text-muted-foreground mt-2">
              Sorted {sortMode === "lines" ? output.split("\n").length : output.split(/\s+/).length} {sortMode}
            </p>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
