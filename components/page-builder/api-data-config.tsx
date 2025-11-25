"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { ApiDataSource, ApiField } from "@/lib/page-builder-types"
import { extractDataFields } from "@/lib/page-builder-utils"
import { Zap, Loader2 } from "lucide-react"

interface ApiDataConfigProps {
  onSourceCreate: (source: ApiDataSource) => void
}

export function ApiDataConfig({ onSourceCreate }: ApiDataConfigProps) {
  const [url, setUrl] = useState("")
  const [method, setMethod] = useState<"GET" | "POST">("GET")
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")
  const [dataPath, setDataPath] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)
  const [fields, setFields] = useState<ApiField[]>([])

  const handleTestConnection = async () => {
    if (!url) return

    try {
      setIsLoading(true)
      const headerObj = headers ? JSON.parse(headers) : {}
      const bodyObj = body ? JSON.parse(body) : undefined

      const response = await fetch(url, {
        method,
        headers: headerObj,
        body: bodyObj ? JSON.stringify(bodyObj) : undefined,
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()
      const actualData = dataPath ? getNestedValue(data, dataPath) : data

      setPreviewData(actualData)

      const fieldList = extractDataFields(actualData)
      setFields(
        fieldList.map((name) => ({
          name,
          type: "string",
          displayName: name,
        })),
      )
    } catch (error: any) {
      setPreviewData({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSource = () => {
    if (!url) return

    const source: ApiDataSource = {
      id: `api-${Date.now()}`,
      name: url.split("/").pop() || "API Source",
      url,
      method,
      headers: headers ? JSON.parse(headers) : undefined,
      body: body ? JSON.parse(body) : undefined,
      dataPath,
      fields,
    }

    onSourceCreate(source)
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          API Data Source
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="setup">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div>
              <Label>API URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Method</Label>
                <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Data Path (optional)</Label>
                <Input
                  value={dataPath}
                  onChange={(e) => setDataPath(e.target.value)}
                  placeholder="data.results"
                  className="text-sm"
                />
              </div>
            </div>

            {method === "POST" && (
              <div>
                <Label>Request Body (JSON)</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="text-xs font-mono"
                  rows={4}
                />
              </div>
            )}

            <div>
              <Label>Headers (JSON, optional)</Label>
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                placeholder='{"Authorization": "Bearer token"}'
                className="text-xs font-mono"
                rows={3}
              />
            </div>

            <Button onClick={handleTestConnection} disabled={isLoading || !url} className="w-full">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Test Connection
            </Button>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            {previewData ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded text-xs font-mono overflow-auto max-h-96">
                <pre>{JSON.stringify(previewData, null, 2)}</pre>
              </div>
            ) : (
              <p className="text-sm text-slate-400">No preview data. Test the connection first.</p>
            )}
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            {fields.length > 0 ? (
              <div className="space-y-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className="p-3 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-mono">{field.name}</p>
                      <p className="text-xs text-slate-400">{field.type}</p>
                    </div>
                    <Badge variant="outline">{field.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No fields detected. Check your data path.</p>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={handleSaveSource} className="w-full">
          Create Data Source
        </Button>
      </CardContent>
    </Card>
  )
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj)
}
