"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarNavProps {
  items: Array<{
    href: string
    label: string
    icon: React.ReactNode
  }>
  collapsed?: boolean
}

export function SidebarNav({ items, collapsed = false }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
            pathname.startsWith(item.href)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-muted-foreground",
          )}
        >
          {item.icon}
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  )
}
