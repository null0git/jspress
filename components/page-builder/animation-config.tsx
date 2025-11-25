"use client"

import React from "react"
import type { BlockElement, AnimationConfig } from "@/lib/page-builder-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Play } from "lucide-react"

interface AnimationConfigProps {
  element: BlockElement
  onUpdate: (animations: AnimationConfig[]) => void
}

const ANIMATION_TYPES = ["fade", "slide", "scale", "rotate", "bounce", "pulse"]
const EASING_TYPES = ["ease", "linear", "ease-in", "ease-out", "ease-in-out"]

export function AnimationConfiguration({ element, onUpdate }: AnimationConfigProps) {
  const [animations, setAnimations] = React.useState<AnimationConfig[]>(element.animations || [])
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

  const addAnimation = () => {
    const newAnim: AnimationConfig = {
      type: "fade",
      duration: 300,
      delay: 0,
      easing: "ease",
      iteration: "once",
    }
    setAnimations([...animations, newAnim])
  }

  const removeAnimation = (index: number) => {
    setAnimations(animations.filter((_, i) => i !== index))
  }

  const updateAnimation = (index: number, field: keyof AnimationConfig, value: any) => {
    const updated = [...animations]
    updated[index] = { ...updated[index], [field]: value }
    setAnimations(updated)
  }

  const handleSave = () => {
    onUpdate(animations)
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-4 h-4" />
          Animations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {animations.length === 0 ? (
            <p className="text-sm text-slate-400">No animations added</p>
          ) : (
            animations.map((anim, idx) => (
              <Card
                key={idx}
                className={`p-3 cursor-pointer transition-colors ${
                  selectedIndex === idx
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400"
                    : "bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{anim.type}</Badge>
                    <span className="text-xs text-slate-400">{anim.duration}ms</span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeAnimation(idx)
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {selectedIndex === idx && (
                  <div className="space-y-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select value={anim.type} onValueChange={(v) => updateAnimation(idx, "type", v as any)}>
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ANIMATION_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Duration (ms)</Label>
                      <Slider
                        value={[anim.duration]}
                        onValueChange={(v) => updateAnimation(idx, "duration", v[0])}
                        min={100}
                        max={2000}
                        step={100}
                      />
                      <span className="text-xs text-slate-400">{anim.duration}ms</span>
                    </div>

                    <div>
                      <Label className="text-xs">Delay (ms)</Label>
                      <Slider
                        value={[anim.delay || 0]}
                        onValueChange={(v) => updateAnimation(idx, "delay", v[0])}
                        min={0}
                        max={1000}
                        step={50}
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Easing</Label>
                      <Select
                        value={anim.easing || "ease"}
                        onValueChange={(v) => updateAnimation(idx, "easing", v as any)}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EASING_TYPES.map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Iteration</Label>
                      <Select
                        value={anim.iteration || "once"}
                        onValueChange={(v) => updateAnimation(idx, "iteration", v as any)}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">Play Once</SelectItem>
                          <SelectItem value="infinite">Loop Infinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        <Button onClick={addAnimation} variant="outline" className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add Animation
        </Button>

        <Button onClick={handleSave} className="w-full">
          Save Animations
        </Button>
      </CardContent>
    </Card>
  )
}
