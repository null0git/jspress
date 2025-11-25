"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Check } from "lucide-react"
import AdminLayout from "@/components/admin/layout"

interface Post {
  id: string
  title: string
  slug: string
  content: string
  templateId?: string
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${postId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })

        if (!res.ok) {
          router.push("/admin/posts")
          return
        }

        const data = await res.json()
        setPost(data)
        setTitle(data.title)
        setSlug(data.slug)
        setContent(data.content || "")
      } catch (error) {
        router.push("/admin/posts")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId, router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, slug, content }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Save failed")
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
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
          <h1 className="text-3xl font-bold">Edit Post</h1>
          <p className="text-muted-foreground">Update your post content</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg flex gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-700 p-4 rounded-lg flex gap-2">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            Post saved successfully!
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="mt-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" className="mt-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Post content..."
                className="w-full p-3 border rounded-lg mt-2 font-mono text-sm"
                rows={12}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/posts")}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Post"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  )
}
