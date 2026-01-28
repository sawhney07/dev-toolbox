"use client"

import { useState, useCallback } from "react"
import { RefreshCw } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const tool = getToolById("lorem-ipsum")!

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit",
  "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi",
  "nesciunt", "neque", "porro", "quisquam", "nihil", "numquam", "corporis",
  "suscipit", "laboriosam", "eius", "modi", "tempora", "quaerat", "maxime",
]

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]
}

function generateSentence(wordCount: number = 10): string {
  const words = Array.from({ length: wordCount }, randomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(" ") + "."
}

function generateParagraph(sentenceCount: number = 5): string {
  return Array.from({ length: sentenceCount }, () =>
    generateSentence(Math.floor(Math.random() * 10) + 5)
  ).join(" ")
}

export default function LoremIpsumPage() {
  const [output, setOutput] = useState("")
  const [count, setCount] = useState(3)
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs")
  const [startWithLorem, setStartWithLorem] = useState(true)

  const generate = useCallback(() => {
    let result = ""

    switch (type) {
      case "paragraphs":
        result = Array.from({ length: count }, () => generateParagraph()).join("\n\n")
        break
      case "sentences":
        result = Array.from({ length: count }, () =>
          generateSentence(Math.floor(Math.random() * 10) + 5)
        ).join(" ")
        break
      case "words":
        result = Array.from({ length: count }, randomWord).join(" ")
        result = result.charAt(0).toUpperCase() + result.slice(1) + "."
        break
    }

    if (startWithLorem) {
      const loremStart = "Lorem ipsum dolor sit amet"
      if (type === "words" && count < 5) {
        result = loremStart.split(" ").slice(0, count).join(" ") + "."
      } else {
        result = loremStart + ", " + result.charAt(0).toLowerCase() + result.slice(1)
      }
    }

    setOutput(result)
  }, [count, type, startWithLorem])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Type Selection */}
        <div>
          <Label className="mb-3 block">Generate</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "paragraphs", label: "Paragraphs" },
              { id: "sentences", label: "Sentences" },
              { id: "words", label: "Words" },
            ].map(({ id, label }) => (
              <Button
                key={id}
                variant={type === id ? "default" : "outline"}
                size="sm"
                onClick={() => setType(id as typeof type)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Count Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Count</Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {count} {type}
            </span>
          </div>
          <Slider
            value={[count]}
            onValueChange={([value]) => setCount(value)}
            min={1}
            max={type === "words" ? 100 : type === "sentences" ? 20 : 10}
            step={1}
          />
        </div>

        {/* Options */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="startWithLorem"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="rounded border-input"
          />
          <label htmlFor="startWithLorem" className="text-sm cursor-pointer">
            Start with "Lorem ipsum..."
          </label>
        </div>

        {/* Generate Button */}
        <Button onClick={generate} className="w-full" size="lg">
          <RefreshCw className="size-4 mr-2" />
          Generate Lorem Ipsum
        </Button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Generated Text</Label>
              <CopyButton value={output} />
            </div>
            <div className="p-4 bg-muted rounded-lg text-sm max-h-[400px] overflow-auto whitespace-pre-wrap">
              {output}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {output.split(/\s+/).length} words, {output.length} characters
            </p>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
