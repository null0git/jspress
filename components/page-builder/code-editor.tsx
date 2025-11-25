"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { CodeSnippet } from "@/lib/page-builder-types"
import { Code2, Save } from "lucide-react"

interface CodeEditorProps {
  onSaveSnippet: (snippet: CodeSnippet) => void
  existingSnippets?: CodeSnippet[]
}

export function CodeEditor({ onSaveSnippet, existingSnippets = [] }: CodeEditorProps) {
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState<"javascript" | "html" | "css" | "jsx">("javascript")
  const [code, setCode] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [tags, setTags] = React.useState("")

  const handleSave = () => {
    if (!name || !code) return

    const snippet: CodeSnippet = {
      id: `snippet-${Date.now()}`,
      name,
      type,
      code,
      description: description || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSaveSnippet(snippet)
    setName("")
    setCode("")
    setDescription("")
    setTags("")
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code2 className="w-4 h-4" />
          Code Snippets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="library">Snippet Library</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div>
              <Label className="text-xs">Snippet Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Custom Button"
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Code Type</Label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="jsx">JSX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Tags</Label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="button, ui, custom"
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this snippet does"
                className="text-sm"
                rows={2}
              />
            </div>

            <div>
              <Label className="text-xs">Code</Label>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Your code here..."
                className="text-xs font-mono bg-slate-50 dark:bg-slate-900"
                rows={10}
              />
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Snippet
            </Button>
          </TabsContent>

          <TabsContent value="library" className="space-y-3">
            {existingSnippets.length === 0 ? (
              <p className="text-sm text-slate-400">No snippets saved yet</p>
            ) : (
              existingSnippets.map((snippet) => (
                <Card key={snippet.id} className="p-3 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-sm font-semibold">{snippet.name}</p>
                      <p className="text-xs text-slate-400">{snippet.description}</p>
                    </div>
                    <Badge variant="outline">{snippet.type}</Badge>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-mono overflow-auto max-h-20 mb-2">
                    {snippet.code}
                  </div>
                  {snippet.tags && (
                    <div className="flex flex-wrap gap-1">
                      {snippet.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
