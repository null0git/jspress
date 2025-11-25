import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const { dbType, dbUrl } = await request.json()

    // Create config directory if it doesn't exist
    const configDir = path.join(process.cwd(), "config")
    await fs.mkdir(configDir, { recursive: true })

    // Create initial config
    const config = {
      dbType,
      dbUrl: dbType === "postgresql" ? dbUrl : "sqlite:cms.db",
      installStep: 2,
      installed: false,
    }

    await fs.writeFile(path.join(configDir, "cms-config.json"), JSON.stringify(config, null, 2))

    // Create database schema (simplified - use actual DB client in production)
    const dbDir = path.join(process.cwd(), "data")
    await fs.mkdir(dbDir, { recursive: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database setup failed" },
      { status: 500 },
    )
  }
}
