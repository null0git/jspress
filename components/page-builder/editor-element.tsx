"use client"

import type React from "react"
import type { BlockElement } from "@/lib/page-builder-types"
import { styleObjectToString } from "@/lib/page-builder-utils"

interface EditorElementProps {
  element: BlockElement
}

export function EditorElement({ element }: EditorElementProps) {
  const baseStyles = element.styles ? styleObjectToString(element.styles) : ""

  const renderElement = (): React.ReactNode => {
    switch (element.type) {
      case "heading":
        return (
          <h2 style={element.styles} className="mb-4">
            {element.props.text || "Heading"}
          </h2>
        )
      case "text":
        return (
          <p style={element.styles} className="mb-2">
            {element.props.text || "Text content"}
          </p>
        )
      case "button":
        return (
          <button
            style={element.styles}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={(e) => e.stopPropagation()}
          >
            {element.props.text || "Button"}
          </button>
        )
      case "image":
        return (
          <img
            src={element.props.src || "/placeholder.svg"}
            alt={element.props.alt || "Image"}
            style={element.styles}
            className="rounded"
          />
        )
      case "container":
        return (
          <div style={element.styles} className="p-4 border rounded bg-slate-100 dark:bg-slate-800">
            {element.children && element.children.length > 0 ? (
              element.children.map((child) => <EditorElement key={child.id} element={child} />)
            ) : (
              <p className="text-slate-400 text-sm">Drop elements here</p>
            )}
          </div>
        )
      default:
        return <div style={element.styles}>{element.label}</div>
    }
  }

  return (
    <div
      draggable
      onDragStart={(e) => e.stopPropagation()}
      className="p-2 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors"
    >
      {renderElement()}
    </div>
  )
}
