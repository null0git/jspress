import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { adminName, adminEmail, adminPassword } = await request.json()

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    // Create users directory
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // Create initial users file
    const users = [
      {
        id: "1",
        name: adminName,
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin",
        createdAt: new Date().toISOString(),
      },
    ]

    await fs.writeFile(path.join(dataDir, "users.json"), JSON.stringify(users, null, 2))

    // Update config
    const configPath = path.join(process.cwd(), "config", "cms-config.json")
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"))
    config.installStep = 3

    await fs.writeFile(configPath, JSON.stringify(config, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Admin setup failed" }, { status: 500 })
  }
}
