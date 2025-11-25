import { verifyAuth } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import type { ApiDataSource } from "@/lib/page-builder-types"
import { extractDataFields } from "@/lib/page-builder-utils"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = readData("api-sources.json") || { sources: [] }
    return NextResponse.json(data.sources || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch API sources" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const source: ApiDataSource = await request.json()

    // Test the API endpoint and extract fields
    const response = await fetch(source.url, {
      method: source.method || "GET",
      headers: source.headers || {},
      body: source.body ? JSON.stringify(source.body) : undefined,
    })

    if (!response.ok) {
      return NextResponse.json({ error: `API returned ${response.status}` }, { status: 400 })
    }

    const apiData = await response.json()
    const actualData = source.dataPath ? getNestedValue(apiData, source.dataPath) : apiData
    const fields = extractDataFields(actualData)

    source.fields = fields.map((name) => ({
      name,
      type: "string",
      displayName: name,
    }))

    const data = readData("api-sources.json") || { sources: [] }
    if (!data.sources) data.sources = []
    data.sources.push(source)
    writeData("api-sources.json", data)

    return NextResponse.json(source, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save API source" }, { status: 500 })
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj)
}
