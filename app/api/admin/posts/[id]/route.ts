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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postsPath = path.join(process.cwd(), "data", "posts.json")
    const data = await fs.readFile(postsPath, "utf-8")
    const posts = JSON.parse(data)

    const post = posts.find((p: any) => p.id === params.id)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, slug, content } = await request.json()

    const postsPath = path.join(process.cwd(), "data", "posts.json")
    const data = await fs.readFile(postsPath, "utf-8")
    const posts = JSON.parse(data)

    const postIndex = posts.findIndex((p: any) => p.id === params.id)
    if (postIndex === -1) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    posts[postIndex] = {
      ...posts[postIndex],
      title,
      slug,
      content,
      updatedAt: new Date().toISOString(),
    }

    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2))

    return NextResponse.json(posts[postIndex])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update post" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postsPath = path.join(process.cwd(), "data", "posts.json")
    const data = await fs.readFile(postsPath, "utf-8")
    let posts = JSON.parse(data)

    posts = posts.filter((p: any) => p.id !== params.id)
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
