"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("text-cleaner")!

export default function TextCleanerPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const { toast } = useToast()

  // Whitespace options
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true)
  const [removeExtraNewlines, setRemoveExtraNewlines] = useState(false)
  const [removeTabs, setRemoveTabs] = useState(false)
  const [trimLines, setTrimLines] = useState(false)
  
  // Character options
  const [removeNumbers, setRemoveNumbers] = useState(false)
  const [removePunctuation, setRemovePunctuation] = useState(false)
  const [removeSpecialChars, setRemoveSpecialChars] = useState(false)
  const [removeEmojis, setRemoveEmojis] = useState(false)
  
  // Custom removal options
  const [customInput, setCustomInput] = useState("")
  const [customMode, setCustomMode] = useState<"characters" | "words" | "sentences">("characters")

  const cleanText = () => {
    let result = input

    // Whitespace cleaning
    if (removeExtraSpaces) {
      result = result.replace(/ {2,}/g, " ") // Multiple spaces to single space
    }
    if (removeExtraNewlines) {
      result = result.replace(/\n{3,}/g, "\n\n") // Multiple newlines to double newline
    }
    if (removeTabs) {
      result = result.replace(/\t/g, " ") // Tabs to spaces
    }
    if (trimLines) {
      result = result.split("\n").map(line => line.trim()).join("\n")
    }

    // Character cleaning
    if (removeNumbers) {
      result = result.replace(/\d/g, "")
    }
    if (removePunctuation) {
      result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    }
    if (removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s.,!?]/g, "")
    }
    if (removeEmojis) {
      result = result.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    }

    // Custom character removal
    if (customInput.trim()) {
      if (customMode === "characters") {
        // Remove individual characters
        const charsToRemove = customInput.split("").map(char => 
          char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex special characters
        ).join("|")
        const regex = new RegExp(charsToRemove, "g")
        result = result.replace(regex, "")
      } else if (customMode === "words") {
        // Remove specific words (comma-separated list)
        const words = customInput.split(",").map(w => w.trim()).filter(w => w)
        for (const word of words) {
          const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`\\b${escapedWord}\\b`, "gi")
          result = result.replace(regex, "")
        }
      } else if (customMode === "sentences") {
        // Remove specific sentences (comma-separated list)
        const sentences = customInput.split(",").map(s => s.trim()).filter(s => s)
        for (const sentence of sentences) {
          const escapedSentence = sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(escapedSentence, "gi")
          result = result.replace(regex, "")
        }
      }
    }

    setOutput(result.trim())
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Cleaned text copied to clipboard",
    })
  }

  const handleReset = () => {
    setInput("")
    setOutput("")
    setRemoveExtraSpaces(true)
    setRemoveExtraNewlines(false)
    setRemoveTabs(false)
    setTrimLines(false)
    setRemoveNumbers(false)
    setRemovePunctuation(false)
    setRemoveSpecialChars(false)
    setRemoveEmojis(false)
    setCustomInput("")
    setCustomMode("characters")
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Options */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="whitespace">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="whitespace">Whitespace</TabsTrigger>
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              <TabsContent value="whitespace" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extra-spaces"
                      checked={removeExtraSpaces}
                      onCheckedChange={(checked) => setRemoveExtraSpaces(checked as boolean)}
                    />
                    <Label htmlFor="extra-spaces" className="cursor-pointer">
                      Remove extra spaces
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="extra-newlines"
                      checked={removeExtraNewlines}
                      onCheckedChange={(checked) => setRemoveExtraNewlines(checked as boolean)}
                    />
                    <Label htmlFor="extra-newlines" className="cursor-pointer">
                      Remove extra newlines
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tabs"
                      checked={removeTabs}
                      onCheckedChange={(checked) => setRemoveTabs(checked as boolean)}
                    />
                    <Label htmlFor="tabs" className="cursor-pointer">
                      Remove tabs
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trim-lines"
                      checked={trimLines}
                      onCheckedChange={(checked) => setTrimLines(checked as boolean)}
                    />
                    <Label htmlFor="trim-lines" className="cursor-pointer">
                      Trim line whitespace
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="characters" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="numbers"
                      checked={removeNumbers}
                      onCheckedChange={(checked) => setRemoveNumbers(checked as boolean)}
                    />
                    <Label htmlFor="numbers" className="cursor-pointer">
                      Remove numbers
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="punctuation"
                      checked={removePunctuation}
                      onCheckedChange={(checked) => setRemovePunctuation(checked as boolean)}
                    />
                    <Label htmlFor="punctuation" className="cursor-pointer">
                      Remove punctuation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="special"
                      checked={removeSpecialChars}
                      onCheckedChange={(checked) => setRemoveSpecialChars(checked as boolean)}
                    />
                    <Label htmlFor="special" className="cursor-pointer">
                      Remove special characters
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emojis"
                      checked={removeEmojis}
                      onCheckedChange={(checked) => setRemoveEmojis(checked as boolean)}
                    />
                    <Label htmlFor="emojis" className="cursor-pointer">
                      Remove emojis
                    </Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="custom" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-3 block">Custom Removal Mode</Label>
                    <RadioGroup value={customMode} onValueChange={(v) => setCustomMode(v as any)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="characters" id="mode-characters" />
                        <Label htmlFor="mode-characters" className="cursor-pointer">
                          Remove Characters
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="words" id="mode-words" />
                        <Label htmlFor="mode-words" className="cursor-pointer">
                          Remove Words (comma-separated)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sentences" id="mode-sentences" />
                        <Label htmlFor="mode-sentences" className="cursor-pointer">
                          Remove Sentences (comma-separated)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="custom-input">
                      {customMode === "characters" && "Characters to Remove"}
                      {customMode === "words" && "Words to Remove"}
                      {customMode === "sentences" && "Sentences to Remove"}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      {customMode === "characters" && "Enter any characters you want to remove (e.g., @#$%)"}
                      {customMode === "words" && "Enter words separated by commas (e.g., the, and, but)"}
                      {customMode === "sentences" && "Enter sentences separated by commas (e.g., Hello world, This is a test)"}
                    </p>
                    {customMode === "characters" ? (
                      <Input
                        id="custom-input"
                        placeholder="e.g., @#$%&*"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="font-mono"
                      />
                    ) : (
                      <Textarea
                        id="custom-input"
                        placeholder={
                          customMode === "words" 
                            ? "e.g., the, and, but, or" 
                            : "e.g., Hello world, This is a test, Remove this"
                        }
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        className="min-h-[80px] font-mono text-sm"
                      />
                    )}
                    {customInput && (
                      <div className="mt-2 p-3 bg-muted rounded-md">
                        <p className="text-sm font-medium mb-1">Will remove:</p>
                        <div className="text-xs space-y-1">
                          {customMode === "characters" ? (
                            <code className="text-xs">
                              {customInput.split("").join(", ")}
                            </code>
                          ) : (
                            customInput.split(",").map((item, idx) => (
                              <div key={idx}>
                                <code className="bg-background px-2 py-0.5 rounded">
                                  {item.trim()}
                                </code>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
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
            placeholder="Paste your text here to clean..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={cleanText} className="flex-1">
            Clean Text
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="output-text">Cleaned Text</Label>
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
              Original: {input.length} characters → Cleaned: {output.length} characters
            </p>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
