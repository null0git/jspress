import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

async function verifyAuth(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return null
  }
  return token
}

export async function GET(request: NextRequest) {
  try {
    const token = await verifyAuth(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dataDir = path.join(process.cwd(), "data")

    // Read stats from files
    let totalPosts = 0,
      totalPages = 0,
      totalUsers = 0,
      totalMedia = 0

    try {
      const usersData = await fs.readFile(path.join(dataDir, "users.json"), "utf-8")
      totalUsers = JSON.parse(usersData).length
    } catch {}

    try {
      const postsData = await fs.readFile(path.join(dataDir, "posts.json"), "utf-8")
      totalPosts = JSON.parse(postsData).length
    } catch {}

    try {
      const pagesData = await fs.readFile(path.join(dataDir, "pages.json"), "utf-8")
      totalPages = JSON.parse(pagesData).length
    } catch {}

    return NextResponse.json({
      totalPosts,
      totalPages,
      totalUsers,
      totalMedia,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch stats" },
      { status: 500 },
    )
  }
}
