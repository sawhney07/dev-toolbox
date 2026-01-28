"use client"

import { useState, useCallback } from "react"
import { ArrowDownUp } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tool = getToolById("url-encoder")!

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [encodeMode, setEncodeMode] = useState<"component" | "full">("component")

  const encode = useCallback(() => {
    if (!input) {
      setOutput("")
      return
    }
    try {
      if (encodeMode === "component") {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(encodeURI(input))
      }
    } catch (e) {
      setOutput("Error: Invalid input")
    }
  }, [input, encodeMode])

  const decode = useCallback(() => {
    if (!input) {
      setOutput("")
      return
    }
    try {
      if (encodeMode === "component") {
        setOutput(decodeURIComponent(input))
      } else {
        setOutput(decodeURI(input))
      }
    } catch (e) {
      setOutput("Error: Invalid encoded string")
    }
  }, [input, encodeMode])

  const handleConvert = useCallback(() => {
    if (mode === "encode") {
      encode()
    } else {
      decode()
    }
  }, [mode, encode, decode])

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

        {/* Options */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Encoding Type:</label>
          <select
            value={encodeMode}
            onChange={(e) => setEncodeMode(e.target.value as typeof encodeMode)}
            className="text-sm border rounded-md px-3 py-1.5 bg-background"
          >
            <option value="component">Component (encodeURIComponent)</option>
            <option value="full">Full URL (encodeURI)</option>
          </select>
        </div>

        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              {mode === "encode" ? "Text to Encode" : "URL-Encoded String"}
            </label>
          </div>
          <Textarea
            placeholder={mode === "encode" 
              ? "Hello World! Special chars: &?=#" 
              : "Hello%20World%21%20Special%20chars%3A%20%26%3F%3D%23"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-sm min-h-[150px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={handleConvert} className="flex-1">
            {mode === "encode" ? "Encode URL" : "Decode URL"}
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
              ? "Encoded URL will appear here..." 
              : "Decoded text will appear here..."
            }
            className="font-mono text-sm min-h-[150px] bg-muted"
          />
        </div>

        {/* Reference */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Common URL Encodings:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            <span>Space → %20</span>
            <span>! → %21</span>
            <span># → %23</span>
            <span>$ → %24</span>
            <span>& → %26</span>
            <span>? → %3F</span>
            <span>= → %3D</span>
            <span>@ → %40</span>
          </div>
        </div>
      </div>
    </ToolWrapper>
  )
}
