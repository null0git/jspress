import { promises as fs } from "fs"
import path from "path"

export interface PluginManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  pluginUri?: string
  textDomain?: string
  domainPath?: string
  requires?: string
  requiresPhp?: string
  tested?: string
  hooks?: string[]
}

export interface ThemeManifest {
  id: string
  name: string
  version: string
  description: string
  author: string
  themeUri?: string
  requires?: string
  requiresPhp?: string
  screenshot?: string
  colors?: Record<string, string>
  fonts?: Record<string, string>
}

const PLUGINS_DIR = path.join(process.cwd(), "plugins")
const THEMES_DIR = path.join(process.cwd(), "themes")

export async function ensurePluginDirs() {
  await fs.mkdir(PLUGINS_DIR, { recursive: true })
  await fs.mkdir(THEMES_DIR, { recursive: true })
}

export async function getPlugins(): Promise<PluginManifest[]> {
  try {
    await ensurePluginDirs()
    const files = await fs.readdir(PLUGINS_DIR)
    const plugins: PluginManifest[] = []

    for (const file of files) {
      const manifestPath = path.join(PLUGINS_DIR, file, "plugin.json")
      try {
        const content = await fs.readFile(manifestPath, "utf-8")
        plugins.push(JSON.parse(content))
      } catch {
        // Skip invalid plugin directories
      }
    }

    return plugins
  } catch {
    return []
  }
}

export async function getThemes(): Promise<ThemeManifest[]> {
  try {
    await ensurePluginDirs()
    const files = await fs.readdir(THEMES_DIR)
    const themes: ThemeManifest[] = []

    for (const file of files) {
      const manifestPath = path.join(THEMES_DIR, file, "theme.json")
      try {
        const content = await fs.readFile(manifestPath, "utf-8")
        themes.push(JSON.parse(content))
      } catch {
        // Skip invalid theme directories
      }
    }

    return themes
  } catch {
    return []
  }
}

export async function deletePlugin(pluginId: string) {
  const pluginPath = path.join(PLUGINS_DIR, pluginId)
  await fs.rm(pluginPath, { recursive: true, force: true })
}

export async function deleteTheme(themeId: string) {
  const themePath = path.join(THEMES_DIR, themeId)
  await fs.rm(themePath, { recursive: true, force: true })
}
