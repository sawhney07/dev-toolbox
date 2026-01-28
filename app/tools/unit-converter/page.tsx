"use client"

import { useState, useMemo } from "react"
import { ArrowRightLeft } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const tool = getToolById("unit-converter")!

type UnitCategory = {
  name: string
  units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]
}

const categories: UnitCategory[] = [
  {
    name: "Length",
    units: [
      { id: "m", name: "Meters", toBase: (v) => v, fromBase: (v) => v },
      { id: "km", name: "Kilometers", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: "cm", name: "Centimeters", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: "mm", name: "Millimeters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: "mi", name: "Miles", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: "yd", name: "Yards", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: "ft", name: "Feet", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: "in", name: "Inches", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  {
    name: "Weight",
    units: [
      { id: "kg", name: "Kilograms", toBase: (v) => v, fromBase: (v) => v },
      { id: "g", name: "Grams", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: "mg", name: "Milligrams", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: "lb", name: "Pounds", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { id: "oz", name: "Ounces", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: "t", name: "Metric Tons", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { id: "c", name: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { id: "f", name: "Fahrenheit", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
      { id: "k", name: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: "Data Storage",
    units: [
      { id: "b", name: "Bytes", toBase: (v) => v, fromBase: (v) => v },
      { id: "kb", name: "Kilobytes", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: "mb", name: "Megabytes", toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
      { id: "gb", name: "Gigabytes", toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
      { id: "tb", name: "Terabytes", toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    ],
  },
  {
    name: "Time",
    units: [
      { id: "s", name: "Seconds", toBase: (v) => v, fromBase: (v) => v },
      { id: "ms", name: "Milliseconds", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: "min", name: "Minutes", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: "h", name: "Hours", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: "d", name: "Days", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: "w", name: "Weeks", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    ],
  },
]

export default function UnitConverterPage() {
  const [category, setCategory] = useState(categories[0].name)
  const [fromUnit, setFromUnit] = useState(categories[0].units[0].id)
  const [toUnit, setToUnit] = useState(categories[0].units[1].id)
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")

  const currentCategory = useMemo(
    () => categories.find((c) => c.name === category)!,
    [category]
  )

  const convert = (value: string, from: string, to: string, direction: "forward" | "reverse") => {
    if (!value || isNaN(parseFloat(value))) {
      return ""
    }

    const numValue = parseFloat(value)
    const fromUnitObj = currentCategory.units.find((u) => u.id === from)!
    const toUnitObj = currentCategory.units.find((u) => u.id === to)!

    if (direction === "forward") {
      const baseValue = fromUnitObj.toBase(numValue)
      const result = toUnitObj.fromBase(baseValue)
      return formatNumber(result)
    } else {
      const baseValue = toUnitObj.toBase(numValue)
      const result = fromUnitObj.fromBase(baseValue)
      return formatNumber(result)
    }
  }

  const handleFromChange = (value: string) => {
    setFromValue(value)
    setToValue(convert(value, fromUnit, toUnit, "forward"))
  }

  const handleToChange = (value: string) => {
    setToValue(value)
    setFromValue(convert(value, fromUnit, toUnit, "reverse"))
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    const cat = categories.find((c) => c.name === newCategory)!
    setFromUnit(cat.units[0].id)
    setToUnit(cat.units[1].id)
    setFromValue("")
    setToValue("")
  }

  const handleSwap = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    setFromValue(toValue)
    setToValue(fromValue)
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <Label className="mb-3 block">Category</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={category === cat.name ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Conversion */}
        <div className="grid gap-4 md:grid-cols-[1fr,auto,1fr] items-end">
          {/* From */}
          <div className="space-y-2">
            <Label>From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter value..."
              value={fromValue}
              onChange={(e) => handleFromChange(e.target.value)}
              className="font-mono text-lg"
            />
          </div>

          {/* Swap Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            className="mb-2"
          >
            <ArrowRightLeft className="size-4" />
          </Button>

          {/* To */}
          <div className="space-y-2">
            <Label>To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentCategory.units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Result..."
              value={toValue}
              onChange={(e) => handleToChange(e.target.value)}
              className="font-mono text-lg"
            />
          </div>
        </div>

        {/* Formula */}
        {fromValue && toValue && (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-lg font-mono">
              {fromValue} {currentCategory.units.find((u) => u.id === fromUnit)?.name} ={" "}
              {toValue} {currentCategory.units.find((u) => u.id === toUnit)?.name}
            </p>
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}

function formatNumber(num: number): string {
  if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e10) {
    return num.toExponential(6)
  }
  return parseFloat(num.toPrecision(10)).toString()
}
