import { verifyAuth } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import type { SavedComponent } from "@/lib/page-builder-types"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const data = readData("saved-components.json") || { components: [] }
    return NextResponse.json(data.components || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch components" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const component: SavedComponent = await request.json()
    const data = readData("saved-components.json") || { components: [] }

    if (!data.components) data.components = []
    data.components.push(component)
    writeData("saved-components.json", data)

    return NextResponse.json(component, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save component" }, { status: 500 })
  }
}
