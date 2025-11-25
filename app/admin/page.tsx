"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Users } from "lucide-react"
import AdminLayout from "@/components/admin/layout"

interface DashboardStats {
  totalPosts: number
  totalPages: number
  totalUsers: number
  totalMedia: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    totalPages: 0,
    totalUsers: 0,
    totalMedia: 0,
  })
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!res.ok) {
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)

        // Fetch dashboard stats
        const statsRes = await fetch("/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (statsRes.ok) {
          const data = await statsRes.json()
          setStats(data)
        }
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </AdminLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to JsPress</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Posts", value: stats.totalPosts, color: "bg-blue-500" },
            { icon: FileText, label: "Pages", value: stats.totalPages, color: "bg-purple-500" },
            { icon: Users, label: "Users", value: stats.totalUsers, color: "bg-green-500" },
            { icon: ImageIcon, label: "Media", value: stats.totalMedia, color: "bg-orange-500" },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto py-6 flex-col bg-transparent" variant="outline">
              <a href="/admin/posts/new">
                <FileText className="w-6 h-6 mb-2" />
                Create New Post
              </a>
            </Button>
            <Button asChild className="h-auto py-6 flex-col bg-transparent" variant="outline">
              <a href="/admin/pages/new">
                <FileText className="w-6 h-6 mb-2" />
                Create New Page
              </a>
            </Button>
            <Button asChild className="h-auto py-6 flex-col bg-transparent" variant="outline">
              <a href="/admin/media">
                <ImageIcon className="w-6 h-6 mb-2" />
                Manage Media
              </a>
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
