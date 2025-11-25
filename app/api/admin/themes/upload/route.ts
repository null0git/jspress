import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"
import { promises as fs } from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file || !file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const uploadDir = path.join(process.cwd(), "themes")
    await fs.mkdir(uploadDir, { recursive: true })

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)

    await fs.writeFile(filePath, Buffer.from(buffer))

    // Decompress zip
    const decompress = require("decompress")
    const extractDir = path.join(uploadDir, fileName.replace(".zip", ""))
    await decompress(filePath, extractDir)

    // Verify theme.json exists
    const manifestPath = path.join(extractDir, "theme.json")
    await fs.access(manifestPath)

    // Clean up zip
    await fs.unlink(filePath)

    return NextResponse.json({ success: true, message: "Theme installed successfully" })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
