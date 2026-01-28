import {
  Type,
  Code,
  Hash,
  Key,
  FileJson,
  Binary,
  Palette,
  RefreshCw,
  QrCode,
  Calculator,
  Clock,
  FileText,
  Regex,
  Braces,
  Dices,
  User,
  CircleDot,
  Shuffle,
  FileCode,
  GitCompare,
  Database,
  Link,
  Code2,
  FileType,
  Calendar,
  Eraser,
  ArrowDownAZ,
  Copy,
  Sparkles,
  Wand2,
  Minimize2,
  Table,
  Layers,
  Globe,
  Timer,
  StickyNote,
  FileSearch,
  ScanLine,
  Zap,
} from "lucide-react"

export type ToolCategory = {
  id: string
  name: string
  description: string
  icon: typeof Type
  color: string
}

export type Tool = {
  id: string
  name: string
  description: string
  category: string
  icon: typeof Type
  path: string
  isPremium?: boolean
  isNew?: boolean
}

export const categories: ToolCategory[] = [
  {
    id: "text",
    name: "Text & Content",
    description: "Text manipulation and content tools",
    icon: Type,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "coding",
    name: "Coding Essentials",
    description: "Code formatting, beautifying, and minifying",
    icon: Layers,
    color: "bg-indigo-500/10 text-indigo-500",
  },
  {
    id: "developer",
    name: "Developer Tools",
    description: "Encoding, debugging, and utility tools",
    icon: Code,
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    id: "converters",
    name: "Converters",
    description: "Data format and unit conversions",
    icon: RefreshCw,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    id: "generators",
    name: "Generators",
    description: "Generate UUIDs, QR codes, and more",
    icon: Key,
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    id: "random",
    name: "Randomizers",
    description: "Random names, numbers, passwords, and more",
    icon: Dices,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "productivity",
    name: "Productivity & Utilities",
    description: "Time management, note-taking, and file utilities",
    icon: Zap,
    color: "bg-cyan-500/10 text-cyan-500",
  },
]

