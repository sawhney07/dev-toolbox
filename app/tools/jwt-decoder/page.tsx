"use client"

import { useState, useCallback, useEffect } from "react"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const tool = getToolById("jwt-decoder")!

interface DecodedJWT {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function decodeBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=")
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  )
}

export default function JwtDecoderPage() {
  const [input, setInput] = useState("")
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null)
  const [error, setError] = useState("")
  const [expiryStatus, setExpiryStatus] = useState<"valid" | "expired" | "none">("none")

  const decode = useCallback((token: string) => {
    if (!token.trim()) {
      setDecoded(null)
      setError("")
      setExpiryStatus("none")
      return
    }

    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format: Expected 3 parts separated by dots")
      }

      const header = JSON.parse(decodeBase64Url(parts[0]))
      const payload = JSON.parse(decodeBase64Url(parts[1]))
      const signature = parts[2]

      setDecoded({ header, payload, signature })
      setError("")

      // Check expiry
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000)
        setExpiryStatus(expDate > new Date() ? "valid" : "expired")
      } else {
        setExpiryStatus("none")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JWT")
      setDecoded(null)
      setExpiryStatus("none")
    }
  }, [])

  useEffect(() => {
    const debounce = setTimeout(() => decode(input), 300)
    return () => clearTimeout(debounce)
  }, [input, decode])

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">JWT Token</label>
          <Textarea
            placeholder="Paste your JWT token here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="font-mono text-sm min-h-[100px]"
          />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Decoded Output */}
        {decoded && (
          <div className="space-y-4">
            {/* Status */}
            {expiryStatus !== "none" && (
              <div className="flex items-center gap-2">
                {expiryStatus === "valid" ? (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="size-3 mr-1" />
                    Token Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <Clock className="size-3 mr-1" />
                    Token Expired
                  </Badge>
                )}
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-red-500">Header</label>
                <CopyButton value={JSON.stringify(decoded.header, null, 2)} />
              </div>
              <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto font-mono">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-primary">Payload</label>
                <CopyButton value={JSON.stringify(decoded.payload, null, 2)} />
              </div>
              <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto font-mono">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
              
              {/* Common claims */}
              {(decoded.payload.exp || decoded.payload.iat || decoded.payload.nbf) && (
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {decoded.payload.iat && (
                    <p>Issued at: {formatTimestamp(decoded.payload.iat as number)}</p>
                  )}
                  {decoded.payload.exp && (
                    <p>Expires: {formatTimestamp(decoded.payload.exp as number)}</p>
                  )}
                  {decoded.payload.nbf && (
                    <p>Not before: {formatTimestamp(decoded.payload.nbf as number)}</p>
                  )}
                </div>
              )}
            </div>

            {/* Signature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-blue-500">Signature</label>
                <CopyButton value={decoded.signature} />
              </div>
              <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto font-mono break-all">
                {decoded.signature}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
