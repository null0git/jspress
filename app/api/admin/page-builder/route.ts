import { verifyAuth } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import type { PageDesign } from "@/lib/page-builder-types"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = readData("pages.json") || { pages: [] }
    return NextResponse.json(data.pages || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const page: PageDesign = await request.json()
    const data = readData("pages.json") || { pages: [] }

    page.metadata = {
      ...page.metadata,
      updatedAt: new Date().toISOString(),
    }

    const existingIndex = data.pages?.findIndex((p: PageDesign) => p.id === page.id)
    if (existingIndex >= 0) {
      data.pages[existingIndex] = page
    } else {
      if (!data.pages) data.pages = []
      data.pages.push(page)
    }

    writeData("pages.json", data)
    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 })
  }
}
