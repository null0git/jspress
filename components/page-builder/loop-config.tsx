"use client"

import React from "react"
import type { BlockElement, LoopConfig } from "@/lib/page-builder-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { GitBranch } from "lucide-react"

interface LoopConfigProps {
  element: BlockElement
  onUpdate: (config: LoopConfig | undefined) => void
}

export function LoopConfiguration({ element, onUpdate }: LoopConfigProps) {
  const [enabled, setEnabled] = React.useState(!!element.loop)
  const [dataSource, setDataSource] = React.useState(element.loop?.dataSource || "")
  const [itemVar, setItemVar] = React.useState(element.loop?.itemVar || "item")
  const [keyField, setKeyField] = React.useState(element.loop?.keyField || "")

  const handleSave = () => {
    if (enabled && dataSource && itemVar) {
      onUpdate({
        dataSource,
        itemVar,
        keyField: keyField || undefined,
      })
    } else {
      onUpdate(undefined)
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Loop Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Label className="text-sm">Enable Loop</Label>
        </div>

        {enabled && (
          <>
            <div>
              <Label className="text-xs">Data Source (path to array)</Label>
              <Input
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
                placeholder="data.items or items"
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Item Variable Name</Label>
              <Input
                value={itemVar}
                onChange={(e) => setItemVar(e.target.value)}
                placeholder="item"
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Key Field (for React keys)</Label>
              <Input
                value={keyField}
                onChange={(e) => setKeyField(e.target.value)}
                placeholder="id"
                className="text-sm"
              />
            </div>

            <p className="text-xs text-slate-400">Use {"{item.fieldName}"} in text to reference loop variables</p>

            <Button onClick={handleSave} className="w-full">
              Save Loop
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
