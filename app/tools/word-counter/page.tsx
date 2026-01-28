"use client"

import { useState, useMemo } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const tool = getToolById("word-counter")!

export default function WordCounterPage() {
  const [text, setText] = useState("")

  const stats = useMemo(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0
    const paragraphs = text.trim() ? text.split(/\n\n+/).filter((p) => p.trim()).length : 0
    const lines = text.trim() ? text.split(/\n/).length : 0
    
    // Reading time (average 200 words per minute)
    const readingTimeMinutes = Math.ceil(words / 200)
    
    // Speaking time (average 150 words per minute)
    const speakingTimeMinutes = Math.ceil(words / 150)

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes,
      speakingTimeMinutes,
    }
  }, [text])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <Textarea
            placeholder="Start typing or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[200px] text-base"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stats.words}</p>
              <p className="text-sm text-muted-foreground">Words</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stats.characters}</p>
              <p className="text-sm text-muted-foreground">Characters</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stats.charactersNoSpaces}</p>
              <p className="text-sm text-muted-foreground">No Spaces</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{stats.sentences}</p>
              <p className="text-sm text-muted-foreground">Sentences</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold">{stats.paragraphs}</p>
              <p className="text-sm text-muted-foreground">Paragraphs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold">{stats.lines}</p>
              <p className="text-sm text-muted-foreground">Lines</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold">{stats.readingTimeMinutes} min</p>
              <p className="text-sm text-muted-foreground">Reading Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold">{stats.speakingTimeMinutes} min</p>
              <p className="text-sm text-muted-foreground">Speaking Time</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolWrapper>
  )
}
