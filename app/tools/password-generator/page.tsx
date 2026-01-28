"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Check, X } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

const tool = getToolById("password-generator")!
// Tool is now in the "random" category

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz"
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const NUMBERS = "0123456789"
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

function generatePassword(
  length: number,
  options: {
    lowercase: boolean
    uppercase: boolean
    numbers: boolean
    symbols: boolean
  }
): string {
  let charset = ""
  if (options.lowercase) charset += LOWERCASE
  if (options.uppercase) charset += UPPERCASE
  if (options.numbers) charset += NUMBERS
  if (options.symbols) charset += SYMBOLS

  if (!charset) return ""

  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  
  return Array.from(array, (num) => charset[num % charset.length]).join("")
}

function calculateStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" }
  if (score <= 4) return { score, label: "Fair", color: "bg-amber-500" }
  if (score <= 6) return { score, label: "Good", color: "bg-blue-500" }
  return { score, label: "Strong", color: "bg-green-500" }
}

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: true,
  })

  const generate = useCallback(() => {
    const newPassword = generatePassword(length, options)
    setPassword(newPassword)
  }, [length, options])

  const strength = password ? calculateStrength(password) : null

  const toggleOption = (key: keyof typeof options) => {
    const newOptions = { ...options, [key]: !options[key] }
    // Ensure at least one option is selected
    if (Object.values(newOptions).some(Boolean)) {
      setOptions(newOptions)
    }
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Generated Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Generated Password</Label>
            <CopyButton value={password} />
          </div>
          <div className="flex gap-2">
            <Input
              value={password}
              readOnly
              placeholder="Click generate to create a password"
              className="font-mono text-lg"
            />
            <Button onClick={generate} size="icon" variant="outline">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>

        {/* Strength Indicator */}
        {strength && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Password Strength</Label>
              <span className="text-sm font-medium">{strength.label}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all`}
                style={{ width: `${(strength.score / 7) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Length Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Length</Label>
            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {length}
            </span>
          </div>
          <Slider
            value={[length]}
            onValueChange={([value]) => setLength(value)}
            min={4}
            max={64}
            step={1}
          />
        </div>

        {/* Character Options */}
        <div>
          <Label className="mb-3 block">Include Characters</Label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "lowercase", label: "Lowercase (a-z)", example: "abc" },
              { key: "uppercase", label: "Uppercase (A-Z)", example: "ABC" },
              { key: "numbers", label: "Numbers (0-9)", example: "123" },
              { key: "symbols", label: "Symbols (!@#)", example: "!@#" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={options[key as keyof typeof options]}
                  onCheckedChange={() => toggleOption(key as keyof typeof options)}
                />
                <label htmlFor={key} className="text-sm cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generate} className="w-full" size="lg">
          <RefreshCw className="size-4 mr-2" />
          Generate Password
        </Button>

        {/* Password Requirements Checklist */}
        {password && (
          <div className="p-4 bg-muted rounded-lg">
            <Label className="mb-3 block text-sm">Password Analysis</Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { check: password.length >= 8, label: "At least 8 characters" },
                { check: password.length >= 12, label: "At least 12 characters" },
                { check: /[a-z]/.test(password), label: "Contains lowercase" },
                { check: /[A-Z]/.test(password), label: "Contains uppercase" },
                { check: /[0-9]/.test(password), label: "Contains numbers" },
                { check: /[^a-zA-Z0-9]/.test(password), label: "Contains symbols" },
              ].map(({ check, label }) => (
                <div key={label} className="flex items-center gap-2">
                  {check ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <X className="size-4 text-muted-foreground" />
                  )}
                  <span className={check ? "text-foreground" : "text-muted-foreground"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
