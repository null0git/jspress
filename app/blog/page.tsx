import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { readData } from "@/lib/storage"

interface Post {
  id: string
  title: string
  slug: string
  content: string
  createdAt: string
}

async function getPosts() {
  try {
    return readData("posts.json") || []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const posts: Post[] = await getPosts()

  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b bg-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold">
            JsPress
          </Link>
          <Button variant="outline" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>

        {posts.length === 0 ? (
          <Card className="text-center p-12">
            <p className="text-muted-foreground">No posts yet</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition">
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition">{post.title}</h2>
                  <p className="text-muted-foreground mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <p className="text-muted-foreground line-clamp-3">{post.content}</p>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
