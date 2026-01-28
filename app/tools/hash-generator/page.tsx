"use client"

import { useState, useCallback, useEffect } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const tool = getToolById("hash-generator")!

async function generateHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<Record<string, string>>({})
  const [isHashing, setIsHashing] = useState(false)

  const computeHashes = useCallback(async (text: string) => {
    if (!text) {
      setHashes({})
      return
    }

    setIsHashing(true)
    try {
      const algorithms = [
        { name: "SHA-1", id: "SHA-1" },
        { name: "SHA-256", id: "SHA-256" },
        { name: "SHA-384", id: "SHA-384" },
        { name: "SHA-512", id: "SHA-512" },
      ]

      const results: Record<string, string> = {}
      for (const algo of algorithms) {
        results[algo.name] = await generateHash(text, algo.id)
      }
      setHashes(results)
    } catch (e) {
      console.error("Hashing error:", e)
    } finally {
      setIsHashing(false)
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => computeHashes(input), 300)
    return () => clearTimeout(debounce)
  }, [input, computeHashes])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <Label htmlFor="input" className="mb-2 block">Input Text</Label>
          <Textarea
            id="input"
            placeholder="Enter text to hash..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-sm min-h-[120px]"
          />
        </div>

        {/* Hash Outputs */}
        <div className="space-y-4">
          {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((algo) => (
            <div key={algo}>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">{algo}</Label>
                <CopyButton value={hashes[algo] || ""} />
              </div>
              <div className="relative">
                <pre className="p-3 rounded-lg bg-muted text-sm font-mono break-all min-h-[44px] flex items-center">
                  {isHashing ? (
                    <span className="text-muted-foreground">Computing...</span>
                  ) : hashes[algo] ? (
                    hashes[algo]
                  ) : (
                    <span className="text-muted-foreground">Hash will appear here...</span>
                  )}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Note: MD5 is not available in the Web Crypto API due to security concerns.</p>
          <p>SHA-256 is recommended for most use cases.</p>
        </div>
      </div>
    </ToolWrapper>
  )
}
