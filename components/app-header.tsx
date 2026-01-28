"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface AppHeaderProps {
  category?: string
  toolName?: string
}

export function AppHeader({ category, toolName }: AppHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {toolName ? (
                  <BreadcrumbLink href={`/#${category.toLowerCase().replace(/\s+/g, "-")}`}>
                    {category}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{category}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {toolName && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{toolName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  )
}
