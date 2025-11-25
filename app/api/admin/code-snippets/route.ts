import { verifyAuth } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import type { CodeSnippet } from "@/lib/page-builder-types"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = readData("code-snippets.json") || { snippets: [] }
    return NextResponse.json(data.snippets || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const snippet: CodeSnippet = await request.json()
    snippet.createdAt = new Date().toISOString()
    snippet.updatedAt = new Date().toISOString()

    const data = readData("code-snippets.json") || { snippets: [] }
    if (!data.snippets) data.snippets = []
    data.snippets.push(snippet)

    writeData("code-snippets.json", data)
    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save snippet" }, { status: 500 })
  }
}
