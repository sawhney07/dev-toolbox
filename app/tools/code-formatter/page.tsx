"use client"

import { useState } from "react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tool = getToolById("code-formatter")!

const LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "sql", label: "SQL" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
]

export default function CodeFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [language, setLanguage] = useState("auto")
  const [detectedLanguage, setDetectedLanguage] = useState("")
  const { toast } = useToast()

  const detectLanguage = (code: string): string => {
    const trimmed = code.trim()
    
    // JSON detection
    if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || 
        (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
      try {
        JSON.parse(trimmed)
        return "json"
      } catch {
        // Not valid JSON, continue
      }
    }
    
    // HTML/XML detection
    if (trimmed.startsWith("<!DOCTYPE") || trimmed.startsWith("<html") || 
        /<\w+[^>]*>.*<\/\w+>/.test(trimmed)) {
      return "html"
    }
    
    // CSS detection
    if (/[.#\w]+\s*\{[^}]*\}/.test(trimmed)) {
      return "css"
    }
    
    // SQL detection
    if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/i.test(trimmed)) {
      return "sql"
    }
    
    // Python detection
    if (/\b(def|import|from|class|if __name__|print)\b/.test(trimmed)) {
      return "python"
    }
    
    // Java detection
    if (/\b(public\s+class|private\s+|protected\s+|void\s+|System\.out\.println)\b/.test(trimmed)) {
      return "java"
    }
    
    // JavaScript/TypeScript detection
    if (/\b(const|let|var|function|=>|import|export|require)\b/.test(trimmed) || 
        /console\.(log|error|warn)/.test(trimmed)) {
      return /\b(interface|type\s+\w+\s*=|as\s+|:.*=>)\b/.test(trimmed) ? "typescript" : "javascript"
    }
    
    return "javascript" // Default fallback
  }

  const formatCode = () => {
    if (!input.trim()) {
      setOutput("")
      return
    }

    const lang = language === "auto" ? detectLanguage(input) : language
    setDetectedLanguage(language === "auto" ? lang : "")
    
    let formatted = input
    
    try {
      switch (lang) {
        case "json":
          formatted = JSON.stringify(JSON.parse(input), null, 2)
          break
          
        case "html":
        case "xml":
          formatted = formatHTML(input)
          break
          
        case "css":
          formatted = formatCSS(input)
          break
          
        case "sql":
          formatted = formatSQL(input)
          break
          
        case "javascript":
        case "typescript":
        case "python":
        case "java":
        case "csharp":
        case "php":
        case "ruby":
        case "go":
          formatted = formatGenericCode(input)
          break
          
        default:
          formatted = input
      }
      
      setOutput(formatted)
    } catch (error) {
      toast({
        title: "Formatting Error",
        description: error instanceof Error ? error.message : "Failed to format code",
        variant: "destructive",
      })
      setOutput(input)
    }
  }

  const formatHTML = (code: string): string => {
    let formatted = code.replace(/>\s+</g, "><") // Remove spaces between tags
    let indent = 0
    const lines: string[] = []
    
    const tags = formatted.split(/(<[^>]+>)/g).filter(Boolean)
    
    tags.forEach((tag) => {
      if (tag.trim()) {
        if (tag.startsWith("</")) {
          indent = Math.max(0, indent - 1)
          lines.push("  ".repeat(indent) + tag)
        } else if (tag.startsWith("<") && !tag.endsWith("/>") && !tag.startsWith("<!")) {
          lines.push("  ".repeat(indent) + tag)
          if (!tag.startsWith("<br") && !tag.startsWith("<img") && !tag.startsWith("<input")) {
            indent++
          }
        } else if (tag.startsWith("<")) {
          lines.push("  ".repeat(indent) + tag)
        } else {
          const text = tag.trim()
          if (text) lines.push("  ".repeat(indent) + text)
        }
      }
    })
    
    return lines.join("\n")
  }

  const formatCSS = (code: string): string => {
    return code
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/\s*}\s*/g, "\n}\n\n")
      .replace(/;\s*/g, ";\n  ")
      .replace(/,\s*/g, ", ")
      .trim()
  }

  const formatSQL = (code: string): string => {
    return code
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ORDER BY|GROUP BY|HAVING|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|CREATE TABLE|DROP TABLE|ALTER TABLE)\b/gi, "\n$1")
      .replace(/,/g, ",\n  ")
      .replace(/\bAND\b/gi, "\n  AND")
      .replace(/\bOR\b/gi, "\n  OR")
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .join("\n")
      .trim()
  }

  const formatGenericCode = (code: string): string => {
    let indent = 0
    const lines = code.split("\n")
    const formatted: string[] = []
    
    lines.forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) {
        formatted.push("")
        return
      }
      
      // Decrease indent for closing braces
      if (trimmed.startsWith("}") || trimmed.startsWith("]") || trimmed.startsWith(")")) {
        indent = Math.max(0, indent - 1)
      }
      
      formatted.push("  ".repeat(indent) + trimmed)
      
      // Increase indent for opening braces
      if (trimmed.endsWith("{") || trimmed.endsWith("[") || trimmed.endsWith("(")) {
        indent++
      }
    })
    
    return formatted.join("\n")
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    toast({
      title: "Copied!",
      description: "Formatted code copied to clipboard",
    })
  }

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Options */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {detectedLanguage && (
                <div className="flex-1">
                  <Label className="text-muted-foreground">Detected</Label>
                  <p className="text-sm font-medium capitalize mt-2">{detectedLanguage}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Input */}
        <div>
          <Label htmlFor="input-code" className="mb-2 block">
            Input Code
          </Label>
          <Textarea
            id="input-code"
            placeholder="Paste your code here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[250px] font-mono text-sm"
          />
        </div>

        {/* Action Button */}
        <Button onClick={formatCode} className="w-full">
          <Wand2 className="w-4 h-4 mr-2" />
          Format Code
        </Button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="output-code">Formatted Code</Label>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              id="output-code"
              value={output}
              readOnly
              className="min-h-[250px] font-mono text-sm bg-muted"
            />
          </div>
        )}
      </div>
    </ToolWrapper>
  )
}
