import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"

// Mock marketplace data - can be replaced with real API
const MARKETPLACE_PLUGINS = [
  {
    id: "jspress-seo",
    name: "JsPress SEO",
    version: "1.0.0",
    description: "Advanced SEO optimization plugin with meta tags and sitemaps",
    author: "JsPress Team",
    rating: 4.8,
    downloads: 2500,
    pluginUri: "https://example.com/plugins/jspress-seo.zip",
  },
  {
    id: "jspress-analytics",
    name: "JsPress Analytics",
    version: "1.0.0",
    description: "Integrated analytics and visitor tracking",
    author: "JsPress Team",
    rating: 4.6,
    downloads: 1800,
    pluginUri: "https://example.com/plugins/jspress-analytics.zip",
  },
  {
    id: "jspress-backup",
    name: "JsPress Backup",
    version: "1.0.0",
    description: "Automated backup and restore functionality",
    author: "JsPress Team",
    rating: 4.9,
    downloads: 3200,
    pluginUri: "https://example.com/plugins/jspress-backup.zip",
  },
  {
    id: "jspress-comments",
    name: "JsPress Comments",
    version: "1.0.0",
    description: "Comments and discussion system for posts",
    author: "JsPress Team",
    rating: 4.5,
    downloads: 1500,
    pluginUri: "https://example.com/plugins/jspress-comments.zip",
  },
  {
    id: "jspress-forms",
    name: "JsPress Forms",
    version: "1.0.0",
    description: "Create and manage custom forms",
    author: "JsPress Team",
    rating: 4.7,
    downloads: 2100,
    pluginUri: "https://example.com/plugins/jspress-forms.zip",
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

    let results = MARKETPLACE_PLUGINS

    if (query) {
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query),
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

    const { pluginId } = await req.json()
    const plugin = MARKETPLACE_PLUGINS.find((p) => p.id === pluginId)

    if (!plugin) {
      return NextResponse.json({ error: "Plugin not found" }, { status: 404 })
    }

    // Download and install plugin
    const response = await fetch(plugin.pluginUri)
    const buffer = await response.arrayBuffer()

    const fs = require("fs").promises
    const path = require("path")
    const uploadDir = path.join(process.cwd(), "plugins")
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, `${pluginId}.zip`)
    await fs.writeFile(filePath, Buffer.from(buffer))

    // Decompress
    const decompress = require("decompress")
    const extractDir = path.join(uploadDir, pluginId)
    await decompress(filePath, extractDir)
    await fs.unlink(filePath)

    return NextResponse.json({ success: true, message: "Plugin installed from marketplace" })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
