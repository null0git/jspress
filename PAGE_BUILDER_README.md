# Visual Page Builder - Complete Guide

The JsPress Visual Page Builder is an advanced, drag-and-drop page composition system with support for API data integration, conditional rendering, loops, animations, custom code, and a component library.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Features](#core-features)
3. [Element Types](#element-types)
4. [API Integration](#api-integration)
5. [Advanced Logic](#advanced-logic)
6. [Code Snippets & Components](#code-snippets--components)
7. [Animations](#animations)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Access the Builder

1. Log in to JsPress admin panel
2. Click **Page Builder** in the sidebar
3. Click **Create New Page**
4. Enter page title and URL slug
5. Start building!

### 30-Second Setup

\`\`\`
1. Click "Add Container" from left toolbar
2. Inside container, add "Heading"
3. Double-click heading → enter "Welcome"
4. Right panel: change color and size
5. Add "Text" below heading
6. Click Save Page
\`\`\`

---

## Core Features

### Drag-and-Drop Interface

- **Drag from Toolbar**: Elements appear on canvas
- **Drag Between Containers**: Rearrange elements
- **Click to Select**: Inspector updates on selection
- **Right-Click Menu**: Quick actions (duplicate, delete)
- **Nested Elements**: Drag inside containers and cards

### Real-Time Editing

- **Live Preview**: See changes instantly
- **Inspector Panel**: Edit properties while building
- **Style Shortcuts**: Quick color and size adjustments
- **Keyboard Shortcuts**:
  - `Delete`: Remove selected element
  - `Ctrl+D`: Duplicate element
  - `Ctrl+Z`: Undo (browser level)

### Multi-Section Layout

**Left Panel - Elements Toolbar**
- Organized by category
- Drag elements to canvas
- Hover for descriptions

**Center Canvas**
- Main editing area
- Drag and drop targets
- Live element preview
- Click to select

**Right Panel - Inspector**
- **Properties**: Edit element content
- **Styles**: Customize appearance
- **Advanced**: Custom CSS, data attributes

---

## Element Types

### Basic Elements

#### Heading
- Use for titles and section headers
- Supports text formatting
- Customize font size, color, weight
- Common sizes: 24px, 32px, 48px

\`\`\`
Good for: Page titles, section headers, CTAs
Bad for: Body text (use Text instead)
\`\`\`

#### Text
- Paragraphs and body content
- Multi-line support
- Links within text
- Line height and letter spacing controls

\`\`\`
Good for: Descriptions, long-form content, details
Bad for: Titles (use Heading instead)
\`\`\`

#### Button
- Clickable call-to-action
- Link and action support
- Customizable colors and sizes
- Icon support

\`\`\`
Good for: CTAs, form submissions, navigation
Config: text, href, onClick handler
\`\`\`

#### Image
- Display images and media
- Alt text for accessibility
- Responsive sizing options
- Border radius and shadow effects

\`\`\`
Good for: Product images, illustrations, backgrounds
Src: URL or uploaded file path
Alt: Descriptive text for screen readers
\`\`\`

### Layout Elements

#### Container
- Flexbox-based wrapper
- Flexible alignment options
- Padding and margin control
- Nesting support

\`\`\`
Use for: Sections, groupings, responsive layouts
Flex options: column, row, space-between, center, etc.
\`\`\`

#### Card
- Pre-styled container
- Shadow and border effects
- Internal spacing
- Hover states

\`\`\`
Use for: Featured items, testimonials, product showcase
Variants: elevated, flat, outlined
\`\`\`

### Data Elements

#### List
- Ordered or unordered lists
- Dynamic item rendering
- Bullet customization
- Nested list support

\`\`\`
Good for: Features, steps, menu items
Types: ul (bullets), ol (numbers), dl (description)
\`\`\`

#### API Data
- Display external data
- Field mapping
- Real-time updates
- Caching support

\`\`\`
See: API Integration section
\`\`\`

#### Loop
- Repeat element for array data
- Item variable access
- Dynamic key generation
- Nested loops

\`\`\`
See: Advanced Logic section
\`\`\`

### Advanced Elements

#### Conditional
- Show/hide based on data
- Complex conditions
- Nested conditionals

\`\`\`
See: Advanced Logic section
\`\`\`

#### Code Snippet
- Embed custom code
- JavaScript, HTML, CSS, JSX
- Syntax highlighting
- Error handling

\`\`\`
See: Code Snippets section
\`\`\`

#### Custom Component
- Reusable components
- Saved templates
- Category organization

\`\`\`
See: Component Library section
\`\`\`

---

## API Integration

### Setting Up API Connection

#### Step 1: Create Data Source

1. Go to **Page Builder** → **API Data** tab
2. Enter endpoint URL:
   \`\`\`
   https://api.example.com/posts
   https://jsonplaceholder.typicode.com/posts
   \`\`\`

3. Select HTTP method:
   - **GET**: Fetch data (no body)
   - **POST**: Send data (with body)

4. Add headers if needed:
   \`\`\`json
   {
     "Authorization": "Bearer YOUR_TOKEN",
     "Content-Type": "application/json"
   }
   \`\`\`

5. For POST, add request body:
   \`\`\`json
   {
     "filter": "active",
     "limit": 10
   }
   \`\`\`

#### Step 2: Configure Data Path

If API response is nested:

\`\`\`javascript
// Response structure
{
  "data": {
    "posts": [
      { "id": 1, "title": "Hello" }
    ]
  }
}

// Use data path: data.posts
\`\`\`

#### Step 3: Test & Extract Fields

1. Click **Test Connection**
2. Builder fetches sample data
3. Automatically extracts available fields
4. Shows in **Preview** tab

#### Step 4: Display Data

1. Add **Loop** element to canvas
2. Set data source path:
   \`\`\`
   Use "data" for root array
   Use "data.posts" for nested array
   \`\`\`

3. Set item variable: `item`
4. Inside loop template, use:
   \`\`\`
   {item.fieldName}
   {item.author.name}  // Nested fields
   {item.id}
   \`\`\`

### Real-World Examples

#### Example 1: Blog Posts API

\`\`\`
API URL: https://api.example.com/posts
Data Path: (empty, root is array)
Response: [
  { "id": 1, "title": "...", "content": "...", "author": "..." },
  { "id": 2, "title": "...", "content": "...", "author": "..." }
]

Loop Setup:
- Data source: (empty)
- Item var: item
- Inside loop:
  - Heading: {item.title}
  - Text: {item.content}
  - Text: By {item.author}
\`\`\`

#### Example 2: E-commerce Products

\`\`\`
API URL: https://api.shop.com/products?category=electronics
Data Path: data.items
Response:
{
  "success": true,
  "data": {
    "items": [
      { "id": 1, "name": "...", "price": 99, "image": "..." },
      ...
    ]
  }
}

Loop Setup:
- Data source: data.items
- Item var: product
- Inside loop:
  - Image: {product.image}
  - Heading: {product.name}
  - Button: ${product.price}
\`\`\`

#### Example 3: User Comments

\`\`\`
API URL: https://api.example.com/comments
Data Path: comments
Response:
{
  "total": 150,
  "comments": [
    { "id": 1, "author": "...", "text": "...", "date": "..." },
    ...
  ]
}

Loop Setup:
- Data source: comments
- Item var: comment
- Inside loop:
  - Card containing:
    - Text (bold): {comment.author}
    - Text: {comment.text}
    - Text (small): {comment.date}
\`\`\`

---

## Advanced Logic

### Conditional Display

Show or hide elements based on data conditions.

#### Setting Up Conditionals

1. Select element
2. Go to **Inspector** → **Advanced** tab
3. Enable **Conditional Display**
4. Set condition:

| Field | Operator | Value | Result |
|-------|----------|-------|--------|
| `user.isAdmin` | equals | `true` | Show if admin |
| `item.stock` | greaterThan | `0` | Show if in stock |
| `post.status` | equals | `published` | Show if published |
| `data.count` | lessThan | `10` | Show if count < 10 |
| `item.tags` | contains | `featured` | Show if has tag |
| `user.email` | exists | - | Show if email exists |

#### Operators Explained

- **equals**: Exact match
- **notEquals**: Not equal to
- **greaterThan**: Numeric comparison >
- **lessThan**: Numeric comparison <
- **contains**: String includes substring
- **exists**: Field exists (not null/undefined)

#### Example Conditionals

\`\`\`javascript
// Show badge only for featured items
Field: item.featured
Operator: equals
Value: true

// Show price only if in stock
Field: item.stock
Operator: greaterThan
Value: 0

// Show admin panel only for admins
Field: user.role
Operator: equals
Value: admin

// Show "limited time" banner if stock low
Field: item.stock
Operator: lessThan
Value: 5
\`\`\`

### Loops

Repeat elements for array data.

#### Loop Configuration

1. Add **Loop** element to canvas
2. Set:
   - **Data Source**: Path to array (`items`, `data.posts`)
   - **Item Variable**: Name for each item (`item`, `product`)
   - **Key Field**: Unique identifier (`id`, `uuid`)

3. Inside loop, drag template elements
4. Reference data with `{item.fieldName}`

#### Loop Example

\`\`\`
Data:
[
  { id: 1, name: "Product A", price: 10 },
  { id: 2, name: "Product B", price: 20 }
]

Loop Setup:
- Data source: (root array)
- Item var: product
- Key field: id

Template inside loop:
- Card
  - Heading: {product.name}
  - Text: ${product.price}
\`\`\`

#### Nested Loops

\`\`\`
Data:
[
  {
    id: 1,
    category: "Electronics",
    items: [
      { id: 10, name: "Phone" },
      { id: 11, name: "Laptop" }
    ]
  }
]

Outer Loop:
- Data source: (root)
- Item var: category

Inside outer loop - Heading: {category.category}

Inside outer loop - Inner Loop:
- Data source: category.items
- Item var: item
- Heading: {item.name}
\`\`\`

#### Combining Loops & Conditionals

\`\`\`
Loop items, show button only if in stock:

1. Add Loop (data source: products)
2. Inside loop - Add Card
3. Inside card - Add Text: {item.name}
4. Inside card - Add Button
5. Select button → Add Conditional
6. Condition: item.inStock equals true
\`\`\`

---

## Code Snippets & Components

### Creating Code Snippets

Code snippets are reusable blocks of code.

#### Save a Snippet

1. Go to **Page Builder** → **Code Snippets**
2. Click **Create New**
3. Fill in:
   - **Name**: `gradient-button`, `fade-animation`
   - **Type**: JavaScript, HTML, CSS, or JSX
   - **Code**: Your actual code
   - **Tags**: `button`, `animation`, `ui`

4. Click **Save Snippet**

#### Using Code Snippets

1. Go to **Code Snippets** → **Snippet Library**
2. Find your snippet
3. Click to view or copy
4. Add to advanced editor

#### Popular Snippets to Save

**Gradient Button CSS**
\`\`\`css
.gradient-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
}

.gradient-btn:hover {
  transform: translateY(-2px);
}
\`\`\`

**Smooth Scroll JavaScript**
\`\`\`javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
\`\`\`

**Glassmorphism Card CSS**
\`\`\`css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
\`\`\`

### Component Library

Save complete layouts for reuse.

#### Save a Component

1. Design your layout in page builder
2. Go to **Component Library** → **Save New**
3. Enter:
   - **Name**: `product-card`, `featured-section`
   - **Category**: Headers, Cards, Forms, etc.
   - **Description**: What it does
   - **Tags**: `product`, `ecommerce`

4. Click **Save Component**

#### Use a Component

1. Go to **Component Library** → **Browse**
2. Filter by category
3. Click **Use Component**
4. Elements added to canvas
5. Customize for your needs

#### Built-in Component Categories

- **Headers**: Nav bars, hero sections
- **Forms**: Contact forms, sign-ups
- **Cards**: Product cards, testimonials
- **Layouts**: Grid sections, containers
- **Navigation**: Menus, breadcrumbs
- **Buttons**: CTA buttons, icon buttons
- **Custom**: Your own components

---

## Animations

Add motion and effects to elements.

### Animation Types

| Type | Effect | Use Case |
|------|--------|----------|
| **fade** | Opacity 0 → 1 | Smooth appearance |
| **slide** | Translate left → right | Entrance animation |
| **scale** | Size 0.8 → 1 | Growth effect |
| **rotate** | Rotation -10° → 0° | Spin entrance |
| **bounce** | Translate up and down | Playful effect |
| **pulse** | Opacity 1 → 0.5 → 1 | Attention getter |

### Setting Up Animations

1. Select element
2. Go to **Inspector** → **Advanced**
3. Click **Add Animation**
4. Configure:
   - **Type**: Choose animation
   - **Duration**: 100-2000ms (300ms typical)
   - **Delay**: Start time in ms
   - **Easing**: ease, linear, ease-in, ease-out, ease-in-out
   - **Iteration**: Once or infinite

### Animation Examples

\`\`\`
Hero Heading:
- Type: slide
- Duration: 600ms
- Delay: 0ms
- Easing: ease-out

Button:
- Type: fade
- Duration: 400ms
- Delay: 300ms
- Easing: ease

Loading Spinner:
- Type: rotate
- Duration: 1000ms
- Delay: 0ms
- Iteration: infinite
\`\`\`

### Performance Tips

- Keep duration 200-600ms for UI animations
- Use `ease-out` for entrances, `ease-in` for exits
- Avoid infinite loops on heavy elements
- Test on mobile devices
- Max 3-4 animations per page

---

## Best Practices

### Design Patterns

#### Hero Section
\`\`\`
Container
├── Background image/color
├── Heading (animated fade-in)
├── Subheading
├── CTA Button (animated delay)
└── Call to action text
\`\`\`

#### Product Grid
\`\`\`
Loop (data: products)
├── Card
│  ├── Image
│  ├── Title
│  ├── Price (conditional if available)
│  ├── Description
│  └── Button (conditional if in stock)
\`\`\`

#### Feature List
\`\`\`
Container
├── Loop (data: features)
│  ├── Card
│  │  ├── Icon
│  │  ├── Title
│  │  └── Description
\`\`\`

### Performance Optimization

1. **Lazy Load Images**: Add loading="lazy" in inspector
2. **Limit Loops**: Don't display 1000+ items at once
3. **Cache API Data**: Set refresh interval to 5-10 min
4. **Minimize Animations**: Avoid multiple concurrent animations
5. **Compress Images**: Use optimized image formats

### SEO Best Practices

1. **Meaningful Headings**: Use h1, h2 hierarchy
2. **Alt Text**: Add descriptive alt for all images
3. **Semantic HTML**: Use correct element types
4. **Meta Tags**: Set in page settings
5. **Structured Data**: Add JSON-LD if needed

### Accessibility

1. **Color Contrast**: Maintain WCAG AA standards
2. **Button Text**: Clear, descriptive labels
3. **Labels**: All inputs need labels
4. **Keyboard Navigation**: Test with Tab key
5. **Screen Readers**: Use semantic elements

---

## Troubleshooting

### Page Won't Save

**Problem**: "Failed to save page" error

**Solutions**:
1. Check browser console (F12) for errors
2. Verify JWT_SECRET in `.env.local`
3. Restart dev server
4. Clear localStorage: `localStorage.clear()`

### API Data Not Showing

**Problem**: Loop appears empty

**Solutions**:
1. Test API URL in browser directly
2. Verify CORS is enabled on API source
3. Check data path: `console.log()` in browser
4. Ensure correct field names in {item.field}
5. Verify no typos in data source config

### Animations Not Working

**Problem**: Elements don't animate

**Solutions**:
1. Verify duration is > 0
2. Check browser supports CSS animations
3. Disable browser extensions
4. Clear browser cache (Ctrl+Shift+R)
5. Test in incognito window

### Styles Not Applying

**Problem**: CSS changes don't show

**Solutions**:
1. Use `!important` for overrides
2. Check CSS syntax in browser console
3. Verify selector is correct
4. Clear compiled cache: `rm -rf .next/`
5. Restart dev server

### Components Won't Load

**Problem**: "Failed to load component"

**Solutions**:
1. Verify component exists in library
2. Check component has valid elements
3. Clear library cache
4. Re-save component
5. Check browser console for errors

---

## Advanced Tips

### Use CSS Variables

\`\`\`css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --spacing: 16px;
}

.button {
  background: var(--primary);
  padding: var(--spacing);
}
\`\`\`

### Data Transformation

Use JavaScript snippets to transform API data:

\`\`\`javascript
const transformed = data.map(item => ({
  ...item,
  displayPrice: `$${item.price.toFixed(2)}`,
  isExpensive: item.price > 100
}));
\`\`\`

### Responsive Design

Use inline media queries in custom CSS:

\`\`\`css
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
\`\`\`

### Dynamic Theming

Save color variants as separate components:
- `button-primary`
- `button-secondary`
- `button-danger`

---

## Getting Help

- **Docs**: `/docs/page-builder`
- **Examples**: `/examples`
- **Community**: Discord or forum
- **Support**: support@jspress.dev

**Happy building!**
