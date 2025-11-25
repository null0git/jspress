"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Edit } from "lucide-react"
import AdminLayout from "@/components/admin/layout"

interface Page {
  id: string
  title: string
  slug: string
  createdAt: string
}

export default function PagesPage() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/admin/login")
          return
        }

        const res = await fetch("/api/admin/pages", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          router.push("/admin/login")
          return
        }

        const data = await res.json()
        setPages(data)
        setIsAuthenticated(true)
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetch()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })

      if (res.ok) {
        setPages(pages.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error(error)
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
            <h1 className="text-3xl font-bold">Pages</h1>
            <p className="text-muted-foreground">Manage your site pages</p>
          </div>
          <Button onClick={() => router.push("/admin/pages/new")}>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Title</th>
                  <th className="text-left p-4 font-semibold">Slug</th>
                  <th className="text-left p-4 font-semibold">Created</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">{page.title}</td>
                    <td className="p-4 text-muted-foreground">{page.slug}</td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/pages/${page.id}/edit`)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(page.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {pages.length === 0 && (
          <Card className="text-center p-12">
            <p className="text-muted-foreground mb-4">No pages yet</p>
            <Button onClick={() => router.push("/admin/pages/new")}>Create your first page</Button>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
