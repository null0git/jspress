"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Type, Heading2, ImageIcon, Square, List, CarIcon as CardIcon, Plus, Code, Zap, GitBranch } from "lucide-react"
import type { BlockType } from "@/lib/page-builder-types"

interface ElementsToolbarProps {
  onAddElement: (type: BlockType) => void
}

const ELEMENT_GROUPS = [
  {
    title: "Basic",
    elements: [
      { type: "heading" as BlockType, label: "Heading", icon: Heading2 },
      { type: "text" as BlockType, label: "Text", icon: Type },
      { type: "button" as BlockType, label: "Button", icon: Plus },
      { type: "image" as BlockType, label: "Image", icon: ImageIcon },
    ],
  },
  {
    title: "Layouts",
    elements: [
      { type: "container" as BlockType, label: "Container", icon: Square },
      { type: "card" as BlockType, label: "Card", icon: CardIcon },
    ],
  },
  {
    title: "Data",
    elements: [
      { type: "list" as BlockType, label: "List", icon: List },
      { type: "api-data" as BlockType, label: "API Data", icon: Zap },
      { type: "loop" as BlockType, label: "Loop", icon: GitBranch },
    ],
  },
  {
    title: "Advanced",
    elements: [
      { type: "conditional" as BlockType, label: "Conditional", icon: GitBranch },
      { type: "code-snippet" as BlockType, label: "Code", icon: Code },
      { type: "custom-component" as BlockType, label: "Component", icon: Plus },
    ],
  },
]

export function ElementsToolbar({ onAddElement }: ElementsToolbarProps) {
  return (
    <div className="w-72 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto">
      <div className="p-4 space-y-4">
        {ELEMENT_GROUPS.map((group) => (
          <Card key={group.title} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.elements.map((element) => {
                const Icon = element.icon
                return (
                  <Button
                    key={element.type}
                    variant="outline"
                    className="w-full justify-start gap-2 bg-transparent"
                    onClick={() => onAddElement(element.type)}
                  >
                    <Icon className="w-4 h-4" />
                    {element.label}
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
