import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your-secret-key-change-in-production"

async function verifyAuth(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const usersPath = path.join(process.cwd(), "data", "users.json")
    const data = await fs.readFile(usersPath, "utf-8")
    const users = JSON.parse(data)

    // Remove password hashes
    const safeUsers = users.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }))

    return NextResponse.json(safeUsers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
