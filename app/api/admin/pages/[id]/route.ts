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

    const pagesPath = path.join(process.cwd(), "data", "pages.json")
    const data = await fs.readFile(pagesPath, "utf-8")
    const pages = JSON.parse(data)

    const page = pages.find((p: any) => p.id === params.id)
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, slug, content } = await request.json()

    const pagesPath = path.join(process.cwd(), "data", "pages.json")
    const data = await fs.readFile(pagesPath, "utf-8")
    const pages = JSON.parse(data)

    const pageIndex = pages.findIndex((p: any) => p.id === params.id)
    if (pageIndex === -1) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    pages[pageIndex] = {
      ...pages[pageIndex],
      title,
      slug,
      content,
      updatedAt: new Date().toISOString(),
    }

    await fs.writeFile(pagesPath, JSON.stringify(pages, null, 2))

    return NextResponse.json(pages[pageIndex])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update page" },
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

    const pagesPath = path.join(process.cwd(), "data", "pages.json")
    const data = await fs.readFile(pagesPath, "utf-8")
    let pages = JSON.parse(data)

    pages = pages.filter((p: any) => p.id !== params.id)
    await fs.writeFile(pagesPath, JSON.stringify(pages, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
