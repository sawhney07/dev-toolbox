"use client"

import { useState, useEffect, useRef } from "react"
import { Download } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const tool = getToolById("qr-generator")!

// Simple QR code generator using a free API
function getQRCodeUrl(text: string, size: number): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`
}

export default function QrGeneratorPage() {
  const [input, setInput] = useState("")
  const [size, setSize] = useState(256)
  const [qrUrl, setQrUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!input.trim()) {
      setQrUrl("")
      return
    }

    const timeout = setTimeout(() => {
      setIsLoading(true)
      setQrUrl(getQRCodeUrl(input, size))
    }, 500)

    return () => clearTimeout(timeout)
  }, [input, size])

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const downloadQR = async () => {
    if (!qrUrl) return
    
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `qrcode-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download QR code:", error)
    }
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <Label htmlFor="input" className="mb-2 block">Text or URL</Label>
          <Input
            id="input"
            placeholder="Enter text or URL to encode..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="text-base"
          />
        </div>

        {/* Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Size</Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {size}x{size}
            </span>
          </div>
          <Slider
            value={[size]}
            onValueChange={([value]) => setSize(value)}
            min={128}
            max={512}
            step={64}
          />
        </div>

        {/* QR Code Preview */}
        <div className="flex flex-col items-center gap-4 p-6 bg-muted rounded-lg">
          {qrUrl ? (
            <>
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={qrUrl || "/placeholder.svg"}
                  alt="Generated QR Code"
                  width={size}
                  height={size}
                  onLoad={handleImageLoad}
                  className={`transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}
                  crossOrigin="anonymous"
                />
              </div>
              <Button onClick={downloadQR} variant="outline">
                <Download className="size-4 mr-2" />
                Download PNG
              </Button>
            </>
          ) : (
            <div
              className="flex items-center justify-center bg-background rounded-lg border-2 border-dashed"
              style={{ width: size, height: size }}
            >
              <p className="text-muted-foreground text-sm text-center px-4">
                Enter text above to generate a QR code
              </p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>QR codes can store URLs, text, contact info, and more.</p>
          <p>Maximum recommended content length is 2953 characters.</p>
        </div>
      </div>
    </ToolWrapper>
  )
}
