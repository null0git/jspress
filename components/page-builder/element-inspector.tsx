"use client"
import type { BlockElement, StyleConfig } from "@/lib/page-builder-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ElementInspectorProps {
  element: BlockElement | null
  onUpdate: (element: BlockElement) => void
}

export function ElementInspector({ element, onUpdate }: ElementInspectorProps) {
  if (!element) {
    return (
      <div className="w-96 bg-slate-100 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Select an element to inspect</p>
      </div>
    )
  }

  const updateProps = (key: string, value: any) => {
    onUpdate({
      ...element,
      props: {
        ...element.props,
        [key]: value,
      },
    })
  }

  const updateStyles = (key: keyof StyleConfig, value: any) => {
    onUpdate({
      ...element,
      styles: {
        ...element.styles,
        [key]: value,
      },
    })
  }

  return (
    <div className="w-96 bg-slate-100 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
      <Tabs defaultValue="properties" className="w-full">
        <TabsList className="w-full rounded-none">
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">
            Styles
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1">
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="p-4 space-y-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Element: {element.type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Label</Label>
                <Input
                  value={element.label}
                  onChange={(e) => onUpdate({ ...element, label: e.target.value })}
                  className="text-sm"
                />
              </div>
              {element.type === "text" || element.type === "heading" ? (
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    value={element.props.text || ""}
                    onChange={(e) => updateProps("text", e.target.value)}
                    className="text-sm"
                  />
                </div>
              ) : null}
              {element.type === "button" ? (
                <div>
                  <Label className="text-xs">Button Text</Label>
                  <Input
                    value={element.props.text || ""}
                    onChange={(e) => updateProps("text", e.target.value)}
                    className="text-sm"
                  />
                </div>
              ) : null}
              {element.type === "image" ? (
                <div>
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={element.props.src || ""}
                    onChange={(e) => updateProps("src", e.target.value)}
                    className="text-sm"
                    placeholder="/placeholder.svg"
                  />
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styles" className="p-4 space-y-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Styling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    value={element.styles?.width || ""}
                    onChange={(e) => updateStyles("width", e.target.value)}
                    className="text-sm"
                    placeholder="100%"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    value={element.styles?.height || ""}
                    onChange={(e) => updateStyles("height", e.target.value)}
                    className="text-sm"
                    placeholder="auto"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Background Color</Label>
                <Input
                  type="color"
                  value={element.styles?.backgroundColor || "#ffffff"}
                  onChange={(e) => updateStyles("backgroundColor", e.target.value)}
                  className="h-10"
                />
              </div>
              <div>
                <Label className="text-xs">Text Color</Label>
                <Input
                  type="color"
                  value={element.styles?.color || "#000000"}
                  onChange={(e) => updateStyles("color", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Padding</Label>
                  <Input
                    value={element.styles?.padding || ""}
                    onChange={(e) => updateStyles("padding", e.target.value)}
                    className="text-sm"
                    placeholder="16px"
                  />
                </div>
                <div>
                  <Label className="text-xs">Margin</Label>
                  <Input
                    value={element.styles?.margin || ""}
                    onChange={(e) => updateStyles("margin", e.target.value)}
                    className="text-sm"
                    placeholder="16px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="p-4 space-y-4">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Advanced Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Custom CSS Class</Label>
                <Input
                  value={element.props.className || ""}
                  onChange={(e) => updateProps("className", e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Custom ID</Label>
                <Input
                  value={element.props.id || ""}
                  onChange={(e) => updateProps("id", e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Data Attribute (JSON)</Label>
                <Textarea
                  value={JSON.stringify(element.props.data || {})}
                  onChange={(e) => {
                    try {
                      updateProps("data", JSON.parse(e.target.value))
                    } catch {}
                  }}
                  className="text-sm font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
