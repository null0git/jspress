"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

type InstallStep = "database" | "admin" | "config" | "complete"

export default function InstallWizard() {
  const router = useRouter()
  const [step, setStep] = useState<InstallStep>("database")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Database step
  const [dbType, setDbType] = useState<"sqlite" | "postgresql">("sqlite")
  const [dbUrl, setDbUrl] = useState("")

  // Admin step
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("")

  // Config step
  const [siteName, setSiteName] = useState("My Site")
  const [timezone, setTimezone] = useState("UTC")
  const [language, setLanguage] = useState("en")

  const handleDatabaseSetup = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/install/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dbType, dbUrl }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Database setup failed")
      }

      setStep("admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleAdminSetup = async () => {
    setLoading(true)
    setError("")

    if (adminPassword !== adminPasswordConfirm) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/install/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminName, adminEmail, adminPassword }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Admin setup failed")
      }

      setStep("config")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleConfigSetup = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/install/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteName, timezone, language }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Config setup failed")
      }

      setStep("complete")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">JsPress Installation</h1>
            <p className="text-muted-foreground">Get your CMS up and running in a few steps</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mb-8">
            {(["database", "admin", "config", "complete"] as const).map((s, i) => (
              <div key={s} className={`flex items-center ${i < 3 ? "flex-1" : ""}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["database", "admin", "config", "complete"].indexOf(s) <
                          ["database", "admin", "config", "complete"].indexOf(step)
                        ? "bg-green-500 text-white"
                        : "bg-muted"
                  }`}
                >
                  {["database", "admin", "config", "complete"].indexOf(s) <
                  ["database", "admin", "config", "complete"].indexOf(step) ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 3 && <div className="flex-1 h-0.5 mx-2 bg-muted" />}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6 flex gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Database Step */}
          {step === "database" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 1: Database Setup</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your database type. SQLite is recommended for most setups.
                </p>
              </div>

              <div className="space-y-3">
                <label
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                  htmlFor="db-sqlite"
                >
                  <input
                    type="radio"
                    id="db-sqlite"
                    name="db-type"
                    value="sqlite"
                    checked={dbType === "sqlite"}
                    onChange={(e) => setDbType(e.target.value as "sqlite")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">SQLite (Recommended)</div>
                    <div className="text-sm text-muted-foreground">
                      Local file-based database, no configuration needed
                    </div>
                  </div>
                </label>

                <label
                  className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                  htmlFor="db-postgres"
                >
                  <input
                    type="radio"
                    id="db-postgres"
                    name="db-type"
                    value="postgresql"
                    checked={dbType === "postgresql"}
                    onChange={(e) => setDbType(e.target.value as "postgresql")}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">PostgreSQL</div>
                    <div className="text-sm text-muted-foreground">Remote database, requires connection string</div>
                  </div>
                </label>
              </div>

              {dbType === "postgresql" && (
                <div>
                  <label className="text-sm font-medium">Database URL</label>
                  <Input
                    placeholder="postgresql://user:password@host:5432/dbname"
                    value={dbUrl}
                    onChange={(e) => setDbUrl(e.target.value)}
                    className="mt-2"
                  />
                </div>
              )}

              <Button onClick={handleDatabaseSetup} disabled={loading} className="w-full">
                {loading ? "Setting up..." : "Continue to Admin Setup"}
              </Button>
            </div>
          )}

          {/* Admin Step */}
          {step === "admin" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 2: Create Admin User</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your administrator account to access the CMS.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={adminPasswordConfirm}
                    onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("database")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleAdminSetup} disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Continue to Site Config"}
                </Button>
              </div>
            </div>
          )}

          {/* Config Step */}
          {step === "config" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Step 3: Site Configuration</h2>
                <p className="text-sm text-muted-foreground mb-4">Configure your site settings.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Site Name</label>
                  <Input
                    placeholder="My Awesome Site"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Timezone</label>
                  <Input
                    placeholder="UTC"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Language</label>
                  <Input
                    placeholder="en"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("admin")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConfigSetup} disabled={loading} className="flex-1">
                  {loading ? "Finishing..." : "Complete Installation"}
                </Button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === "complete" && (
            <div className="text-center space-y-6">
              <div>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Installation Complete!</h2>
                <p className="text-muted-foreground">
                  Your JsPress CMS is ready to use. Click below to access the admin panel.
                </p>
              </div>

              <Button onClick={handleComplete} size="lg" className="w-full">
                Go to Admin Panel
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
