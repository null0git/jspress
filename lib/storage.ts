import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Read data from JSON file
export function readData(filename: string): any {
  try {
    ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)

    if (!fs.existsSync(filePath)) {
      return filename.includes("users") || filename.includes("posts") || filename.includes("pages") ? [] : {}
    }

    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return filename.includes("users") || filename.includes("posts") || filename.includes("pages") ? [] : {}
  }
}

// Write data to JSON file
export function writeData(filename: string, data: any): void {
  try {
    ensureDataDir()
    const filePath = path.join(DATA_DIR, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    throw error
  }
}

// Append data to JSON file
export function appendData(filename: string, newData: any): void {
  try {
    const existing = readData(filename) || {}
    const updated = { ...existing, ...newData }
    writeData(filename, updated)
  } catch (error) {
    console.error(`Error appending to ${filename}:`, error)
    throw error
  }
}

// Delete file
export function deleteDataFile(filename: string): void {
  try {
    const filePath = path.join(DATA_DIR, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error) {
    console.error(`Error deleting ${filename}:`, error)
    throw error
  }
}

// List all data files
export function listDataFiles(): string[] {
  try {
    ensureDataDir()
    return fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"))
  } catch (error) {
    console.error("Error listing data files:", error)
    return []
  }
}