export const tools: Tool[] = [
  // Text & Content Tools
  {
    id: "word-counter",
    name: "Word & Character Counter",
    description: "Count words, characters, sentences with detailed character analysis and frequency",
    category: "text",
    icon: FileText,
    path: "/tools/word-counter",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text between different cases",
    category: "text",
    icon: Type,
    path: "/tools/case-converter",
  },
  {
    id: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs",
    category: "text",
    icon: FileText,
    path: "/tools/lorem-ipsum",
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview",
    description: "Write Markdown and preview rendered HTML in real-time",
    category: "text",
    icon: FileCode,
    path: "/tools/markdown-preview",
    isNew: true,
  },
  {
    id: "text-diff",
    name: "Text Diff",
    description: "Compare two texts and highlight the differences",
    category: "text",
    icon: GitCompare,
    path: "/tools/text-diff",
    isNew: true,
  },
  {
    id: "text-cleaner",
    name: "Text Cleaner",
    description: "Remove extra spaces, tabs, newlines, symbols, numbers, and more",
    category: "text",
    icon: Eraser,
    path: "/tools/text-cleaner",
    isNew: true,
  },
  {
    id: "text-sorter",
    name: "Text Sorter",
    description: "Sort words or lines alphabetically, reverse, or by length",
    category: "text",
    icon: ArrowDownAZ,
    path: "/tools/text-sorter",
    isNew: true,
  },
  {
    id: "duplicate-remover",
    name: "Duplicate Remover",
    description: "Remove duplicate lines or words from text",
    category: "text",
    icon: Copy,
    path: "/tools/duplicate-remover",
    isNew: true,
  },
  {
    id: "text-summarizer",
    name: "Text Summarizer",
    description: "Generate extractive summaries from text (no AI)",
    category: "text",
    icon: Sparkles,
    path: "/tools/text-summarizer",
    isNew: true,
  },
  
  // Coding Essentials
  {
    id: "code-formatter",
    name: "Code Formatter",
    description: "Format and beautify code with auto-detect for multiple languages",
    category: "coding",
    icon: Wand2,
    path: "/tools/code-formatter",
    isNew: true,
  },
  {
    id: "code-minifier",
    name: "Code Minifier",
    description: "Minify JavaScript, CSS, and HTML code",
    category: "coding",
    icon: Minimize2,
    path: "/tools/code-minifier",
    isNew: true,
  },
  {
    id: "csv-prettifier",
    name: "CSV Prettifier",
    description: "Format and prettify CSV data with alignment and borders",
    category: "coding",
    icon: Table,
    path: "/tools/csv-prettifier",
    isNew: true,
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    category: "coding",
    icon: FileJson,
    path: "/tools/json-formatter",
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description: "Format and beautify SQL queries with proper indentation",
    category: "coding",
    icon: Database,
    path: "/tools/sql-formatter",
  },
  
  // Developer Tools
  {
    id: "base64",
    name: "Base64 Encode/Decode",
    description: "Encode and decode Base64 strings",
    category: "developer",
    icon: Binary,
    path: "/tools/base64",
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description: "Decode and inspect JSON Web Tokens",
    category: "developer",
    icon: Key,
    path: "/tools/jwt-decoder",
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256 hashes",
    category: "developer",
    icon: Hash,
    path: "/tools/hash-generator",
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description: "Test and debug regular expressions",
    category: "developer",
    icon: Regex,
    path: "/tools/regex-tester",
  },
  {
    id: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode and decode URL components and query strings",
    category: "developer",
    icon: Link,
    path: "/tools/url-encoder",
    isNew: true,
  },
  {
    id: "html-entity",
    name: "HTML Entity Encoder",
    description: "Encode and decode HTML entities and special characters",
    category: "developer",
    icon: Code2,
    path: "/tools/html-entity",
    isNew: true,
  },
  {
    id: "cron-parser",
    name: "Cron Expression Parser",
    description: "Parse and explain cron expressions with next run times",
    category: "developer",
    icon: Calendar,
    path: "/tools/cron-parser",
    isNew: true,
  },
  {
    id: "timezone-converter",
    name: "Timezone Converter",
    description: "Convert times between different timezones with live clock",
    category: "developer",
    icon: Clock,
    path: "/tools/timezone-converter",
    isNew: true,
  },
  {
    id: "ip-lookup",
    name: "IP Address Lookup",
    description: "Detect your IP address and view location information",
    category: "developer",
    icon: Globe,
    path: "/tools/ip-lookup",
    isNew: true,
  },
  
  // Converters
  {
    id: "color-converter",
    name: "Color Converter",
    description: "Convert between HEX, RGB, and HSL",
    category: "converters",
    icon: Palette,
    path: "/tools/color-converter",
  },
  {
    id: "json-csv",
    name: "JSON to CSV",
    description: "Convert JSON data to CSV format",
    category: "converters",
    icon: FileJson,
    path: "/tools/json-csv",
  },
  {
    id: "number-base",
    name: "Number Base Converter",
    description: "Convert between binary, decimal, and hex",
    category: "converters",
    icon: Binary,
    path: "/tools/number-base",
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between different units of measurement",
    category: "converters",
    icon: Calculator,
    path: "/tools/unit-converter",
  },
  {
    id: "yaml-json",
    name: "YAML ↔ JSON",
    description: "Convert between YAML and JSON formats",
    category: "converters",
    icon: FileType,
    path: "/tools/yaml-json",
    isNew: true,
  },
  
  // Generators
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique identifiers (UUIDs)",
    category: "generators",
    icon: Braces,
    path: "/tools/uuid-generator",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes from text or URLs",
    category: "generators",
    icon: QrCode,
    path: "/tools/qr-generator",
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    description: "Convert between Unix timestamps and dates",
    category: "generators",
    icon: Clock,
    path: "/tools/timestamp-converter",
  },

  // Randomizers
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure random passwords",
    category: "random",
    icon: Key,
    path: "/tools/password-generator",
  },
  {
    id: "random-number",
    name: "Random Number",
    description: "Generate random numbers within a range",
    category: "random",
    icon: Dices,
    path: "/tools/random-number",
  },
  {
    id: "random-name",
    name: "Random Name Generator",
    description: "Generate random names, usernames, and handles",
    category: "random",
    icon: User,
    path: "/tools/random-name",
  },
  {
    id: "coin-flip",
    name: "Coin Flip",
    description: "Flip a virtual coin for quick decisions",
    category: "random",
    icon: CircleDot,
    path: "/tools/coin-flip",
  },
  {
    id: "list-randomizer",
    name: "List Randomizer",
    description: "Shuffle, pick random items from a list",
    category: "random",
    icon: Shuffle,
    path: "/tools/list-randomizer",
  },

  // Productivity & Utilities
  {
    id: "timer",
    name: "Timer & Stopwatch",
    description: "Track time with stopwatch or countdown timer",
    category: "productivity",
    icon: Timer,
    path: "/tools/timer",
    isNew: true,
  },
  {
    id: "sticky-notes",
    name: "Sticky Notes",
    description: "Create and manage quick notes with localStorage",
    category: "productivity",
    icon: StickyNote,
    path: "/tools/sticky-notes",
    isNew: true,
  },
  {
    id: "file-type-identifier",
    name: "File Type Identifier",
    description: "Identify file types by extension or upload",
    category: "productivity",
    icon: FileSearch,
    path: "/tools/file-type-identifier",
    isNew: true,
  },
  {
    id: "qr-scanner",
    name: "QR Code Scanner",
    description: "Scan QR codes from images (camera coming soon)",
    category: "productivity",
    icon: ScanLine,
    path: "/tools/qr-scanner",
    isNew: true,
  },
]

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter((tool) => tool.category === categoryId)
}

export function getToolById(toolId: string): Tool | undefined {
  return tools.find((tool) => tool.id === toolId)
}

export function getCategoryById(categoryId: string): ToolCategory | undefined {
  return categories.find((cat) => cat.id === categoryId)
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase()
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery)
  )
}
