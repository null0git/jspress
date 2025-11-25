"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Star, Trash2 } from "lucide-react"
import AdminLayout from "@/components/admin/layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Theme {
  id: string
  name: string
  version: string
  description: string
  author: string
}

interface MarketplaceTheme {
  id: string
  name: string
  version: string
  description: string
  author: string
  rating: number
  downloads: number
  screenshot: string
}

export default function ThemesPage() {
  const router = useRouter()
  const [themes, setThemes] = useState<Theme[]>([])
  const [marketplaceThemes, setMarketplaceThemes] = useState<MarketplaceTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)
        await loadThemes()
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const loadThemes = async () => {
    try {
      const res = await fetch("/api/admin/themes")
      const data = await res.json()
      setThemes(data)
    } catch (error) {
      console.error("[v0] Error loading themes:", error)
    }
  }

  const loadMarketplace = async (query = "") => {
    try {
      const url = new URL("/api/admin/marketplace/themes", window.location.origin)
      if (query) url.searchParams.set("q", query)
      const res = await fetch(url.toString())
      const data = await res.json()
      setMarketplaceThemes(data)
    } catch (error) {
      console.error("[v0] Error loading marketplace:", error)
    }
  }

  const deleteTheme = async (themeId: string) => {
    if (!window.confirm("Are you sure you want to delete this theme?")) return

    try {
      const res = await fetch("/api/admin/themes", {
        method: "DELETE",
        body: JSON.stringify({ themeId }),
      })

      if (res.ok) {
        setThemes(themes.filter((t) => t.id !== themeId))
      }
    } catch (error) {
      console.error("[v0] Error deleting theme:", error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.name.endsWith(".zip")) {
      alert("Please upload a .zip file")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/themes/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        alert("Theme uploaded successfully")
        loadThemes()
      } else {
        alert("Failed to upload theme")
      }
    } catch (error) {
      console.error("[v0] Error uploading theme:", error)
      alert("Error uploading theme")
    } finally {
      setUploading(false)
    }
  }

  const installFromMarketplace = async (themeId: string) => {
    try {
      const res = await fetch("/api/admin/marketplace/themes", {
        method: "POST",
        body: JSON.stringify({ themeId }),
      })

      if (res.ok) {
        alert("Theme installed successfully")
        loadThemes()
      } else {
        alert("Failed to install theme")
      }
    } catch (error) {
      console.error("[v0] Error installing theme:", error)
      alert("Error installing theme")
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

  if (!isAuthenticated) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Themes</h1>
            <p className="text-muted-foreground mt-2">Manage and customize your site's appearance</p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Theme
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Theme</DialogTitle>
                  <DialogDescription>Upload a .zip file containing your theme</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-slate-500"
                  />
                  {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog onOpenChange={(open) => open && loadMarketplace()}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Browse Marketplace
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-96 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Theme Marketplace</DialogTitle>
                  <DialogDescription>Install themes from the JsPress marketplace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search themes..."
                    onChange={(e) => loadMarketplace(e.target.value)}
                    className="w-full"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {marketplaceThemes.map((theme) => (
                      <div key={theme.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                        <img
                          src={theme.screenshot || "/placeholder.svg"}
                          alt={theme.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <h3 className="font-semibold text-sm">{theme.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
                          <div className="flex gap-2 mt-2 items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs">{theme.rating}</span>
                              <span className="text-xs text-muted-foreground">({theme.downloads})</span>
                            </div>
                            <Button size="xs" onClick={() => installFromMarketplace(theme.id)}>
                              Install
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Installed Themes</h2>
          {themes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No themes installed yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme) => (
                <Card key={theme.id} className="p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {theme.version}
                        </Badge>
                        <span className="text-xs text-muted-foreground">by {theme.author}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTheme(theme.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
