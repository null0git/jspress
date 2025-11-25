import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, Palette, Settings } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <nav className="border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-black glow-primary">
              <Zap className="w-6 h-6" />
            </div>
            <span className="font-black text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JsPress
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="border-primary/30 hover:border-primary/60 bg-transparent">
              <Link href="/admin/login">Admin Panel</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-primary to-accent glow-primary">
              <Link href="/blog">View Blog</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-sm font-semibold text-primary">
              ✨ Introducing JsPress CMS
            </div>
            <h1 className="text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Build Beautiful Content Experiences
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              A modern, fully-featured CMS with visual page builder, API integration, plugins, and themes. Powered by
              Next.js and built for creators.
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-primary to-accent glow-primary font-semibold px-8"
              >
                <Link href="/admin/login">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary/30 bg-transparent">
                <Link href="/blog">Explore Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-16 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Visual Page Builder",
                desc: "Drag-and-drop editor with API integration, animations, and code snippets",
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Theme System",
                desc: "Browse marketplace themes or upload custom themes with full customization",
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "Plugin Architecture",
                desc: "Extend functionality with plugins from marketplace or upload your own",
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Content Management",
                desc: "Create, organize, and publish pages, posts, and media effortlessly",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Developer Ready",
                desc: "Comprehensive APIs, code snippets library, and component templates",
              },
              {
                icon: <Settings className="w-6 h-6" />,
                title: "Easy Installation",
                desc: "4-step wizard setup gets you running in minutes, no configuration needed",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group glass border-primary/20 hover:border-primary/50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4 text-primary group-hover:text-accent transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>JsPress - Modern CMS Platform © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  )
}
