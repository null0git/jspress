"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, Code, Eye } from "lucide-react"

interface AdvancedEditorProps {
  onAddCustomCSS?: (css: string) => void
  onAddCustomJS?: (js: string) => void
}

export function AdvancedEditor({ onAddCustomCSS, onAddCustomJS }: AdvancedEditorProps) {
  const [customCSS, setCustomCSS] = React.useState("")
  const [customJS, setCustomJS] = React.useState("")
  const [globalCSS, setGlobalCSS] = React.useState(false)
  const [enablePreview, setEnablePreview] = React.useState(false)

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Advanced Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="css">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="css">Custom CSS</TabsTrigger>
            <TabsTrigger value="js">Custom JavaScript</TabsTrigger>
          </TabsList>

          <TabsContent value="css" className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox id="global-css" checked={globalCSS} onCheckedChange={setGlobalCSS} />
              <Label htmlFor="global-css" className="text-sm">
                Apply as global CSS
              </Label>
            </div>

            <div>
              <Label className="text-xs">CSS Code</Label>
              <Textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder={`/* Example: Custom styles */
.custom-element {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}`}
                className="text-xs font-mono bg-slate-50 dark:bg-slate-900 h-48"
              />
            </div>

            <Button onClick={() => onAddCustomCSS?.(customCSS)} className="w-full">
              <Code className="w-4 h-4 mr-2" />
              Apply CSS
            </Button>
          </TabsContent>

          <TabsContent value="js" className="space-y-4">
            <div>
              <Label className="text-xs">JavaScript Code</Label>
              <Textarea
                value={customJS}
                onChange={(e) => setCustomJS(e.target.value)}
                placeholder={`/* Example: Custom interactions */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('[data-animate]');
  elements.forEach(el => {
    el.addEventListener('click', function() {
      this.classList.toggle('active');
    });
  });
});`}
                className="text-xs font-mono bg-slate-50 dark:bg-slate-900 h-48"
              />
            </div>

            <Button onClick={() => onAddCustomJS?.(customJS)} className="w-full">
              <Code className="w-4 h-4 mr-2" />
              Execute JavaScript
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Checkbox id="enable-preview" checked={enablePreview} onCheckedChange={setEnablePreview} />
          <Label htmlFor="enable-preview" className="text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Live Preview
          </Label>
        </div>
      </CardContent>
    </Card>
  )
}
