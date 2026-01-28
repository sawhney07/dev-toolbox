"use client"

import { useState, useCallback } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, OutputArea } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tool = getToolById("base64")!

export default function Base64Page() {
  const [text, setText] = useState("")
  const [encoded, setEncoded] = useState("")
  const [decodeInput, setDecodeInput] = useState("")
  const [decoded, setDecoded] = useState("")
  const [encodeError, setEncodeError] = useState("")
  const [decodeError, setDecodeError] = useState("")

  const encode = useCallback(() => {
    if (!text) {
      setEncoded("")
      return
    }
    try {
      setEncoded(btoa(unescape(encodeURIComponent(text))))
      setEncodeError("")
    } catch (e) {
      setEncodeError("Failed to encode text")
    }
  }, [text])

  const decode = useCallback(() => {
    if (!decodeInput) {
      setDecoded("")
      return
    }
    try {
      setDecoded(decodeURIComponent(escape(atob(decodeInput))))
      setDecodeError("")
    } catch (e) {
      setDecodeError("Invalid Base64 string")
    }
  }, [decodeInput])

  return (
    <ToolWrapper tool={tool}>
      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Plain Text</label>
            <Textarea
              placeholder="Enter text to encode..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <Button onClick={encode} className="w-full">
            <ArrowDown className="size-4 mr-2" />
            Encode to Base64
          </Button>

          {encodeError && (
            <p className="text-sm text-destructive">{encodeError}</p>
          )}

          <OutputArea label="Base64 Encoded" value={encoded} />
        </TabsContent>

        <TabsContent value="decode" className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Base64 String</label>
            <Textarea
              placeholder="Enter Base64 string to decode..."
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              className="font-mono text-sm min-h-[120px]"
            />
          </div>

          <Button onClick={decode} className="w-full">
            <ArrowUp className="size-4 mr-2" />
            Decode from Base64
          </Button>

          {decodeError && (
            <p className="text-sm text-destructive">{decodeError}</p>
          )}

          <OutputArea label="Decoded Text" value={decoded} />
        </TabsContent>
      </Tabs>
    </ToolWrapper>
  )
}
