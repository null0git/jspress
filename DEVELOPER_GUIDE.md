# JsPress Plugin & Theme Developer Guide

Welcome to the JsPress Developer Guide! This comprehensive guide will help you create custom plugins and themes for JsPress.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Plugin Development](#plugin-development)
3. [Theme Development](#theme-development)
4. [Packaging & Distribution](#packaging--distribution)
5. [Best Practices](#best-practices)

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- Basic understanding of JavaScript/TypeScript
- Familiarity with Next.js (optional but helpful)
- A text editor or IDE

### JsPress Plugin System

Plugins extend JsPress functionality through hooks and API routes. Themes control the visual appearance of your site through customizable components and styles.

---

## Plugin Development

### Plugin Structure

\`\`\`
my-plugin/
├── plugin.json           # Plugin metadata
├── index.ts              # Main plugin file
├── hooks.ts              # Hook handlers (optional)
├── api/                  # API endpoints (optional)
│   └── route.ts
├── components/           # React components (optional)
│   └── my-component.tsx
├── lib/                  # Utilities
│   └── helpers.ts
└── README.md             # Plugin documentation
\`\`\`

### plugin.json

The `plugin.json` file defines your plugin metadata:

\`\`\`json
{
  "id": "my-awesome-plugin",
  "name": "My Awesome Plugin",
  "version": "1.0.0",
  "description": "A description of what your plugin does",
  "author": "Your Name",
  "pluginUri": "https://example.com/plugins/my-awesome-plugin",
  "textDomain": "my-awesome-plugin",
  "domainPath": "/languages",
  "requires": "1.0.0",
  "requiresPhp": "8.0",
  "tested": "2.0.0",
  "hooks": ["init", "render_post", "admin_menu"]
}
\`\`\`

**Field Descriptions:**
- `id` - Unique identifier (lowercase, hyphens only)
- `name` - Display name for your plugin
- `version` - Semantic versioning (e.g., 1.0.0)
- `description` - What the plugin does (max 140 chars)
- `author` - Your name or organization
- `pluginUri` - Link to plugin homepage/documentation
- `textDomain` - For translation support
- `domainPath` - Path to translation files
- `requires` - Minimum JsPress version
- `requiresPhp` - Minimum PHP version
- `tested` - Latest tested JsPress version
- `hooks` - Array of hooks your plugin uses

### Creating Your First Plugin

#### 1. Basic Plugin Structure

**index.ts**
\`\`\`typescript
import { PluginHooks } from "@/lib/plugin-system"

export default {
  name: "My Awesome Plugin",
  version: "1.0.0",
  
  // Called when plugin is activated
  activate: () => {
    console.log("Plugin activated!")
  },
  
  // Called when plugin is deactivated
  deactivate: () => {
    console.log("Plugin deactivated!")
  },
  
  // Register your plugin features
  init: (hooks: PluginHooks) => {
    // Add your custom functionality here
    hooks.addFilter("post_content", transformContent)
    hooks.addAction("post_published", sendNotification)
  }
}

function transformContent(content: string) {
  // Transform post content
  return content.replace(/\[highlight\](.*?)\[\/highlight\]/g, "<mark>$1</mark>")
}

function sendNotification(post: any) {
  // Send notification when post is published
  console.log(`Post published: ${post.title}`)
}
\`\`\`

#### 2. Plugin API Routes

Create API endpoints in your plugin:

**api/route.ts**
\`\`\`typescript
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Your plugin logic here
    return NextResponse.json({ message: "Hello from plugin" })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
\`\`\`

#### 3. Plugin Components

Create React components within your plugin:

**components/my-component.tsx**
\`\`\`tsx
"use client"

export default function MyComponent({ post }: { post: any }) {
  return (
    <div className="my-component">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  )
}
\`\`\`

### Common Plugin Examples

#### Example 1: SEO Plugin

\`\`\`typescript
// Adds SEO metadata to posts
export default {
  init: (hooks: PluginHooks) => {
    hooks.addFilter("post_head_meta", addSeoMeta)
  }
}

function addSeoMeta(meta: any, post: any) {
  return {
    ...meta,
    "og:title": post.title,
    "og:description": post.excerpt,
    "og:image": post.featuredImage,
    "description": post.excerpt || post.content.substring(0, 160)
  }
}
\`\`\`

#### Example 2: Comments Plugin

\`\`\`typescript
// Adds commenting system to posts
export default {
  init: (hooks: PluginHooks) => {
    hooks.addFilter("post_display", addCommentSection)
    hooks.addAction("comment_submitted", validateComment)
  }
}

function addCommentSection(content: string) {
  return content + '<div class="comments-section" id="comments"></div>'
}

function validateComment(comment: any) {
  if (comment.content.length < 3) {
    throw new Error("Comment too short")
  }
  return comment
}
\`\`\`

---

## Theme Development

### Theme Structure

\`\`\`
my-theme/
├── theme.json            # Theme metadata
├── styles/
│   └── style.css         # Custom styles
├── components/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── post-card.tsx
│   └── layout.tsx
├── config/
│   └── theme-config.ts   # Theme settings
└── README.md             # Theme documentation
\`\`\`

### theme.json

The `theme.json` file defines your theme:

\`\`\`json
{
  "id": "my-awesome-theme",
  "name": "My Awesome Theme",
  "version": "1.0.0",
  "description": "A beautiful, responsive theme for JsPress",
  "author": "Your Name",
  "themeUri": "https://example.com/themes/my-awesome-theme",
  "requires": "1.0.0",
  "requiresPhp": "8.0",
  "screenshot": "screenshot.png",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "fonts": {
    "headings": "Geist",
    "body": "Geist"
  }
}
\`\`\`

**Field Descriptions:**
- `id` - Unique theme identifier
- `name` - Display name
- `version` - Semantic versioning
- `description` - Theme description
- `author` - Theme author
- `themeUri` - Link to theme page
- `screenshot` - Path to preview image (440x330px recommended)
- `colors` - Customizable color palette
- `fonts` - Available font selections

### Creating Your First Theme

#### 1. Basic Theme Structure

**components/layout.tsx**
\`\`\`tsx
export default function ThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-layout">
      <Header />
      <main className="theme-main">
        {children}
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="theme-header bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold">My Awesome Site</h1>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="theme-footer bg-muted py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; 2025 My Site. All rights reserved.</p>
      </div>
    </footer>
  )
}
\`\`\`

#### 2. Post Card Component

**components/post-card.tsx**
\`\`\`tsx
import Link from "next/link"
import Image from "next/image"

export default function PostCard({ post }: { post: any }) {
  return (
    <article className="theme-post-card border rounded-lg overflow-hidden hover:shadow-lg transition">
      {post.featuredImage && (
        <div className="relative h-48 w-full">
          <Image
            src={post.featuredImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <time className="text-sm text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
        <h2 className="text-xl font-bold mt-2 mb-3">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition">
            {post.title}
          </Link>
        </h2>
        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-primary font-semibold mt-4 inline-block hover:underline"
        >
          Read More →
        </Link>
      </div>
    </article>
  )
}
\`\`\`

#### 3. Custom Styles

**styles/style.css**
\`\`\`css
:root {
  --primary: #3B82F6;
  --secondary: #10B981;
  --background: #FFFFFF;
  --text: #1F2937;
  --border: #E5E7EB;
}

.theme-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text);
}

.theme-header {
  background-color: var(--primary);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1rem;
}

.theme-post-card {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.theme-post-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.theme-footer {
  background-color: #F3F4F6;
  margin-top: 4rem;
  padding: 2rem 1rem;
  text-align: center;
  color: #6B7280;
}
\`\`\`

### Theme Config

**config/theme-config.ts**
\`\`\`typescript
export const themeConfig = {
  colors: {
    primary: "#3B82F6",
    secondary: "#10B981",
    background: "#FFFFFF",
    text: "#1F2937",
  },
  fonts: {
    headings: "Geist",
    body: "Geist",
  },
  settings: {
    postsPerPage: 10,
    showFeaturedImage: true,
    showAuthor: true,
    showDate: true,
  },
}

// Apply theme to pages
export function applyTheme(theme: typeof themeConfig) {
  Object.entries(theme.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value)
  })
}
\`\`\`

### Theme Customizer Component

**components/theme-customizer.tsx**
\`\`\`tsx
"use client"

import { useState } from "react"
import { themeConfig } from "@/config/theme-config"

export default function ThemeCustomizer() {
  const [colors, setColors] = useState(themeConfig.colors)

  const handleColorChange = (key: string, value: string) => {
    const newColors = { ...colors, [key]: value }
    setColors(newColors)
    
    // Apply color dynamically
    document.documentElement.style.setProperty(
      `--color-${key}`,
      value
    )
  }

  return (
    <div className="theme-customizer space-y-4 p-4 bg-card rounded-lg">
      <h3 className="font-bold">Theme Customizer</h3>
      {Object.entries(colors).map(([key, value]) => (
        <div key={key} className="flex items-center gap-4">
          <label className="capitalize w-24">{key}</label>
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(key, e.target.value)}
            className="w-12 h-12 cursor-pointer rounded"
          />
        </div>
      ))}
    </div>
  )
}
\`\`\`

---

## Packaging & Distribution

### Creating a .zip Package

1. Organize your plugin/theme files in the structure outlined above
2. Create a .zip file:
   \`\`\`bash
   zip -r my-plugin.zip my-plugin/
   \`\`\`
3. Verify contents include `plugin.json` or `theme.json`
4. Test installation locally before distribution

### Uploading to JsPress

1. Log into your JsPress admin panel
2. Navigate to **Plugins** or **Themes**
3. Click **Upload Plugin/Theme**
4. Select your .zip file
5. Confirm installation

### Submitting to Marketplace

1. Ensure your plugin/theme meets quality standards
2. Create a marketplace account at https://jspress.dev/marketplace
3. Submit your plugin/theme with:
   - Clear description
   - Screenshots (recommended)
   - Documentation link
   - Support contact information
4. Our team will review and publish if approved

---

## Best Practices

### Security

- ✅ Always validate and sanitize user input
- ✅ Use HTTPS for external API calls
- ✅ Store sensitive data securely
- ✅ Never store API keys in your code
- ✅ Use environment variables for configuration

### Performance

- ✅ Minimize HTTP requests
- ✅ Optimize images (use WebP when possible)
- ✅ Implement caching where appropriate
- ✅ Lazy load components when possible
- ✅ Monitor bundle size

### Compatibility

- ✅ Test with multiple JsPress versions
- ✅ Use semantic versioning
- ✅ Document breaking changes
- ✅ Provide migration guides for major updates
- ✅ Maintain backward compatibility when possible

### Code Quality

- ✅ Use TypeScript for type safety
- ✅ Write clear, documented code
- ✅ Follow consistent naming conventions
- ✅ Add error handling
- ✅ Include unit tests where applicable

### Documentation

- ✅ Write comprehensive README.md
- ✅ Include installation instructions
- ✅ Document all features and settings
- ✅ Provide code examples
- ✅ Include troubleshooting section

### Theme-Specific

- ✅ Mobile-first responsive design
- ✅ Accessibility (WCAG 2.1 AA standard)
- ✅ Fast loading times
- ✅ Clean, maintainable CSS
- ✅ Screenshot showing theme in action

### Plugin-Specific

- ✅ Use hooks system properly
- ✅ Don't modify core files
- ✅ Provide admin interface if needed
- ✅ Log errors for debugging
- ✅ Clean up resources on deactivation

---

## Troubleshooting

### Plugin Not Loading

- Check `plugin.json` format is valid JSON
- Verify folder name matches `id` in plugin.json
- Check browser console for errors
- Ensure all dependencies are installed

### Theme Not Applying

- Verify `theme.json` exists and is valid
- Check that CSS classes match component names
- Clear browser cache
- Verify theme folder structure

### Installation Issues

- Ensure .zip file is not corrupted
- Check folder structure is correct
- Verify manifest file exists and is valid
- Check file permissions

---

## Resources

- **JsPress Documentation**: https://jspress.dev/docs
- **GitHub Repository**: https://github.com/jspress/jspress
- **Community Forum**: https://community.jspress.dev
- **Issue Tracker**: https://github.com/jspress/jspress/issues

---

## Support

For questions or issues:

1. Check the [JsPress Documentation](https://jspress.dev/docs)
2. Browse [existing issues](https://github.com/jspress/jspress/issues)
3. Ask on [Community Forum](https://community.jspress.dev)
4. Submit [new issue](https://github.com/jspress/jspress/issues/new)

---

Happy coding! 🚀
