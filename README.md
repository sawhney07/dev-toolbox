# DevToolbox - Developer Utility Tools

A comprehensive collection of free online developer tools built with Next.js 16, React, and Tailwind CSS. All tools run locally in your browser - your data never leaves your device.

## Features

- **21 Utility Tools** across 5 categories
- **Light/Dark Theme** with system preference detection
- **Favorites & Recent** tools tracking (localStorage)
- **Responsive Design** with collapsible sidebar
- **SEO Optimized** - each tool has its own page/route
- **Privacy First** - all processing happens client-side

## Current Tools (MVP)

### Text & Content
- **Word Counter** - Count words, characters, sentences, paragraphs with reading/speaking time
- **Case Converter** - Convert between lowercase, UPPERCASE, Title Case, camelCase, snake_case, etc.
- **Lorem Ipsum Generator** - Generate placeholder text for designs

### Developer Tools
- **JSON Formatter** - Format, validate, and beautify/minify JSON data
- **Base64 Encode/Decode** - Encode and decode Base64 strings
- **JWT Decoder** - Decode and inspect JSON Web Tokens with expiry checking
- **Hash Generator** - Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes
- **Regex Tester** - Test and debug regular expressions with match highlighting

### Converters
- **Color Converter** - Convert between HEX, RGB, and HSL color formats
- **JSON to CSV** - Bi-directional conversion between JSON and CSV
- **Number Base Converter** - Convert between binary, decimal, octal, and hex
- **Unit Converter** - Convert length, weight, temperature, data storage, and time units
- **Timestamp Converter** - Convert between Unix timestamps and human-readable dates

### Generators
- **UUID Generator** - Generate UUID v4 identifiers
- **QR Code Generator** - Generate QR codes from text or URLs

### Randomizers (NEW)
- **Password Generator** - Generate secure random passwords with customizable options
- **Random Number** - Generate random numbers within a custom range
- **Random Name Generator** - Generate random names, usernames, and social handles
- **Coin Flip** - Virtual coin flip with statistics tracking
- **List Randomizer** - Shuffle lists or pick random items/winners

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **State:** React hooks, localStorage for persistence
- **Icons:** Lucide React

## Local Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devtoolbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Homepage with category cards
│   ├── globals.css         # Global styles and theme tokens
│   └── tools/
│       ├── layout.tsx      # Tools layout with sidebar
│       ├── json-formatter/
│       ├── base64/
│       ├── jwt-decoder/
│       ├── hash-generator/
│       ├── regex-tester/
│       ├── word-counter/
│       ├── case-converter/
│       ├── lorem-ipsum/
│       ├── color-converter/
│       ├── json-csv/
│       ├── number-base/
│       ├── unit-converter/
│       ├── timestamp-converter/
│       ├── uuid-generator/
│       ├── qr-generator/
│       ├── password-generator/
│       ├── random-number/
│       ├── random-name/
│       ├── coin-flip/
│       └── list-randomizer/
├── components/
│   ├── app-sidebar.tsx     # Navigation sidebar
│   ├── app-header.tsx      # Page header with breadcrumbs
│   ├── theme-toggle.tsx    # Light/dark theme toggle
│   ├── theme-provider.tsx  # Next-themes provider
│   ├── tool-wrapper.tsx    # Reusable tool page wrapper
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── use-favorites.ts    # Favorites & recent tools hooks
│   └── use-mobile.ts       # Mobile detection hook
└── lib/
    ├── tools-config.ts     # Tool definitions and categories
    └── utils.ts            # Utility functions
```

## Adding New Tools

1. **Add tool definition** in `lib/tools-config.ts`:
   ```typescript
   {
     id: "your-tool-id",
     name: "Your Tool Name",
     description: "Tool description",
     category: "developer", // or "text", "converters", "generators", "random"
     icon: YourIcon,
     path: "/tools/your-tool-id",
   }
   ```

2. **Create tool page** at `app/tools/your-tool-id/page.tsx`:
   ```typescript
   "use client"
   
   import { getToolById } from "@/lib/tools-config"
   import { ToolWrapper } from "@/components/tool-wrapper"
   
   const tool = getToolById("your-tool-id")!
   
   export default function YourToolPage() {
     return (
       <ToolWrapper tool={tool}>
         {/* Your tool UI */}
       </ToolWrapper>
     )
   }
   ```

## Future Roadmap

### Phase 2 - More Client-Side Tools
- [ ] Markdown Preview
- [ ] HTML Entity Encoder
- [ ] URL Encoder/Decoder
- [ ] Cron Expression Parser
- [ ] SQL Formatter
- [ ] XML Formatter/Validator
- [ ] YAML to JSON Converter
- [ ] Text Diff Tool

### Phase 3 - Backend Integration (requires API)
- [ ] PDF to Image
- [ ] Image Compression
- [ ] Image Format Converter
- [ ] Video to GIF
- [ ] Audio Converter

### Phase 4 - Authentication & Premium
- [ ] User accounts
- [ ] Save favorites to cloud
- [ ] Premium tools
- [ ] API access

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-tool`)
3. Commit your changes (`git commit -am 'Add new tool'`)
4. Push to the branch (`git push origin feature/new-tool`)
5. Create a Pull Request

## License

MIT License - feel free to use this for your own projects!

---

Built with Next.js and deployed on Vercel.
