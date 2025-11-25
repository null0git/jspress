"use client"

import type React from "react"
import { useState } from "react"
import type { BlockElement } from "@/lib/page-builder-types"
import { cloneElement } from "@/lib/page-builder-utils"
import { EditorElement } from "./editor-element"
import { Button } from "@/components/ui/button"
import { Trash2, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditorCanvasProps {
  elements: BlockElement[]
  onElementsChange: (elements: BlockElement[]) => void
  onElementSelect: (elementId: string | null) => void
  selectedElementId: string | null
}

export function EditorCanvas({ elements, onElementsChange, onElementSelect, selectedElementId }: EditorCanvasProps) {
  const [draggedItem, setDraggedItem] = useState<any>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, element: BlockElement) => {
    setDraggedItem(element)
    e.dataTransfer!.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer!.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetId: string | null) => {
    e.preventDefault()
    if (!draggedItem) return

    const newElements = [...elements]

    if (targetId) {
      const updateElements = (els: BlockElement[]): BlockElement[] =>
        els.map((el) => {
          if (el.id === targetId) {
            return {
              ...el,
              children: [...(el.children || []), cloneElement(draggedItem)],
            }
          }
          if (el.children) {
            return { ...el, children: updateElements(el.children) }
          }
          return el
        })

      onElementsChange(updateElements(newElements))
    }
    setDraggedItem(null)
    setDragOverId(null)
  }

  const handleDeleteElement = (id: string) => {
    const removeElement = (els: BlockElement[]): BlockElement[] =>
      els
        .filter((el) => el.id !== id)
        .map((el) => ({
          ...el,
          children: el.children ? removeElement(el.children) : undefined,
        }))

    onElementsChange(removeElement(elements))
    onElementSelect(null)
  }

  const handleDuplicateElement = (element: BlockElement) => {
    onElementsChange([...elements, cloneElement(element)])
  }

  return (
    <div className="flex-1 p-6 bg-slate-50 dark:bg-slate-950 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 min-h-screen border-2 border-dashed border-slate-200 dark:border-slate-700">
          {elements.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg mb-2">Drag components here to start building</p>
              <p className="text-sm">or select from the toolbar on the left</p>
            </div>
          ) : (
            <div className="space-y-4">
              {elements.map((element) => (
                <div
                  key={element.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, element.id)}
                  className={cn(
                    "relative group",
                    selectedElementId === element.id && "ring-2 ring-blue-500 rounded-lg",
                  )}
                  onClick={() => onElementSelect(element.id)}
                >
                  <EditorElement element={element} />

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicateElement(element)
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteElement(element.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
