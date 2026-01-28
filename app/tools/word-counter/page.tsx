"use client"

import { useState, useMemo } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

    // Character breakdown
    const letters = text.replace(/[^a-zA-Z]/g, "").length
    const digits = text.replace(/[^0-9]/g, "").length
    const spaces = text.replace(/[^ ]/g, "").length
    const punctuation = text.replace(/[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, "").length
    const uppercase = text.replace(/[^A-Z]/g, "").length
    const lowercase = text.replace(/[^a-z]/g, "").length
    const newlines = (text.match(/\n/g) || []).length
    const tabs = (text.match(/\t/g) || []).length
    const whitespace = spaces + newlines + tabs

    // Character frequency
    const charFrequency: Record<string, number> = {}
    for (const char of text) {
      charFrequency[char] = (charFrequency[char] || 0) + 1
    }
    const topCharacters = Object.entries(charFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([char, count]) => ({
        char: char === '\n' ? '\\n' : char === '\t' ? '\\t' : char === ' ' ? '(space)' : char,
        count,
        percentage: ((count / characters) * 100).toFixed(1)
      }))

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes,
      speakingTimeMinutes,
      letters,
      digits,
      spaces,
      punctuation,
      uppercase,
      lowercase,
      newlines,
      tabs,
      whitespace,
      topCharacters,
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

        {/* Tabs for different views */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="characters">Character Analysis</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Primary Stats Grid */}
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
          </TabsContent>

          {/* Character Analysis Tab */}
          <TabsContent value="characters" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.letters}</p>
                  <p className="text-sm text-muted-foreground">Letters</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.digits}</p>
                  <p className="text-sm text-muted-foreground">Digits</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.spaces}</p>
                  <p className="text-sm text-muted-foreground">Spaces</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stats.punctuation}</p>
                  <p className="text-sm text-muted-foreground">Punctuation</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">{stats.uppercase}</p>
                  <p className="text-sm text-muted-foreground">Uppercase</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">{stats.lowercase}</p>
                  <p className="text-sm text-muted-foreground">Lowercase</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">{stats.newlines}</p>
                  <p className="text-sm text-muted-foreground">Line Breaks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-semibold">{stats.whitespace}</p>
                  <p className="text-sm text-muted-foreground">Whitespace</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Frequency Tab */}
          <TabsContent value="frequency" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top 10 Characters</h3>
                {stats.topCharacters.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topCharacters.map(({ char, count, percentage }, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="w-8 text-sm text-muted-foreground">#{index + 1}</span>
                        <code className="w-20 px-2 py-1 bg-muted rounded text-sm font-mono text-center">
                          {char}
                        </code>
                        <div className="flex-1">
                          <div className="h-6 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-20 text-sm text-right">
                          {count} ({percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Type or paste text to see character frequency
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolWrapper>
  )
}
