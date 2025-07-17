# Project Structure

## Root Level
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `postcss.config.mjs` - PostCSS/Tailwind setup

## App Directory (`app/`)
Uses Next.js App Router structure:
- `layout.tsx` - Root layout component (fonts, metadata, global structure)
- `page.tsx` - Home page component
- `globals.css` - Global styles and Tailwind imports
- `favicon.ico` - Site favicon

## Public Assets (`public/`)
Static assets served from root:
- SVG icons and logos
- Images accessible via `/filename.svg`

## Key Conventions

### File Naming
- React components: PascalCase (e.g., `RootLayout`)
- Files: kebab-case or camelCase
- TypeScript: `.tsx` for components, `.ts` for utilities

### Component Structure
- Use TypeScript interfaces for props
- Export default for page/layout components
- Metadata exports for SEO (App Router)

### Styling Approach
- Tailwind utility classes preferred
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Dark mode via CSS media queries

### Import Patterns
- Next.js components: `import { Component } from "next/..."`
- Fonts: `import { Font } from "next/font/google"`
- Relative imports for local files
- Path alias `@/` available for root imports