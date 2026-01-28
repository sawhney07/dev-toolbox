"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Star,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { categories, tools, getToolsByCategory } from "@/lib/tools-config"
import { useFavorites, useRecentTools } from "@/hooks/use-favorites"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState("")
  const { favorites, isLoaded: favoritesLoaded } = useFavorites()
  const { recent, isLoaded: recentLoaded } = useRecentTools()

  const favoriteTools = React.useMemo(
    () => tools.filter((tool) => favorites.includes(tool.id)),
    [favorites]
  )

  const recentTools = React.useMemo(
    () =>
      recent
        .map((id) => tools.find((t) => t.id === id))
        .filter(Boolean) as typeof tools,
    [recent]
  )

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories
    const query = searchQuery.toLowerCase()
    return categories.filter((cat) => {
      const categoryTools = getToolsByCategory(cat.id)
      return (
        cat.name.toLowerCase().includes(query) ||
        categoryTools.some(
          (tool) =>
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query)
        )
      )
    })
  }, [searchQuery])

  const getFilteredTools = React.useCallback(
    (categoryId: string) => {
      const categoryTools = getToolsByCategory(categoryId)
      if (!searchQuery) return categoryTools
      const query = searchQuery.toLowerCase()
      return categoryTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      )
    },
    [searchQuery]
  )

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-mono text-sm font-bold">uH</span>
          </div>
          <span className="text-lg font-semibold">utilityHood</span>
        </Link>
        <div className="relative px-2">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Home */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Home className="size-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Favorites */}
        {favoritesLoaded && favoriteTools.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <Star className="size-4 mr-2" />
              Favorites
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favoriteTools.map((tool) => (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === tool.path}
                    >
                      <Link href={tool.path}>
                        <tool.icon className="size-4" />
                        <span>{tool.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Recent */}
        {recentLoaded && recentTools.length > 0 && !searchQuery && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <Clock className="size-4 mr-2" />
              Recent
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentTools.slice(0, 5).map((tool) => (
                  <SidebarMenuItem key={tool.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === tool.path}
                    >
                      <Link href={tool.path}>
                        <tool.icon className="size-4" />
                        <span>{tool.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredCategories.map((category) => {
                const categoryTools = getFilteredTools(category.id)
                const isExpanded =
                  searchQuery ||
                  categoryTools.some((tool) => pathname === tool.path)

                return (
                  <Collapsible
                    key={category.id}
                    asChild
                    defaultOpen={isExpanded}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={category.name}>
                          <category.icon className="size-4" />
                          <span>{category.name}</span>
                          <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {categoryTools.map((tool) => (
                            <SidebarMenuSubItem key={tool.id}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === tool.path}
                              >
                                <Link href={tool.path}>
                                  <tool.icon className="size-4" />
                                  <span>{tool.name}</span>
                                  {tool.isNew && (
                                    <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                      NEW
                                    </span>
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
