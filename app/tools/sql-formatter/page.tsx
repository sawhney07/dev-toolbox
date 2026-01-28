"use client"

import { useState, useCallback } from "react"
import { Maximize2, Minimize2, AlertCircle } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const tool = getToolById("sql-formatter")!

// SQL keywords for formatting
const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "IN", "IS", "NULL", "LIKE",
  "BETWEEN", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END", "AS", "ON",
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "NATURAL",
  "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "UNION", "ALL",
  "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE",
  "ALTER", "DROP", "INDEX", "VIEW", "DATABASE", "SCHEMA", "PRIMARY", "KEY",
  "FOREIGN", "REFERENCES", "CONSTRAINT", "UNIQUE", "CHECK", "DEFAULT",
  "AUTO_INCREMENT", "CASCADE", "DISTINCT", "TOP", "FETCH", "NEXT", "ROWS",
  "ONLY", "WITH", "RECURSIVE", "OVER", "PARTITION", "ROW_NUMBER", "RANK",
  "DENSE_RANK", "NTILE", "LAG", "LEAD", "FIRST_VALUE", "LAST_VALUE",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "NULLIF", "CAST",
  "CONVERT", "TRIM", "UPPER", "LOWER", "SUBSTRING", "CONCAT", "LENGTH",
  "REPLACE", "ROUND", "FLOOR", "CEIL", "ABS", "NOW", "CURRENT_DATE",
  "CURRENT_TIME", "CURRENT_TIMESTAMP", "EXTRACT", "YEAR", "MONTH", "DAY",
  "HOUR", "MINUTE", "SECOND", "ASC", "DESC", "NULLS", "FIRST", "LAST",
  "TRUE", "FALSE", "BOOLEAN", "INT", "INTEGER", "BIGINT", "SMALLINT",
  "DECIMAL", "NUMERIC", "FLOAT", "DOUBLE", "REAL", "VARCHAR", "CHAR",
  "TEXT", "DATE", "TIME", "TIMESTAMP", "DATETIME", "BLOB", "CLOB"
]

const MAJOR_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "ORDER BY", "GROUP BY", "HAVING", "LIMIT",
  "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN",
  "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
  "JOIN", "ON", "AND", "OR", "UNION", "UNION ALL", "INSERT INTO",
  "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE", "ALTER TABLE",
  "DROP TABLE", "WITH"
]

