"use client"
import type { BlockElement, ApiField } from "@/lib/page-builder-types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface FieldMapperProps {
  element: BlockElement
  fields: ApiField[]
  onMapField: (elementProp: string, apiField: string) => void
}

export function FieldMapper({ element, fields, onMapField }: FieldMapperProps) {
  const propsToMap = Object.keys(element.props).filter((k) => !["className", "id"].includes(k))

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-sm">Map API Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {propsToMap.length === 0 ? (
          <p className="text-sm text-slate-400">No properties to map</p>
        ) : (
          propsToMap.map((prop) => (
            <div key={prop} className="space-y-2">
              <Label className="text-xs font-mono">{prop}</Label>
              <Select onValueChange={(value) => onMapField(prop, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field..." />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.name} value={field.name}>
                      {field.displayName} <Badge className="ml-2">{field.type}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
