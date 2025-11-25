import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { readData, ensureDataDir, writeData } from "@/lib/storage"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    ensureDataDir()
    const { email, password } = await request.json()

    let users = readData("users.json")
    if (!Array.isArray(users)) {
      users = []
    }

    // Check if users array is empty and create default admin
    if (users.length === 0) {
      const defaultAdmin = {
        id: "1",
        name: "Admin",
        email: "admin@jspress.local",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "admin",
        createdAt: new Date().toISOString(),
      }
      users = [defaultAdmin]
      writeData("users.json", users)
    }

    // Find user
    const user = users.find((u: any) => u.email === email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

    return NextResponse.json({ token })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 500 })
  }
}
