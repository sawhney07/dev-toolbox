"use client"

import { useState, useCallback, useEffect } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const tool = getToolById("number-base")!

interface ConversionResult {
  decimal: string
  binary: string
  octal: string
  hex: string
}

export default function NumberBasePage() {
  const [decimal, setDecimal] = useState("")
  const [binary, setBinary] = useState("")
  const [octal, setOctal] = useState("")
  const [hex, setHex] = useState("")
  const [error, setError] = useState("")

  const convertFrom = useCallback((value: string, base: number): ConversionResult | null => {
    if (!value.trim()) return null
    
    try {
      const num = parseInt(value, base)
      if (isNaN(num)) throw new Error("Invalid number")
      if (num < 0) throw new Error("Negative numbers not supported")
      if (num > Number.MAX_SAFE_INTEGER) throw new Error("Number too large")
      
      return {
        decimal: num.toString(10),
        binary: num.toString(2),
        octal: num.toString(8),
        hex: num.toString(16).toUpperCase(),
      }
    } catch {
      return null
    }
  }, [])

  const handleDecimalChange = useCallback((value: string) => {
    setDecimal(value)
    setError("")
    
    if (!value.trim()) {
      setBinary("")
      setOctal("")
      setHex("")
      return
    }

    if (!/^[0-9]+$/.test(value)) {
      setError("Invalid decimal number")
      return
    }

    const result = convertFrom(value, 10)
    if (result) {
      setBinary(result.binary)
      setOctal(result.octal)
      setHex(result.hex)
    }
  }, [convertFrom])

  const handleBinaryChange = useCallback((value: string) => {
    setBinary(value)
    setError("")
    
    if (!value.trim()) {
      setDecimal("")
      setOctal("")
      setHex("")
      return
    }

    if (!/^[01]+$/.test(value)) {
      setError("Invalid binary number (use only 0 and 1)")
      return
    }

    const result = convertFrom(value, 2)
    if (result) {
      setDecimal(result.decimal)
      setOctal(result.octal)
      setHex(result.hex)
    }
  }, [convertFrom])

  const handleOctalChange = useCallback((value: string) => {
    setOctal(value)
    setError("")
    
    if (!value.trim()) {
      setDecimal("")
      setBinary("")
      setHex("")
      return
    }

    if (!/^[0-7]+$/.test(value)) {
      setError("Invalid octal number (use only 0-7)")
      return
    }

    const result = convertFrom(value, 8)
    if (result) {
      setDecimal(result.decimal)
      setBinary(result.binary)
      setHex(result.hex)
    }
  }, [convertFrom])

  const handleHexChange = useCallback((value: string) => {
    setHex(value.toUpperCase())
    setError("")
    
    if (!value.trim()) {
      setDecimal("")
      setBinary("")
      setOctal("")
      return
    }

    if (!/^[0-9A-Fa-f]+$/.test(value)) {
      setError("Invalid hexadecimal number (use only 0-9 and A-F)")
      return
    }

    const result = convertFrom(value, 16)
    if (result) {
      setDecimal(result.decimal)
      setBinary(result.binary)
      setOctal(result.octal)
    }
  }, [convertFrom])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Decimal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Decimal (Base 10)</Label>
            <CopyButton value={decimal} />
          </div>
          <Input
            placeholder="Enter decimal number..."
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Binary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Binary (Base 2)</Label>
            <CopyButton value={binary} />
          </div>
          <Input
            placeholder="Enter binary number..."
            value={binary}
            onChange={(e) => handleBinaryChange(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Octal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Octal (Base 8)</Label>
            <CopyButton value={octal} />
          </div>
          <Input
            placeholder="Enter octal number..."
            value={octal}
            onChange={(e) => handleOctalChange(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Hexadecimal */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Hexadecimal (Base 16)</Label>
            <CopyButton value={hex} />
          </div>
          <Input
            placeholder="Enter hexadecimal number..."
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            className="font-mono"
          />
        </div>

        {/* Reference Table */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="mb-3 block text-sm">Quick Reference</Label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Dec</th>
                  <th className="text-left py-2 font-medium">Bin</th>
                  <th className="text-left py-2 font-medium">Oct</th>
                  <th className="text-left py-2 font-medium">Hex</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {[0, 1, 2, 8, 10, 15, 16, 255].map((n) => (
                  <tr key={n} className="border-b border-border/50">
                    <td className="py-1">{n}</td>
                    <td className="py-1">{n.toString(2)}</td>
                    <td className="py-1">{n.toString(8)}</td>
                    <td className="py-1">{n.toString(16).toUpperCase()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolWrapper>
  )
}
