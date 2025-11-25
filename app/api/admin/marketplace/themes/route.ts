import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"

// Mock marketplace data - can be replaced with real API
const MARKETPLACE_THEMES = [
  {
    id: "jspress-minimal",
    name: "Minimal Clean",
    version: "1.0.0",
    description: "Minimalist theme with clean typography and whitespace",
    author: "JsPress Team",
    rating: 4.9,
    downloads: 3500,
    themeUri: "https://example.com/themes/jspress-minimal.zip",
    screenshot: "/minimal-theme.jpg",
  },
  {
    id: "jspress-dark",
    name: "Dark Mode",
    version: "1.2.0",
    description: "Professional dark theme with excellent readability",
    author: "JsPress Team",
    rating: 4.7,
    downloads: 2800,
    themeUri: "https://example.com/themes/jspress-dark.zip",
    screenshot: "/dark-theme.jpg",
  },
  {
    id: "jspress-magazine",
    name: "Magazine Pro",
    version: "2.0.0",
    description: "Magazine-style layout with featured articles",
    author: "JsPress Team",
    rating: 4.8,
    downloads: 2200,
    themeUri: "https://example.com/themes/jspress-magazine.zip",
    screenshot: "/magazine-theme.jpg",
  },
  {
    id: "jspress-portfolio",
    name: "Portfolio",
    version: "1.5.0",
    description: "Perfect for showcasing your work and projects",
    author: "JsPress Team",
    rating: 4.6,
    downloads: 1900,
    themeUri: "https://example.com/themes/jspress-portfolio.zip",
    screenshot: "/portfolio-theme.jpg",
  },
]

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("q")?.toLowerCase()

    let results = MARKETPLACE_THEMES

    if (query) {
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.author.toLowerCase().includes(query),
      )
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { themeId } = await req.json()
    const theme = MARKETPLACE_THEMES.find((t) => t.id === themeId)

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 })
    }

    // Download and install theme
    const response = await fetch(theme.themeUri)
    const buffer = await response.arrayBuffer()

    const fs = require("fs").promises
    const path = require("path")
    const uploadDir = path.join(process.cwd(), "themes")
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, `${themeId}.zip`)
    await fs.writeFile(filePath, Buffer.from(buffer))

    // Decompress
    const decompress = require("decompress")
    const extractDir = path.join(uploadDir, themeId)
    await decompress(filePath, extractDir)
    await fs.unlink(filePath)

    return NextResponse.json({ success: true, message: "Theme installed from marketplace" })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
