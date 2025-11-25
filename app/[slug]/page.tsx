import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { readData } from "@/lib/storage"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  createdAt: string
}

async function getPage(slug: string) {
  try {
    const pages = readData("pages.json")
    if (!Array.isArray(pages)) return null
    return pages.find((p: any) => p.slug === slug)
  } catch {
    return null
  }
}

export default async function PageComponent({
  params,
}: {
  params: { slug: string }
}) {
  const page = await getPage(params.slug)

  if (!page) {
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
              <Link href="/blog">Blog</Link>
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
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            <p className="text-muted-foreground">Published on {new Date(page.createdAt).toLocaleDateString()}</p>
          </div>

          <Card className="p-8 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap">{page.content}</div>
          </Card>
        </article>
      </div>
    </main>
  )
}
