import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  try {
    const pagesPath = path.join(process.cwd(), "data", "pages.json")
    try {
      const data = await fs.readFile(pagesPath, "utf-8")
      const pages = JSON.parse(data)

      return NextResponse.json(
        pages.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          createdAt: p.createdAt,
        })),
      )
    } catch {
      return NextResponse.json([])
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}
