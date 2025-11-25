import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { notFound } from "next/navigation"

interface Post {
  id: string
  title: string
  slug: string
  content: string
  createdAt: string
}

async function getPost(slug: string) {
  try {
    const fs = require("fs").promises
    const path = require("path")
    const postsPath = path.join(process.cwd(), "data", "posts.json")
    const data = await fs.readFile(postsPath, "utf-8")
    const posts = JSON.parse(data)
    return posts.find((p: any) => p.slug === slug)
  } catch {
    return null
  }
}

export default async function PostComponent({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold">
            JsPress
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/blog">Back to Blog</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-muted-foreground">Published on {new Date(post.createdAt).toLocaleDateString()}</p>
          </div>

          <Card className="p-8">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </Card>
        </article>
      </div>
    </main>
  )
}
