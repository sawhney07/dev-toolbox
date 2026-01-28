"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("text-summarizer")!

export default function TextSummarizerPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [summaryLength, setSummaryLength] = useState([3]) // Number of sentences
  const { toast } = useToast()

  const summarizeText = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    // Split into sentences (simple split on period, question mark, exclamation)
    const sentences = input
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)

    if (sentences.length === 0) {
      setOutput("No complete sentences found.")
      return
    }

    // If requested length is greater than available sentences
    const numSentences = Math.min(summaryLength[0], sentences.length)

    // Score sentences based on word frequency (extractive summarization)
    const words = input.toLowerCase().match(/\b\w+\b/g) || []
    const wordFreq: Record<string, number> = {}
    
    // Build frequency map (excluding common stop words)
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
      'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
      'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
      'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
      'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
      'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
      'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
      'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
      'were', 'said', 'did', 'having', 'may', 'should'
    ])

    for (const word of words) {
      if (!stopWords.has(word) && word.length > 2) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    }

    // Score each sentence
    const scoredSentences = sentences.map((sentence, index) => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || []
      let score = 0
      
      for (const word of sentenceWords) {
        score += wordFreq[word] || 0
      }
      
      // Normalize by sentence length to avoid bias toward long sentences
      score = sentenceWords.length > 0 ? score / sentenceWords.length : 0
      
      // Bonus for position (first sentences often important)
      if (index < 3) {
        score *= 1.5
      }
      
      return { sentence, score, index }
    })

    // Sort by score and take top N
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentences)
      .sort((a, b) => a.index - b.index) // Restore original order
      .map(s => s.sentence)

    setOutput(topSentences.join(". ") + ".")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard",
    })
  }

  const sentenceCount = input.split(/[.!?]+/).filter(s => s.trim().length > 0).length

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Options */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Summary Length: {summaryLength[0]} sentence{summaryLength[0] !== 1 ? 's' : ''}</Label>
                  <span className="text-sm text-muted-foreground">
                    {sentenceCount > 0 && `(Original has ${sentenceCount} sentences)`}
                  </span>
                </div>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This tool uses extractive summarization to identify and extract the most important sentences based on word frequency analysis.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <div>
          <Label htmlFor="input-text" className="mb-2 block">
            Input Text
          </Label>
          <Textarea
            id="input-text"
            placeholder="Paste your article or text here to summarize..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[250px] text-sm"
          />
        </div>

        {/* Action Button */}
        <Button onClick={summarizeText} className="w-full">
          <Sparkles className="w-4 h-4 mr-2" />
          Summarize Text
        </Button>

        {/* Output */}
        {output && (
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Summary</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{output}</p>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original Length</p>
                      <p className="font-semibold">{input.split(/\s+/).length} words</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Summary Length</p>
                      <p className="font-semibold">{output.split(/\s+/).length} words</p>
                    </div>
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
