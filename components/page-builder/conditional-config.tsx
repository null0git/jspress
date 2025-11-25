"use client"

import React from "react"
import type { BlockElement, ConditionalConfig } from "@/lib/page-builder-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AlertCircle } from "lucide-react"

interface ConditionalConfigProps {
  element: BlockElement
  onUpdate: (config: ConditionalConfig | undefined) => void
}

const OPERATORS = ["equals", "notEquals", "greaterThan", "lessThan", "contains", "exists"]

export function ConditionalConfigComponent({ element, onUpdate }: ConditionalConfigProps) {
  const [enabled, setEnabled] = React.useState(!!element.conditions)
  const [field, setField] = React.useState(element.conditions?.field || "")
  const [operator, setOperator] = React.useState(element.conditions?.operator || "equals")
  const [value, setValue] = React.useState(element.conditions?.value || "")
  const [showElement, setShowElement] = React.useState(element.conditions?.showElement ?? true)

  const handleSave = () => {
    if (enabled && field && operator) {
      onUpdate({
        field,
        operator: operator as any,
        value: operator === "exists" ? undefined : value,
        showElement,
      })
    } else {
      onUpdate(undefined)
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Conditional Display
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Label className="text-sm">Enable Conditional Display</Label>
        </div>

        {enabled && (
          <>
            <div>
              <Label className="text-xs">Field Name</Label>
              <Input
                value={field}
                onChange={(e) => setField(e.target.value)}
                placeholder="user.isAdmin"
                className="text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Operator</Label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map((op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {operator !== "exists" && (
              <div>
                <Label className="text-xs">Value</Label>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="true"
                  className="text-sm"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch checked={showElement} onCheckedChange={setShowElement} />
              <Label className="text-xs">Show when condition is {showElement ? "true" : "false"}</Label>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Condition
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
