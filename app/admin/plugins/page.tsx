"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, Card as CardComponent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, Download, Star, Plus } from "lucide-react"

interface Plugin {
  id: string
  name: string
  version: string
  description: string
  author: string
}

interface MarketplacePlugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  rating: number
  downloads: number
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [marketplacePlugins, setMarketplacePlugins] = useState<MarketplacePlugin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlugins()
  }, [])

  const loadPlugins = async () => {
    try {
      const res = await fetch("/api/admin/plugins")
      const data = await res.json()
      setPlugins(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error loading plugins:", error)
      setLoading(false)
    }
  }

  const loadMarketplace = async (query = "") => {
    try {
      const url = new URL("/api/admin/marketplace/plugins", window.location.origin)
      if (query) url.searchParams.set("q", query)
      const res = await fetch(url.toString())
      const data = await res.json()
      setMarketplacePlugins(data)
    } catch (error) {
      console.error("[v0] Error loading marketplace:", error)
    }
  }

  const deletePlugin = async (pluginId: string) => {
    if (!window.confirm("Are you sure you want to delete this plugin?")) return

    try {
      const res = await fetch("/api/admin/plugins", {
        method: "DELETE",
        body: JSON.stringify({ pluginId }),
      })

      if (res.ok) {
        setPlugins(plugins.filter((p) => p.id !== pluginId))
      }
    } catch (error) {
      console.error("[v0] Error deleting plugin:", error)
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

      const res = await fetch("/api/admin/plugins/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        alert("Plugin uploaded successfully")
        loadPlugins()
      } else {
        alert("Failed to upload plugin")
      }
    } catch (error) {
      console.error("[v0] Error uploading plugin:", error)
      alert("Error uploading plugin")
    } finally {
      setUploading(false)
    }
  }

  const installFromMarketplace = async (pluginId: string) => {
    try {
      const res = await fetch("/api/admin/marketplace/plugins", {
        method: "POST",
        body: JSON.stringify({ pluginId }),
      })

      if (res.ok) {
        alert("Plugin installed successfully")
        loadPlugins()
      } else {
        alert("Failed to install plugin")
      }
    } catch (error) {
      console.error("[v0] Error installing plugin:", error)
      alert("Error installing plugin")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Plugins</h1>
          <p className="text-muted-foreground mt-2">Manage and install plugins for JsPress</p>
        </div>
      </div>

      {/* Installed Plugins */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Installed Plugins</h2>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Plugin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Plugin</DialogTitle>
                  <DialogDescription>Upload a .zip file containing your plugin</DialogDescription>
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
              <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Plugin Marketplace</DialogTitle>
                  <DialogDescription>Install plugins from the JsPress marketplace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search plugins..."
                    onChange={(e) => loadMarketplace(e.target.value)}
                    className="w-full"
                  />
                  <div className="space-y-3">
                    {marketplacePlugins.map((plugin) => (
                      <div
                        key={plugin.id}
                        className="p-3 border rounded-lg flex justify-between items-start hover:bg-muted transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">{plugin.name}</h3>
                          <p className="text-sm text-muted-foreground">{plugin.description}</p>
                          <div className="flex gap-2 mt-2 items-center">
                            <Badge variant="outline">{plugin.version}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm">{plugin.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{plugin.downloads} downloads</span>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => installFromMarketplace(plugin.id)} className="ml-4">
                          Install
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading plugins...</p>
        ) : plugins.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No plugins installed yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plugins.map((plugin) => (
              <CardComponent key={plugin.id} className="p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{plugin.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {plugin.version}
                      </Badge>
                      <span className="text-xs text-muted-foreground">by {plugin.author}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePlugin(plugin.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardComponent>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
