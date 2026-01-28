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
    id: "developer",
    name: "Developer Tools",
    description: "Code formatting, encoding, and debugging",
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
]

export const tools: Tool[] = [
  // Text & Content Tools
  {
    id: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs",
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
  
  // Developer Tools
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    category: "developer",
    icon: FileJson,
    path: "/tools/json-formatter",
    isNew: true,
  },
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
