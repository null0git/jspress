"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Zap } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@jspress.local")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      let data
      try {
        data = await res.json()
      } catch (e) {
        throw new Error("Invalid response from server")
      }

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("token", data.token)
      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-2xl font-black glow-primary">
              <Zap className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            JsPress
          </h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to continue</p>
        </div>

        <Card className="glass border-primary/20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg" />
          <div className="relative p-8">
            {error && (
              <div className="bg-destructive/15 border border-destructive/30 text-destructive p-4 rounded-lg mb-6 flex gap-3 text-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground/90 block mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="admin@jspress.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-primary/30 focus:border-primary/60 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground/90 block mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-primary/30 focus:border-primary/60 transition-colors"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-primary to-accent glow-primary font-semibold"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-secondary/30 border border-secondary/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-semibold mb-2">Demo Credentials:</p>
              <p>Email: admin@jspress.local</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
