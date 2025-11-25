"use client"

import { useState, useCallback } from "react"
import type { BlockElement, BlockType } from "@/lib/page-builder-types"
import { generateBlockId } from "@/lib/page-builder-utils"
import { EditorCanvas } from "@/components/page-builder/editor-canvas"
import { ElementsToolbar } from "@/components/page-builder/elements-toolbar"
import { ElementInspector } from "@/components/page-builder/element-inspector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PageBuilderPage() {
  const [elements, setElements] = useState<BlockElement[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [pageTitle, setPageTitle] = useState("Untitled Page")
  const [pageSlug, setPageSlug] = useState("untitled-page")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const selectedElement = elements.find((e) => e.id === selectedElementId) || null

  const handleAddElement = useCallback((type: BlockType) => {
    const newElement: BlockElement = {
      id: generateBlockId(),
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      props: {
        text: type === "heading" ? "New Heading" : type === "button" ? "Click me" : "New " + type,
      },
      styles: {
        padding: "16px",
        margin: "8px 0",
      },
    }
    setElements([...elements, newElement])
  }, [])

  const handleElementUpdate = useCallback(
    (updatedElement: BlockElement) => {
      setElements(elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)))
    },
    [elements],
  )

  const handleSavePage = async () => {
    try {
      setIsSaving(true)
      const response = await fetch("/api/admin/page-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `page-${Date.now()}`,
          title: pageTitle,
          slug: pageSlug,
          elements,
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: "current-user",
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to save page")

      toast({
        title: "Success",
        description: "Page saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Input
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Page Title"
              className="text-lg font-bold"
            />
            <Input
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              placeholder="page-slug"
              className="text-sm text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSavePage} disabled={isSaving} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Page
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ElementsToolbar onAddElement={handleAddElement} />
        <EditorCanvas
          elements={elements}
          onElementsChange={setElements}
          onElementSelect={setSelectedElementId}
          selectedElementId={selectedElementId}
        />
        <ElementInspector element={selectedElement} onUpdate={handleElementUpdate} />
      </div>
    </div>
  )
}
