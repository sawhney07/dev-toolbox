# utilityHood - Developer Utility Tools

A comprehensive collection of free online developer tools built with Next.js 16, React, and Tailwind CSS. All tools run locally in your browser - your data never leaves your device.

## Features

- **43 Utility Tools** across 7 categories
- **Light/Dark Theme** with system preference detection
- **Favorites & Recent** tools tracking (localStorage)
- **Responsive Design** with collapsible sidebar
- **SEO Optimized** - each tool has its own page/route
- **Privacy First** - all processing happens client-side

## Current Tools (MVP)

### Text & Content
- **Word & Character Counter** - Count words, characters, sentences with detailed character analysis and frequency (ENHANCED)
- **Case Converter** - Convert between lowercase, UPPERCASE, Title Case, camelCase, snake_case, etc.
- **Lorem Ipsum Generator** - Generate placeholder text for designs
- **Markdown Preview** - Write Markdown and preview rendered HTML in real-time
- **Text Diff** - Compare two texts side-by-side and highlight differences
- **Text Cleaner** - Remove extra spaces, tabs, newlines, symbols, numbers, and more (NEW)
- **Text Sorter** - Sort words or lines alphabetically, reverse, or by length (NEW)
- **Duplicate Remover** - Remove duplicate lines or words from text (NEW)
- **Text Summarizer** - Generate extractive summaries from text without AI (NEW)

### Coding Essentials (NEW)
- **Code Formatter** - Format and beautify code with auto-detect for 10+ languages (NEW)
- **Code Minifier** - Minify JavaScript, CSS, and HTML code (NEW)
- **CSV Prettifier** - Format and prettify CSV data with alignment and borders (NEW)
- **JSON Formatter** - Format, validate, and beautify/minify JSON data
- **SQL Formatter** - Format and beautify SQL queries with proper indentation

### Developer Tools
- **Base64 Encode/Decode** - Encode and decode Base64 strings
- **JWT Decoder** - Decode and inspect JSON Web Tokens with expiry checking
- **Hash Generator** - Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes
- **Regex Tester** - Test and debug regular expressions with match highlighting
- **URL Encoder/Decoder** - Encode and decode URL components and query strings
- **HTML Entity Encoder** - Encode and decode HTML entities and special characters
- **Cron Expression Parser** - Parse and explain cron expressions with next run times
- **Timezone Converter** - Convert times between different timezones with live clock (NEW)
- **IP Address Lookup** - Detect your IP address and view location information (NEW)

### Converters
- **Color Converter** - Convert between HEX, RGB, and HSL color formats
- **JSON to CSV** - Bi-directional conversion between JSON and CSV
- **Number Base Converter** - Convert between binary, decimal, octal, and hex
- **Unit Converter** - Convert length, weight, temperature, data storage, and time units
- **Timestamp Converter** - Convert between Unix timestamps and human-readable dates
- **YAML ↔ JSON** - Convert between YAML and JSON formats (NEW)

### Generators
- **UUID Generator** - Generate UUID v4 identifiers
- **QR Code Generator** - Generate QR codes from text or URLs

### Randomizers (NEW)
- **Password Generator** - Generate secure random passwords with customizable options
- **Random Number** - Generate random numbers within a custom range
- **Random Name Generator** - Generate random names, usernames, and social handles
- **Coin Flip** - Virtual coin flip with statistics tracking
- **List Randomizer** - Shuffle lists or pick random items/winners

### Productivity & Utilities (NEW)
- **Timer & Stopwatch** - Track time with stopwatch or countdown timer (NEW)
- **Sticky Notes** - Create and manage quick notes with localStorage (NEW)
- **File Type Identifier** - Identify file types by extension or upload (NEW)
- **QR Code Scanner** - Scan QR codes from images (camera coming soon) (NEW)

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
   cd utilityhood
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

### Phase 2 - More Client-Side Tools ✅
- [x] Markdown Preview
- [x] Text Diff Tool
- [x] SQL Formatter
- [x] HTML Entity Encoder
- [x] URL Encoder/Decoder
- [x] YAML to JSON Converter
- [x] Cron Expression Parser

### Phase 3 - Additional Client-Side Tools (for multi support - split a component into inner tabs)
**Text & Content:**
- [x] Word/Character Counter (merge Character with existing Word Counter)
- [x] Text/Whitespace Cleaner (remove extra spaces, tabs, newlines, symbols, numbers, etc) 
- [x] Word/Line Sorter (alphabetical, reverse, by length)
- [x] Duplicate Remover (Line/Words)
- [x] Text Summarizer (extractive, no AI)

**Coding Essentials:**
- [x] Code Formatter/Beautifier (Auto detect languages + list)
- [x] Code Minifier (JS, CSS, HTML)
- [x] CSV Prettifier
- [x] Move SQL Formatter and JSON Formatter from Developer Tools to here

**Developer Tools:**
- [x] Timezone Converter
- [x] IP Lookup (client IP detection)

**Productivity & Utilities:**
- [x] Stopwatch/Countdown Timer
- [x] Sticky Notes (localStorage)
- [x] File Type Identifier (by extension/magic bytes)
- [ ] Bulk File Renamer (pattern-based)
- [x] QR Code Scanner (camera/file upload)

### Phase 4 - Backend Integration (requires API/Server)
**Document Conversion:**
- [ ] PDF → Word
- [ ] Word → PDF
- [ ] PDF → Image
- [ ] Image → PDF
- [ ] Text → PDF
- [ ] Markdown → PDF
- [ ] EPUB ↔ PDF

**Image Processing:**
- [ ] Image Format Converter (JPG ↔ PNG ↔ WebP)
- [ ] HEIC → JPG
- [ ] Image Compression (lossy/lossless)
- [ ] Bulk Image Compression
- [ ] Image Resizer
- [ ] Image Cropper
- [ ] Background Remover
- [ ] Image Upscaler
- [ ] EXIF Viewer/Remover

**Audio/Video Processing:**
- [ ] Audio Format Converter (MP3 ↔ WAV ↔ OGG)
- [ ] Video Format Converter (MP4 ↔ WebM)
- [ ] Video → Audio Extractor
- [ ] Video/Audio Trimmer
- [ ] Audio/Video Compression
- [ ] Video to GIF

**PDF Tools:**
- [ ] PDF Merger
- [ ] PDF Splitter
- [ ] PDF Page Deleter
- [ ] PDF Page Reorder
- [ ] PDF Watermark
- [ ] PDF Password Protect/Unlock
- [ ] PDF Compression

**Advanced Features:**
- [ ] OCR (Image to Text)
- [ ] Speech to Text
- [ ] AI Grammar Checker
- [ ] AI Paraphraser
- [ ] Currency Converter (real-time rates)
- [ ] Internet Speed Test

### Phase 5 - Authentication & Premium
- [ ] User accounts
- [ ] Save favorites to cloud
- [ ] Premium tools
- [ ] API access
- [ ] Usage analytics

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
