# Technology Stack

## Core Framework
- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe JavaScript

## Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing with Tailwind plugin
- **Geist Fonts** - Optimized font family (Sans & Mono)

## Development Tools
- **Turbopack** - Fast bundler for development
- **ESLint** - Code linting with Next.js config
- **TypeScript** - Strict mode enabled

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
```

### Build & Deploy
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint checks
```

## Configuration Notes
- Uses App Router (not Pages Router)
- TypeScript strict mode enabled
- Path aliases configured (`@/*` maps to root)
- CSS custom properties for theming
- Dark mode support via CSS media queries