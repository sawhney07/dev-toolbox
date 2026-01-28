"use client"

import { useState, useCallback } from "react"
import { ArrowDownUp } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tool = getToolById("html-entity")!

// HTML entity mappings
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
  " ": "&nbsp;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "¢": "&cent;",
  "§": "&sect;",
  "°": "&deg;",
  "±": "&plusmn;",
  "×": "&times;",
  "÷": "&divide;",
  "¶": "&para;",
  "•": "&bull;",
  "…": "&hellip;",
  "–": "&ndash;",
  "—": "&mdash;",
  "\u2018": "&lsquo;",
  "\u2019": "&rsquo;",
  "\u201C": "&ldquo;",
  "\u201D": "&rdquo;",
  "«": "&laquo;",
  "»": "&raquo;",
  "←": "&larr;",
  "→": "&rarr;",
  "↑": "&uarr;",
  "↓": "&darr;",
  "♠": "&spades;",
  "♣": "&clubs;",
  "♥": "&hearts;",
  "♦": "&diams;",
}

// Reverse mapping for decoding
const ENTITY_TO_CHAR: Record<string, string> = Object.fromEntries(
  Object.entries(HTML_ENTITIES).map(([char, entity]) => [entity, char])
)

function encodeHTML(text: string, encodeAll: boolean): string {
  if (encodeAll) {
    // Encode all characters to numeric entities
    return text
      .split("")
      .map((char) => `&#${char.charCodeAt(0)};`)
      .join("")
  }
  
  // Encode only special characters
  return text.replace(/[&<>"'`=\/©®™€£¥¢§°±×÷¶•…–—\u2018\u2019\u201C\u201D«»←→↑↓♠♣♥♦]/g, (char) => {
    return HTML_ENTITIES[char] || `&#${char.charCodeAt(0)};`
  })
}

function decodeHTML(text: string): string {
  // First handle named entities
  let decoded = text
  for (const [entity, char] of Object.entries(ENTITY_TO_CHAR)) {
    decoded = decoded.split(entity).join(char)
  }
  
  // Handle numeric entities (decimal)
  decoded = decoded.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 10))
  })
  
  // Handle numeric entities (hex)
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 16))
  })
  
  return decoded
}

export default function HtmlEntityPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [encodeAll, setEncodeAll] = useState(false)

  const handleConvert = useCallback(() => {
    if (!input) {
      setOutput("")
      return
    }
    
    if (mode === "encode") {
      setOutput(encodeHTML(input, encodeAll))
    } else {
      setOutput(decodeHTML(input))
    }
  }, [input, mode, encodeAll])

  const swapInputOutput = () => {
    setInput(output)
    setOutput("")
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Mode Selection */}
        <Tabs value={mode} onValueChange={(v) => { setMode(v as typeof mode); setOutput("") }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Options (only for encode) */}
        {mode === "encode" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="encodeAll"
              checked={encodeAll}
              onChange={(e) => setEncodeAll(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="encodeAll" className="text-sm">
              Encode all characters (numeric entities)
            </label>
          </div>
        )}

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "Text / HTML to Encode" : "HTML Entities to Decode"}
            </label>
          </div>
          <Textarea
            placeholder={mode === "encode" 
              ? '<div class="test">Hello & Welcome!</div>' 
              : '&lt;div class=&quot;test&quot;&gt;Hello &amp; Welcome!&lt;/div&gt;'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-sm min-h-[150px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleConvert} className="flex-1">
            {mode === "encode" ? "Encode HTML Entities" : "Decode HTML Entities"}
          </Button>
          <Button variant="outline" onClick={swapInputOutput} disabled={!output}>
            <ArrowDownUp className="size-4" />
          </Button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "Encoded Output" : "Decoded Output"}
            </label>
            <CopyButton value={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder={mode === "encode" 
              ? "Encoded HTML will appear here..." 
              : "Decoded text will appear here..."
            }
            className="font-mono text-sm min-h-[150px] bg-muted"
          />
        </div>

        {/* Reference */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Common HTML Entities:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <span>&amp; → &amp;amp;</span>
            <span>&lt; → &amp;lt;</span>
            <span>&gt; → &amp;gt;</span>
            <span>&quot; → &amp;quot;</span>
            <span>&apos; → &amp;#39;</span>
            <span>&nbsp; → &amp;nbsp;</span>
            <span>© → &amp;copy;</span>
            <span>® → &amp;reg;</span>
          </div>
        </div>
      </div>
    </ToolWrapper>
  )
}
