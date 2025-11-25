import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { siteName, timezone, language } = await request.json()

    const configPath = path.join(process.cwd(), "config", "cms-config.json")
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"))

    config.siteName = siteName
    config.timezone = timezone
    config.language = language
    config.installed = true
    config.installStep = 4

    await fs.writeFile(configPath, JSON.stringify(config, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Config setup failed" }, { status: 500 })
  }
}
