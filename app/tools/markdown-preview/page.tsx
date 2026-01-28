"use client"

import { useState, useMemo } from "react"
import { FileText, Eye, Code } from "lucide-react"

import { getToolById } from "@/lib/tools-config"
import { ToolWrapper, CopyButton } from "@/components/tool-wrapper"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tool = getToolById("markdown-preview")!

// Simple Markdown parser (client-side only, no external dependencies)
function parseMarkdown(markdown: string): string {
  let html = markdown
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    
    // Code blocks (``` code ```)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>$2</code></pre>')
    
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    
    // Headers
    .replace(/^###### (.+)$/gm, '<h6 class="text-base font-semibold mt-4 mb-2">$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5 class="text-lg font-semibold mt-4 mb-2">$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4 class="text-xl font-semibold mt-5 mb-2">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mt-8 mb-4 pb-2 border-b">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mt-8 mb-4">$1</h1>')
    
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del class="text-muted-foreground">$1</del>')
    
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">$1</blockquote>')
    
    // Horizontal rule
    .replace(/^(---|\*\*\*|___)$/gm, '<hr class="my-6 border-t border-border" />')
    
    // Unordered lists
    .replace(/^[\-\*] (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
    
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline underline-offset-4 hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
    
    // Line breaks (double newline = paragraph)
    .replace(/\n\n/g, '</p><p class="my-4">')
    
    // Single line breaks
    .replace(/\n/g, '<br />')

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<')) {
    html = `<p class="my-4">${html}</p>`
  }

  return html
}

const defaultMarkdown = `# Welcome to Markdown Preview

This is a **live preview** of your Markdown content. Start typing on the left!

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~ text
- \`inline code\` blocks

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

- Bullet point
- Another point

### Blockquotes

> This is a blockquote. Great for highlighting important information.

### Links and Images

[Visit GitHub](https://github.com)

---

*Start editing to see changes in real-time!*
`

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState(defaultMarkdown)
  const [view, setView] = useState<"split" | "preview" | "source">("split")

  const renderedHtml = useMemo(() => parseMarkdown(input), [input])

  return (
    <ToolWrapper tool={tool}>
      <div className="space-y-4">
        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="w-auto">
            <TabsList>
              <TabsTrigger value="split" className="gap-2">
                <FileText className="size-4" />
                Split
              </TabsTrigger>
              <TabsTrigger value="source" className="gap-2">
                <Code className="size-4" />
                Source
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="size-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <CopyButton value={input} label="Copy Markdown" />
        </div>

        {/* Editor */}
        <div className={`grid gap-4 ${view === "split" ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {/* Source */}
          {(view === "split" || view === "source") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Markdown Source</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your Markdown here..."
                className="font-mono text-sm min-h-[500px] resize-none"
              />
            </div>
          )}

          {/* Preview */}
          {(view === "split" || view === "preview") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview</label>
              <div
                className="p-4 rounded-lg border bg-card min-h-[500px] overflow-auto prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>{input.length} characters</span>
          <span>{input.trim() ? input.trim().split(/\s+/).length : 0} words</span>
          <span>{input.split("\n").length} lines</span>
        </div>
      </div>
    </ToolWrapper>
  )
}
