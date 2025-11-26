# JsPress - Modern CMS

![Status](https://img.shields.io/badge/Status-Not%20Production%20Ready-red)
![Warning](https://img.shields.io/badge/Warning-Many%20Issues-critical)
![Stage](https://img.shields.io/badge/Stage-Alpha-orange)


A production-ready, fully-installable CMS built with Next.js. No coding required for end users.

## Features

- **Installation Wizard** - Step-by-step setup for new instances
- **Content Management** - Create, edit, and organize posts and pages
- **User Management** - Multi-user support with role-based access
- **Media Library** - Upload and manage files and images
- **Theme System** - Visual theme customization without code
- **Responsive Admin Panel** - Modern, accessible interface
- **Public Frontend** - Beautiful blog and page rendering
- **Secure Authentication** - JWT-based authentication with password hashing

## Quick Start

### Installation

1. Download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/install](http://localhost:3000/install) in your browser
5. Follow the installation wizard

### First Time Setup

The installation wizard will guide you through:
1. **Database Selection** - Choose between SQLite or PostgreSQL
2. **Admin User** - Create your administrator account
3. **Site Configuration** - Set up your site name, timezone, and language
4. **Completion** - Start using your CMS

After setup, you can access:
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Blog**: [http://localhost:3000/blog](http://localhost:3000/blog)
- **Public Pages**: [http://localhost:3000/your-page-slug](http://localhost:3000/your-page-slug)

## Project Structure

```
/app
  /admin              # Admin panel pages
  /api               # API routes for backend logic
  /blog              # Blog pages
  /[slug]            # Dynamic page routes
/components
  /ui                # UI components
  /admin             # Admin-specific components
/lib
  # Utility functions
/data
  # JSON data storage
/config
  # Configuration files
/public
  # Static assets
```

## Database

JsPress supports two database options:

### SQLite (Default)
- Local file-based database
- No setup required
- Perfect for small to medium sites
- File: `cms.db`

### PostgreSQL
- Remote database support
- Better for large-scale deployments
- Requires connection string

Data is stored as JSON in files for simplicity, but can be easily migrated to a database.

## Authentication

- JWT-based authentication
- Passwords hashed with bcryptjs
- Secure admin-only routes
- Session tokens stored in localStorage

## Admin Features

- **Dashboard** - Overview of site statistics
- **Posts** - Create, edit, and manage blog posts
- **Pages** - Create static pages
- **Media** - Upload and organize files
- **Users** - Manage site users and roles
- **Themes** - Customize site appearance

## Deployment

### Vercel
1. Connect your GitHub repository
2. Deploy with Vercel
3. Set up environment variables if using PostgreSQL

### Other Platforms
The CMS can run on any Node.js hosting platform:
- Replit
- Railway
- Heroku
- AWS
- DigitalOcean

## Environment Variables

```env
# Required in production
JWT_SECRET=your-secret-key-here
DATABASE_URL=sqlite:cms.db  # or postgres://...
```

## Development

- **Hot Reload**: Changes are reflected instantly
- **Type Safety**: Full TypeScript support
- **UI Components**: shadcn/ui components included
- **Styling**: Tailwind CSS for styling

## Security Considerations

- Change `JWT_SECRET` in production
- Use strong passwords
- Implement HTTPS
- Regular backups of data
- Use PostgreSQL for production databases

## Support & Documentation

For more information, visit the project documentation.

## License

MIT

---

Built with Next.js, React, and Tailwind CSS
