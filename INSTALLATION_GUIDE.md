# JsPress CMS - Complete Installation Guide

Welcome to JsPress, a production-ready, fully-functional CMS with an advanced visual page builder, plugin system, and theme marketplace. This guide walks you through everything from initial setup to deployment.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [First Run Setup](#first-run-setup)
5. [Using the Visual Page Builder](#using-the-visual-page-builder)
6. [API Data Integration](#api-data-integration)
7. [Plugin System](#plugin-system)
8. [Theme Management](#theme-management)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Node.js & NPM
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

Check your versions:
\`\`\`bash
node --version
npm --version
\`\`\`

### Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

### System Resources (Minimum)
- **RAM**: 512MB
- **Storage**: 1GB
- **CPU**: Any modern processor

---

## Installation Steps

### Step 1: Clone or Download JsPress

\`\`\`bash
# Clone from Git
git clone https://github.com/yourusername/jspress.git
cd jspress

# Or download and extract the ZIP file
unzip jspress.zip
cd jspress
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

This will install all required packages:
- **next** - React framework
- **react** - UI library
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **shadcn/ui** - Component library
- **tailwindcss** - Styling
- And more...

### Step 3: Set Environment Variables

Create a `.env.local` file in the project root:

\`\`\`env
# JWT Secret for authentication (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database URL (optional - for future database integration)
DATABASE_URL=

# API Gateway (optional - for advanced features)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Dev redirect URL for Supabase (if using auth)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Step 4: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will start at `http://localhost:3000`.

### Step 5: Complete Installation Wizard

1. Navigate to `http://localhost:3000/install`
2. Follow the 4-step wizard:
   - **Database**: Initialize default storage
   - **Admin User**: Create your admin account
   - **Site Configuration**: Set up site name and basic settings
   - **Complete**: Finish setup

3. You'll be redirected to the login page
4. Log in with your admin credentials

---

## Configuration

### Admin Settings

Access admin settings from the dashboard:

1. Navigate to **Admin Panel** → **Settings**
2. Configure:
   - **Site Name**: Your CMS name
   - **Site Description**: Short description
   - **Admin Email**: Contact email
   - **Posts Per Page**: Pagination setting
   - **Theme**: Select active theme

### JWT Secret

In production, change your JWT_SECRET to a strong, random string:

\`\`\`bash
# Generate a random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

Then update `.env.local`:
\`\`\`env
JWT_SECRET=your-generated-secret-here
\`\`\`

---

## First Run Setup

### 1. Access the Admin Panel

- **URL**: `http://localhost:3000/admin`
- **Login**: Use credentials created during setup

### 2. Create Your First Post

1. Click **Posts** in sidebar
2. Click **New Post**
3. Add title, content, and featured image
4. Click **Publish**

### 3. Create a Page with Visual Builder

1. Click **Page Builder** in sidebar
2. Select **Create New Page**
3. Enter page title and slug
4. Use drag-and-drop to build your page
5. Click **Save Page**

### 4. Publish Content

1. Go to **Posts** or **Pages**
2. Click the content item
3. Click **Publish** (or **Update** for existing)

---

## Using the Visual Page Builder

### Page Builder Basics

The visual page builder consists of 4 main sections:

#### 1. Elements Toolbar (Left)
- **Basic**: Heading, Text, Button, Image
- **Layouts**: Container, Card
- **Data**: List, API Data, Loop
- **Advanced**: Conditional, Code, Components

#### 2. Canvas (Center)
- Drag elements here from the toolbar
- Click to select and edit properties
- Right-click for quick actions

#### 3. Element Inspector (Right)
- **Properties**: Edit element content
- **Styles**: Customize colors, spacing, size
- **Advanced**: Add custom CSS classes, data attributes

#### 4. Top Toolbar
- **Save Page**: Save your page design
- **Preview**: Live preview of the page
- **Page Settings**: Title and slug configuration

### Building Your First Page

\`\`\`
1. Add a Container (layout) → Drag to canvas
2. Add a Heading inside → Enter "Welcome"
3. Add Text below → Enter your intro text
4. Select styling tab → Set colors, padding
5. Add a Button → Set button text and color
6. Save Page
\`\`\`

### Element Types Explained

| Type | Purpose | Use Case |
|------|---------|----------|
| **Heading** | Page titles and section headers | Marketing copy, CTAs |
| **Text** | Paragraphs and body content | Descriptions, details |
| **Button** | Clickable actions | Links, form submissions |
| **Image** | Visual content | Product images, backgrounds |
| **Container** | Layout wrapper | Sections, groups |
| **Card** | Content boxes | Featured items, testimonials |
| **List** | Bullet/numbered lists | Features, steps |
| **API Data** | Display external data | Real-time info, feeds |

---

## API Data Integration

### Setting Up API Data Source

1. **Create a Data Source**
   - Click **Page Builder** → **API Data** tab
   - Enter API URL (e.g., `https://api.example.com/posts`)
   - Select HTTP method (GET or POST)
   - Add headers if needed (e.g., Authorization)
   - Test connection to fetch fields

2. **Map Fields to Elements**
   - After testing, available fields display
   - Click element to map properties to API fields
   - Use dot notation for nested data: `user.profile.name`

3. **Display Data with Loop**
   - Add Loop element to canvas
   - Specify data source: `data.items`
   - Set item variable: `item`
   - Inside loop, create template element
   - Reference values: `{item.name}`, `{item.description}`

### API Data Path Examples

\`\`\`javascript
// Flat response
{
  "posts": [{ "id": 1, "title": "Hello" }]
}
// Data path: "posts"

// Nested response
{
  "data": {
    "results": [{ "id": 1, "name": "Product" }]
  }
}
// Data path: "data.results"

// Root array
[{ "id": 1, "name": "Item" }]
// Data path: (leave empty)
\`\`\`

### Conditional Display

Show/hide elements based on API data:

1. Select element → **Inspector** → **Advanced** tab
2. Enable "Conditional Display"
3. Set condition:
   - **Field**: `user.isAdmin`
   - **Operator**: `equals`
   - **Value**: `true`
4. Save

---

## Code Snippets & Components

### Creating Code Snippets

1. Go to **Page Builder** → **Code Snippets**
2. Click **Create New**
3. Enter details:
   - **Name**: Snippet identifier
   - **Type**: JavaScript, HTML, CSS, or JSX
   - **Code**: Your code
   - **Tags**: For organization
4. Click **Save Snippet**

### Using Saved Components

1. Go to **Page Builder** → **Component Library**
2. Click **Browse**
3. Select component → Click **Use Component**
4. Component elements are added to canvas

### Saving Components

1. Create your layout in page builder
2. Go to **Component Library** → **Save New**
3. Enter name and category
4. Click **Save Component**

---

## Animations & Advanced Features

### Adding Animations

1. Select element → **Inspector** → **Advanced**
2. Click **Add Animation**
3. Configure:
   - **Type**: fade, slide, scale, rotate, bounce, pulse
   - **Duration**: 100-2000ms
   - **Delay**: Timing before animation starts
   - **Easing**: ease, linear, ease-in, ease-out
   - **Iteration**: Play once or infinite loop
4. Click **Save Animations**

### Custom CSS

1. Go to **Page Builder** → **Advanced Features**
2. Enter custom CSS in **Custom CSS** tab
3. Click **Apply CSS**

### Custom JavaScript

1. Go to **Advanced Features** → **Custom JavaScript**
2. Write your JavaScript code
3. Click **Execute JavaScript**

Example:
\`\`\`javascript
// Add click handlers
document.querySelectorAll('.clickable').forEach(el => {
  el.addEventListener('click', function() {
    this.classList.toggle('active');
    console.log('Clicked!');
  });
});
\`\`\`

---

## Plugin System

### Installing Plugins

#### From Marketplace

1. Go to **Admin** → **Plugins**
2. Click **Browse Marketplace**
3. Find plugin → Click **Install**
4. Plugin automatically activates

#### Manual Upload

1. Go to **Plugins** → **Upload Plugin**
2. Upload `.zip` file
3. Plugin activates immediately

### Plugin Structure

Required plugin files:

\`\`\`
my-plugin/
├── plugin.json          # Metadata
├── index.js             # Entry point
├── README.md           # Documentation
└── assets/
    ├── icon.png        # Display icon
    └── styles.css      # Plugin styles
\`\`\`

**plugin.json** example:
\`\`\`json
{
  "name": "My Custom Plugin",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "Does something awesome",
  "type": "extension",
  "hooks": ["onPostSave", "onPageRender"]
}
\`\`\`

---

## Theme Management

### Installing Themes

#### From Marketplace

1. Go to **Admin** → **Themes**
2. Browse available themes
3. Click **Install & Activate**

#### Manual Upload

1. Go to **Themes** → **Upload Theme**
2. Upload theme `.zip`
3. Activate from themes list

### Theme Structure

\`\`\`
my-theme/
├── theme.json           # Metadata
├── index.tsx            # Main template
├── styles.css           # Theme styles
└── assets/
    ├── logo.svg         # Theme logo
    └── screenshot.png   # Preview image
\`\`\`

**theme.json** example:
\`\`\`json
{
  "name": "My Theme",
  "version": "1.0.0",
  "description": "Beautiful modern theme",
  "author": "Your Name",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "background": "#ffffff"
  }
}
\`\`\`

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub

\`\`\`bash
git add .
git commit -m "Prepare for deployment"
git push origin main
\`\`\`

2. Import on Vercel

- Go to [vercel.com](https://vercel.com)
- Click **New Project**
- Select your GitHub repository
- Configure environment variables
- Click **Deploy**

3. Add Environment Variables in Vercel

- Go to **Project Settings** → **Environment Variables**
- Add:
  \`\`\`
  JWT_SECRET=your-production-secret
  NEXT_PUBLIC_API_URL=https://your-domain.com
  \`\`\`

### Deploy to Other Platforms

#### Heroku
\`\`\`bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Deploy
git push heroku main

# Set env vars
heroku config:set JWT_SECRET=your-secret
\`\`\`

#### Railway
1. Push to GitHub
2. Connect at [railway.app](https://railway.app)
3. Select repository
4. Configure environment variables
5. Deploy

#### Self-Hosted
\`\`\`bash
# Build production bundle
npm run build

# Start production server
npm start
\`\`\`

---

## Troubleshooting

### Common Issues

#### Installation Wizard Not Loading

**Problem**: `http://localhost:3000/install` shows error

**Solution**:
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
\`\`\`

#### Admin Login Not Working

**Problem**: "Invalid credentials"

**Solution**:
1. Go to `/install` again to reset admin user
2. Create new admin account
3. Try login again

#### Page Builder Not Saving

**Problem**: "Failed to save page"

**Solution**:
1. Check browser console for errors (F12)
2. Ensure JWT_SECRET is set in `.env.local`
3. Restart dev server: `Ctrl+C` then `npm run dev`

#### API Data Not Showing

**Problem**: Loop elements display empty

**Solution**:
1. Test API endpoint directly in browser
2. Check data path in API configuration
3. Verify CORS is enabled on API source
4. Check field mapping in conditional settings

#### Styles Not Applying

**Problem**: Custom CSS not working

**Solution**:
1. Use `!important` for overrides: `color: red !important;`
2. Check Tailwind conflicts
3. Verify CSS syntax
4. Clear browser cache (Ctrl+Shift+R)

#### Plugin Installation Fails

**Problem**: "Failed to upload plugin"

**Solution**:
1. Ensure `.zip` file structure is correct
2. Verify `plugin.json` is valid JSON
3. Check file size < 50MB
4. Ensure proper permissions

### Getting Help

- **Documentation**: Check [docs folder](./docs)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourrepo/issues)
- **Discussions**: Join our [community forum](https://forum.jspress.dev)
- **Email**: support@jspress.dev

---

## Additional Resources

- [Developer Guide](./DEVELOPER_GUIDE.md) - Creating plugins and themes
- [API Documentation](./API.md) - REST API endpoints
- [Architecture Overview](./ARCHITECTURE.md) - System design
- [Security Guide](./SECURITY.md) - Best practices

---

## License

JsPress is open source and available under the MIT License. See LICENSE file for details.

---

**Happy building with JsPress!**
\`\`\`

Now let me also update the sidebar navigation to include the Page Builder link:

```tsx file="" isHidden
