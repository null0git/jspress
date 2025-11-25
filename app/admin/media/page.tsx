"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"
import AdminLayout from "@/components/admin/layout"

interface MediaFile {
  id: string
  filename: string
  path: string
  uploadedAt: string
}

export default function MediaPage() {
  const router = useRouter()
  const [media, setMedia] = useState<MediaFile[]>([])
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
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", files[0])

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        setMedia([data, ...media])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
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
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage your files and images</p>
        </div>

        <Card className="p-6 border-2 border-dashed">
          <label className="cursor-pointer">
            <div className="text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="font-semibold">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input type="file" onChange={handleFileUpload} disabled={uploading} className="hidden" accept="image/*" />
          </label>
        </Card>

        {media.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {media.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <div className="aspect-square bg-muted" />
                <div className="p-4">
                  <p className="text-sm font-medium truncate">{file.filename}</p>
                  <p className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
