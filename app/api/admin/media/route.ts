import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your-secret-key-change-in-production"

async function verifyAuth(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  if (!token) return null

  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In production, save to cloud storage (S3, Vercel Blob, etc.)
    const mediaFile = {
      id: Date.now().toString(),
      filename: file.name,
      path: `/media/${file.name}`,
      uploadedAt: new Date().toISOString(),
    }

    return NextResponse.json(mediaFile)
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
