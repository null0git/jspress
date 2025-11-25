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

    const pagesPath = path.join(process.cwd(), "data", "pages.json")
    try {
      const data = await fs.readFile(pagesPath, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch {
      return NextResponse.json([])
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, slug, content } = await request.json()

    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    const pagesPath = path.join(dataDir, "pages.json")
    let pages = []

    try {
      const data = await fs.readFile(pagesPath, "utf-8")
      pages = JSON.parse(data)
    } catch {}

    const newPage = {
      id: Date.now().toString(),
      title,
      slug,
      content,
      authorId: auth.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    pages.push(newPage)
    await fs.writeFile(pagesPath, JSON.stringify(pages, null, 2))

    return NextResponse.json(newPage)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create page" },
      { status: 500 },
    )
  }
}
