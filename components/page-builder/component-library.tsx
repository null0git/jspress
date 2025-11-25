"use client"

import React from "react"
import type { SavedComponent } from "@/lib/page-builder-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Layers, Download } from "lucide-react"

interface ComponentLibraryProps {
  onSaveComponent: (component: SavedComponent) => void
  existingComponents?: SavedComponent[]
  onUseComponent?: (component: SavedComponent) => void
}

const CATEGORIES = ["Headers", "Forms", "Cards", "Layouts", "Navigation", "Buttons", "Custom"]

export function ComponentLibrary({ onSaveComponent, existingComponents = [], onUseComponent }: ComponentLibraryProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("Custom")
  const [tags, setTags] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  const filteredComponents =
    selectedCategory === "All" ? existingComponents : existingComponents.filter((c) => c.category === selectedCategory)

  const handleSaveComponent = () => {
    if (!name) return

    const component: SavedComponent = {
      id: `comp-${Date.now()}`,
      name,
      description: description || undefined,
      category,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      elements: [], // Would be populated with actual elements
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSaveComponent(component)
    setName("")
    setDescription("")
    setTags("")
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Component Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="browse">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="save">Save New</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <div>
              <Label className="text-xs">Filter by Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Components</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {filteredComponents.length === 0 ? (
                <p className="text-sm text-slate-400">No components in this category</p>
              ) : (
                filteredComponents.map((component) => (
                  <Card
                    key={component.id}
                    className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{component.name}</p>
                        <p className="text-xs text-slate-400">{component.description}</p>
                      </div>
                      <Badge variant="outline">{component.category}</Badge>
                    </div>
                    {component.tags && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {component.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {onUseComponent && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => onUseComponent(component)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Use Component
                      </Button>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="save" className="space-y-4">
            <div>
              <Label className="text-xs">Component Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Card"
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this reusable component"
                className="text-sm"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Tags</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="product, ecommerce"
                  className="text-sm"
                />
              </div>
            </div>

            <Button onClick={handleSaveComponent} className="w-full">
              <Layers className="w-4 h-4 mr-2" />
              Save Component
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
