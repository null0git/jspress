"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check } from "lucide-react"
import AdminLayout from "@/components/admin/layout"

interface ThemeConfig {
  id: string
  name: string
  description: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
}

export default function EditThemePage() {
  const router = useRouter()
  const params = useParams()
  const themeId = params.id as string

  const [theme, setTheme] = useState<ThemeConfig | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [secondaryColor, setSecondaryColor] = useState("#1f2937")
  const [fontFamily, setFontFamily] = useState("sans-serif")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Load default theme for now
    if (themeId === "1") {
      setTheme({
        id: "1",
        name: "Default Theme",
        description: "Clean and minimal theme",
        primaryColor: "#3b82f6",
        secondaryColor: "#1f2937",
        fontFamily: "sans-serif",
      })
      setName("Default Theme")
      setDescription("Clean and minimal theme")
      setPrimaryColor("#3b82f6")
      setSecondaryColor("#1f2937")
      setFontFamily("sans-serif")
    }
    setLoading(false)
  }, [themeId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // In production, save to database
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Theme</h1>
          <p className="text-muted-foreground">Customize your theme appearance</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-700 p-4 rounded-lg flex gap-2">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            Theme saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Theme Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Theme name"
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Theme description"
                    className="mt-2"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Colors</h3>

                  <div>
                    <label className="text-sm font-medium">Primary Color</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Secondary Color</label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full mt-2 p-2 border rounded-lg"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => router.push("/admin/themes")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Theme"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div
                className="border rounded-lg p-4 space-y-4"
                style={{
                  backgroundColor: "#ffffff",
                  color: secondaryColor,
                  fontFamily,
                }}
              >
                <div style={{ backgroundColor: primaryColor, color: "#ffffff" }} className="p-3 rounded">
                  Primary Button
                </div>
                <h4 style={{ color: primaryColor }} className="font-bold">
                  Heading Example
                </h4>
                <p className="text-sm">This is how your content will look with the selected theme colors and font.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
