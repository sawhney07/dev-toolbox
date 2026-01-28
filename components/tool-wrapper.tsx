"use client"

import React from "react"

import { useEffect } from "react"
import { Star, Copy, Check } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Tool, getCategoryById } from "@/lib/tools-config"
import { useFavorites, useRecentTools } from "@/hooks/use-favorites"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ToolWrapperProps {
  tool: Tool
  children: React.ReactNode
}

export function ToolWrapper({ tool, children }: ToolWrapperProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addRecent } = useRecentTools()
  const category = getCategoryById(tool.category)
  const favorite = isFavorite(tool.id)

  useEffect(() => {
    addRecent(tool.id)
  }, [tool.id, addRecent])

  return (
    <>
      <AppHeader
        category={category?.name}
        toolName={tool.name}
      />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl mx-auto p-6 md:p-8">
          {/* Tool Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className={cn("flex size-12 items-center justify-center rounded-lg", category?.color || "bg-muted")}>
                <tool.icon className="size-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{tool.name}</h1>
                  {tool.isNew && (
                    <Badge variant="secondary">NEW</Badge>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{tool.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(tool.id)}
              className={cn(
                "shrink-0",
                favorite && "text-amber-500 hover:text-amber-600"
              )}
            >
              <Star className={cn("size-5", favorite && "fill-current")} />
              <span className="sr-only">
                {favorite ? "Remove from favorites" : "Add to favorites"}
              </span>
            </Button>
          </div>

          {/* Tool Content */}
          <Card>
            <CardContent className="p-6">
              {children}
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            This tool runs entirely in your browser. No data is sent to any server.
          </p>
        </div>
      </main>
    </>
  )
}

// Reusable copy button component
export function CopyButton({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copy}
      className={cn("size-8", className)}
      disabled={!value}
    >
      {copied ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <Copy className="size-4" />
      )}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  )
}

// Reusable output area component
export function OutputArea({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <CopyButton value={value} />
      </div>
      <div className="relative">
        <pre className="p-4 rounded-lg bg-muted text-sm overflow-auto max-h-64 font-mono whitespace-pre-wrap break-all">
          {value || <span className="text-muted-foreground">Output will appear here...</span>}
        </pre>
      </div>
    </div>
  )
}
