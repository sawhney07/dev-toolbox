"use client"

import React from "react"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { categories, getToolsByCategory } from "@/lib/tools-config"
import { useFavorites, useRecentTools } from "@/hooks/use-favorites"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"

function ToolCard({
  tool,
  isFavorite,
}: {
  tool: {
    id: string
    name: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    path: string
    isNew?: boolean
  }
  isFavorite: boolean
}) {
  return (
    <Link href={tool.path} className="group">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 bg-card">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <tool.icon className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-center gap-1">
              {tool.isNew && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  NEW
                </Badge>
              )}
              {isFavorite && (
                <Sparkles className="size-4 text-amber-500" />
              )}
            </div>
          </div>
          <CardTitle className="text-base group-hover:text-primary transition-colors">
            {tool.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm leading-relaxed">
            {tool.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}

function CategorySection({
  category,
  favorites,
}: {
  category: (typeof categories)[0]
  favorites: string[]
}) {
  const tools = getToolsByCategory(category.id)

  return (
    <section id={category.id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("flex size-10 items-center justify-center rounded-lg", category.color)}>
          <category.icon className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{category.name}</h2>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorite={favorites.includes(tool.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  const { favorites, isLoaded: favoritesLoaded } = useFavorites()
  const { recent, isLoaded: recentLoaded } = useRecentTools()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
            {/* Hero Section */}
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
                Developer Utility Tools
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
                A comprehensive collection of free online tools for developers. 
                Format JSON, encode Base64, generate hashes, and much more.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-10">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Tools</CardDescription>
                  <CardTitle className="text-2xl">16</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Categories</CardDescription>
                  <CardTitle className="text-2xl">{categories.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Favorites</CardDescription>
                  <CardTitle className="text-2xl">
                    {favoritesLoaded ? favorites.length : "-"}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Recently Used</CardDescription>
                  <CardTitle className="text-2xl">
                    {recentLoaded ? recent.length : "-"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Category Sections */}
            <div className="space-y-12">
              {categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  favorites={favorites}
                />
              ))}
            </div>

            {/* Footer Note */}
            <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
              <p>
                All tools run locally in your browser. Your data never leaves your device.
              </p>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
