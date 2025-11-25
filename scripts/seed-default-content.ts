import { promises as fs } from "fs"
import path from "path"

async function seedDefaultContent() {
  const dataDir = path.join(process.cwd(), "data")
  await fs.mkdir(dataDir, { recursive: true })

  // Create default post
  const defaultPost = {
    id: "1",
    title: "Welcome to JsPress",
    slug: "welcome-to-jspress",
    content: `Welcome to your new JsPress CMS! This is your first blog post.

You can now:
- Create and edit posts and pages
- Manage media and files
- Customize themes
- Manage users and permissions

Start by creating more posts or pages from the admin panel.`,
    authorId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const defaultPage = {
    id: "1",
    title: "About",
    slug: "about",
    content: `This is the about page. You can edit this content from the admin panel.

Customize this page to tell your visitors about your site or business.`,
    authorId: "1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    await fs.writeFile(path.join(dataDir, "posts.json"), JSON.stringify([defaultPost], null, 2))

    await fs.writeFile(path.join(dataDir, "pages.json"), JSON.stringify([defaultPage], null, 2))

    console.log("✓ Default content seeded successfully")
  } catch (error) {
    console.error("Failed to seed content:", error)
  }
}

seedDefaultContent()
