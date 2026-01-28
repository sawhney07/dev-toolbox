"use client"

import { useState, useCallback, useEffect } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const tool = getToolById("color-converter")!

interface ColorValues {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export default function ColorConverterPage() {
  const [color, setColor] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
  })

  const [hexInput, setHexInput] = useState("#3b82f6")

  const updateFromHex = useCallback((hex: string) => {
    const rgb = hexToRgb(hex)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      setColor({ hex, rgb, hsl })
    }
  }, [])

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    setColor({ hex, rgb: { r, g, b }, hsl })
    setHexInput(hex)
  }, [])

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
    setColor({ hex, rgb, hsl: { h, s, l } })
    setHexInput(hex)
  }, [])

  const handleHexChange = (value: string) => {
    setHexInput(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      updateFromHex(value)
    }
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Color Preview */}
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-lg border shadow-sm"
            style={{ backgroundColor: color.hex }}
          />
          <div className="flex-1">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => {
                setHexInput(e.target.value)
                updateFromHex(e.target.value)
              }}
              className="w-full h-12 cursor-pointer rounded-lg"
            />
          </div>
        </div>

        {/* HEX */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>HEX</Label>
            <CopyButton value={color.hex} />
          </div>
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#000000"
            className="font-mono"
          />
        </div>

        {/* RGB */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>RGB</Label>
            <CopyButton value={`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">R</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={color.rgb.r}
                onChange={(e) =>
                  updateFromRgb(
                    Math.min(255, Math.max(0, parseInt(e.target.value) || 0)),
                    color.rgb.g,
                    color.rgb.b
                  )
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">G</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={color.rgb.g}
                onChange={(e) =>
                  updateFromRgb(
                    color.rgb.r,
                    Math.min(255, Math.max(0, parseInt(e.target.value) || 0)),
                    color.rgb.b
                  )
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">B</Label>
              <Input
                type="number"
                min={0}
                max={255}
                value={color.rgb.b}
                onChange={(e) =>
                  updateFromRgb(
                    color.rgb.r,
                    color.rgb.g,
                    Math.min(255, Math.max(0, parseInt(e.target.value) || 0))
                  )
                }
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* HSL */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>HSL</Label>
            <CopyButton value={`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">H</Label>
              <Input
                type="number"
                min={0}
                max={360}
                value={color.hsl.h}
                onChange={(e) =>
                  updateFromHsl(
                    Math.min(360, Math.max(0, parseInt(e.target.value) || 0)),
                    color.hsl.s,
                    color.hsl.l
                  )
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">S %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={color.hsl.s}
                onChange={(e) =>
                  updateFromHsl(
                    color.hsl.h,
                    Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                    color.hsl.l
                  )
                }
                className="font-mono"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">L %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={color.hsl.l}
                onChange={(e) =>
                  updateFromHsl(
                    color.hsl.h,
                    color.hsl.s,
                    Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                  )
                }
                className="font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </ToolWrapper>
  )
}
