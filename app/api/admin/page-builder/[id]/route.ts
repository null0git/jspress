import { verifyAuth } from "@/lib/auth"
import { readData, writeData } from "@/lib/storage"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const data = readData("pages.json") || { pages: [] }
    const page = data.pages?.find((p: any) => p.id === id)

    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 })
    return NextResponse.json(page)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAuth(request)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const data = readData("pages.json") || { pages: [] }
    data.pages = data.pages?.filter((p: any) => p.id !== id) || []
    writeData("pages.json", data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