function formatSQL(sql: string, options: { uppercase: boolean; indentSize: number }): string {
  if (!sql.trim()) return ""
  
  let formatted = sql.trim()
  
  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, " ")
  
  // Uppercase keywords if option is set
  if (options.uppercase) {
    SQL_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      formatted = formatted.replace(regex, keyword)
    })
  }
  
  const indent = " ".repeat(options.indentSize)
  
  // Add newlines before major keywords
  const majorKeywordsPattern = MAJOR_KEYWORDS
    .map(k => k.replace(/\s+/g, "\\s+"))
    .join("|")
  
  // Handle SELECT
  formatted = formatted.replace(/\bSELECT\b/gi, "\nSELECT")
  
  // Handle FROM
  formatted = formatted.replace(/\bFROM\b/gi, "\nFROM")
  
  // Handle WHERE
  formatted = formatted.replace(/\bWHERE\b/gi, "\nWHERE")
  
  // Handle AND/OR in WHERE clause
  formatted = formatted.replace(/\bAND\b/gi, `\n${indent}AND`)
  formatted = formatted.replace(/\bOR\b/gi, `\n${indent}OR`)
  
  // Handle JOINs
  formatted = formatted.replace(/\b(INNER\s+JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|FULL\s+JOIN|CROSS\s+JOIN|LEFT\s+OUTER\s+JOIN|RIGHT\s+OUTER\s+JOIN|FULL\s+OUTER\s+JOIN|JOIN)\b/gi, "\n$1")
  
  // Handle ON
  formatted = formatted.replace(/\bON\b/gi, `\n${indent}ON`)
  
  // Handle GROUP BY
  formatted = formatted.replace(/\bGROUP\s+BY\b/gi, "\nGROUP BY")
  
  // Handle HAVING
  formatted = formatted.replace(/\bHAVING\b/gi, "\nHAVING")
  
  // Handle ORDER BY
  formatted = formatted.replace(/\bORDER\s+BY\b/gi, "\nORDER BY")
  
  // Handle LIMIT
  formatted = formatted.replace(/\bLIMIT\b/gi, "\nLIMIT")
  
  // Handle UNION
  formatted = formatted.replace(/\bUNION\s+ALL\b/gi, "\n\nUNION ALL")
  formatted = formatted.replace(/\bUNION\b(?!\s+ALL)/gi, "\n\nUNION")
  
  // Handle INSERT
  formatted = formatted.replace(/\bINSERT\s+INTO\b/gi, "\nINSERT INTO")
  formatted = formatted.replace(/\bVALUES\b/gi, "\nVALUES")
  
  // Handle UPDATE
  formatted = formatted.replace(/\bUPDATE\b/gi, "\nUPDATE")
  formatted = formatted.replace(/\bSET\b/gi, "\nSET")
  
  // Handle DELETE
  formatted = formatted.replace(/\bDELETE\s+FROM\b/gi, "\nDELETE FROM")
  
  // Handle CREATE/ALTER/DROP
  formatted = formatted.replace(/\bCREATE\s+TABLE\b/gi, "\nCREATE TABLE")
  formatted = formatted.replace(/\bALTER\s+TABLE\b/gi, "\nALTER TABLE")
  formatted = formatted.replace(/\bDROP\s+TABLE\b/gi, "\nDROP TABLE")
  
  // Handle WITH (CTE)
  formatted = formatted.replace(/\bWITH\b/gi, "\nWITH")
  
  // Handle commas - put each column on new line after SELECT
  formatted = formatted.replace(/,\s*/g, `,\n${indent}`)
  
  // Fix double newlines
  formatted = formatted.replace(/\n\s*\n\s*\n/g, "\n\n")
  
  // Trim leading newline
  formatted = formatted.trim()
  
  return formatted
}

function minifySQL(sql: string): string {
  if (!sql.trim()) return ""
  
  // Remove comments
  let minified = sql
    .replace(/--.*$/gm, "") // Single line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Multi-line comments
  
  // Normalize whitespace
  minified = minified.replace(/\s+/g, " ").trim()
  
  return minified
}

export default function SQLFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [uppercase, setUppercase] = useState(true)
  const [indentSize, setIndentSize] = useState(2)

  const format = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      const formatted = formatSQL(input, { uppercase, indentSize })
      setOutput(formatted)
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error formatting SQL")
      setOutput("")
    }
  }, [input, uppercase, indentSize])

  const minify = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      const minified = minifySQL(input)
      setOutput(minified)
      setError("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error minifying SQL")
      setOutput("")
    }
  }, [input])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-6">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Input SQL</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="rounded"
                />
                Uppercase keywords
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="text-sm border rounded-md px-2 py-1 bg-background"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
          </div>
          <Textarea
            placeholder="SELECT * FROM users WHERE id = 1..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError("")
            }}
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={format} className="flex-1">
            <Maximize2 className="size-4 mr-2" />
            Format / Beautify
          </Button>
          <Button onClick={minify} variant="outline" className="flex-1 bg-transparent">
            <Minimize2 className="size-4 mr-2" />
            Minify
          </Button>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Output</label>
            <CopyButton value={output} />
          </div>
          <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto max-h-[400px] font-mono whitespace-pre-wrap">
            {output || <span className="text-muted-foreground">Formatted SQL will appear here...</span>}
          </pre>
        </div>
      </div>
    </ToolWrapper>
  )
}
