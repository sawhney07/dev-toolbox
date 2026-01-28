"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const tool = getToolById("case-converter")!

const conversions = [
  {
    id: "lowercase",
    name: "lowercase",
    convert: (text: string) => text.toLowerCase(),
  },
  {
    id: "uppercase",
    name: "UPPERCASE",
    convert: (text: string) => text.toUpperCase(),
  },
  {
    id: "titlecase",
    name: "Title Case",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase()),
  },
  {
    id: "sentencecase",
    name: "Sentence case",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase()),
  },
  {
    id: "camelcase",
    name: "camelCase",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()),
  },
  {
    id: "pascalcase",
    name: "PascalCase",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, char) => char.toUpperCase()),
  },
  {
    id: "snakecase",
    name: "snake_case",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, ""),
  },
  {
    id: "kebabcase",
    name: "kebab-case",
    convert: (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
  },
  {
    id: "constantcase",
    name: "CONSTANT_CASE",
    convert: (text: string) =>
      text
        .toUpperCase()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, ""),
  },
  {
    id: "alternating",
    name: "aLtErNaTiNg",
    convert: (text: string) =>
      text
        .split("")
        .map((char, i) =>
          i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join(""),
  },
]

export default function CaseConverterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [activeCase, setActiveCase] = useState<string | null>(null)

  const handleConvert = (id: string, convert: (text: string) => string) => {
    setOutput(convert(input))
    setActiveCase(id)
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Input Text</label>
          <Textarea
            placeholder="Enter text to convert..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Conversion Buttons */}
        <div>
          <label className="text-sm font-medium mb-3 block">Convert To</label>
          <div className="flex flex-wrap gap-2">
            {conversions.map(({ id, name, convert }) => (
              <Button
                key={id}
                variant={activeCase === id ? "default" : "outline"}
                size="sm"
                onClick={() => handleConvert(id, convert)}
                disabled={!input}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Converted text will appear here..."
            className="min-h-[100px] bg-muted"
          />
        </div>
      </div>
    </ToolWrapper>
  )
}
