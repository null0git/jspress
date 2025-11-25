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

    const postsPath = path.join(process.cwd(), "data", "posts.json")
    try {
      const data = await fs.readFile(postsPath, "utf-8")
      return NextResponse.json(JSON.parse(data))
    } catch {
      return NextResponse.json([])
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
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

    const postsPath = path.join(dataDir, "posts.json")
    let posts = []

    try {
      const data = await fs.readFile(postsPath, "utf-8")
      posts = JSON.parse(data)
    } catch {}

    const newPost = {
      id: Date.now().toString(),
      title,
      slug,
      content,
      authorId: auth.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    posts.push(newPost)
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2))

    return NextResponse.json(newPost)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 500 },
    )
  }
}
