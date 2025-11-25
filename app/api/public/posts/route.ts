import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const postsPath = path.join(process.cwd(), "data", "posts.json")
    try {
      const data = await fs.readFile(postsPath, "utf-8")
      const posts = JSON.parse(data)

      // Return limited data for public API
      return NextResponse.json(
        posts.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          content: p.content.substring(0, 200),
          createdAt: p.createdAt,
        })),
      )
    } catch {
      return NextResponse.json([])
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
