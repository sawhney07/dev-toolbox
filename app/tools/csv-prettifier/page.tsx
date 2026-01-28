"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Table } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("csv-prettifier")!

export default function CSVPrettifierPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [alignColumns, setAlignColumns] = useState(true)
  const [addBorders, setAddBorders] = useState(true)
  const { toast } = useToast()

  const prettifyCSV = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    try {
      // Parse CSV
      const rows = parseCSV(input)
      
      if (rows.length === 0) {
        setOutput("No data found")
        return
      }

      if (addBorders) {
        setOutput(formatAsTable(rows))
      } else {
        setOutput(formatAsAligned(rows))
      }
    } catch (error) {
      toast({
        title: "Parse Error",
        description: error instanceof Error ? error.message : "Failed to parse CSV",
        variant: "destructive",
      })
    }
  }

  const parseCSV = (csv: string): string[][] => {
    const rows: string[][] = []
    const lines = csv.split("\n")
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      const cells: string[] = []
      let cell = ""
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === "," && !inQuotes) {
          cells.push(cell.trim())
          cell = ""
        } else {
          cell += char
        }
      }
      cells.push(cell.trim())
      rows.push(cells)
    }
    
    return rows
  }

  const formatAsTable = (rows: string[][]): string => {
    // Calculate column widths
    const colCount = Math.max(...rows.map(r => r.length))
    const colWidths: number[] = Array(colCount).fill(0)
    
    rows.forEach(row => {
      row.forEach((cell, i) => {
        colWidths[i] = Math.max(colWidths[i], cell.length)
      })
    })

    // Build table
    const separator = "+" + colWidths.map(w => "-".repeat(w + 2)).join("+") + "+"
    const lines: string[] = [separator]
    
    rows.forEach((row, rowIndex) => {
      const cells = row.map((cell, i) => {
        const padding = alignColumns ? colWidths[i] : 0
        return " " + cell.padEnd(padding) + " "
      })
      lines.push("|" + cells.join("|") + "|")
      
      // Add separator after header row
      if (rowIndex === 0) {
        lines.push(separator)
      }
    })
    
    lines.push(separator)
    return lines.join("\n")
  }

  const formatAsAligned = (rows: string[][]): string => {
    if (!alignColumns) {
      return rows.map(row => row.join(",")).join("\n")
    }

    // Calculate column widths
    const colCount = Math.max(...rows.map(r => r.length))
    const colWidths: number[] = Array(colCount).fill(0)
    
    rows.forEach(row => {
      row.forEach((cell, i) => {
        colWidths[i] = Math.max(colWidths[i], cell.length)
      })
    })

    // Format rows with padding
    return rows.map(row => 
      row.map((cell, i) => cell.padEnd(colWidths[i])).join(", ")
    ).join("\n")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Prettified CSV copied to clipboard",
    })
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Options */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-medium">Formatting Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="align-columns"
                    checked={alignColumns}
                    onCheckedChange={(checked) => setAlignColumns(checked as boolean)}
                  />
                  <Label htmlFor="align-columns" className="cursor-pointer">
                    Align columns
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="add-borders"
                    checked={addBorders}
                    onCheckedChange={(checked) => setAddBorders(checked as boolean)}
                  />
                  <Label htmlFor="add-borders" className="cursor-pointer">
                    Add borders (ASCII table)
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <div>
          <Label htmlFor="input-csv" className="mb-2 block">
            CSV Input
          </Label>
          <Textarea
            id="input-csv"
            placeholder="Paste your CSV data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        {/* Action Button */}
        <Button onClick={prettifyCSV} className="w-full">
          <Table className="w-4 h-4 mr-2" />
          Prettify CSV
        </Button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="output-csv">Prettified Output</Label>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              id="output-csv"
              value={output}
              readOnly
              className="min-h-[200px] font-mono text-sm bg-muted"
            />
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
