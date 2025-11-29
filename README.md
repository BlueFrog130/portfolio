# Adam Grady Portfolio

A beautiful, minimal portfolio website built with React 19, custom routing, View Transitions API, and custom static site generation - intentionally avoiding meta-frameworks.

## Features

- **Custom Router** - Lightweight, type-safe routing with History API and View Transitions
- **Custom SSG** - Static site generation without meta-frameworks
- **React 19** - Latest React with lazy loading and code splitting
- **View Transitions API** - Smooth page transitions with native browser API
- **Tailwind CSS v4** - Modern utility-first styling
- **TypeScript** - Full type safety throughout
- **Accessibility** - WCAG compliant with skip links, ARIA labels, and keyboard navigation
- **Performance** - Optimized with code splitting, lazy loading, and prerendered HTML

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Custom Router (no react-router)
- Custom SSG (no Next.js, Astro, etc.)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer
│   └── sections/           # Page sections
├── lib/
│   ├── data.ts             # Portfolio data
│   └── router/             # Custom router implementation
├── pages/                  # Page components
├── styles/                 # Global styles
├── routes.ts               # Route definitions
├── App.tsx                 # App shell
├── main.tsx                # Client entry
└── entry-server.tsx        # SSG entry
scripts/
└── ssg.ts                  # SSG build script
```

## Architecture

### Custom Router

The router is built from scratch using the History API:

- `RouterProvider` - Context provider with navigation state
- `Router` - Route matching with Suspense for lazy components
- `Link` - Client-side navigation with View Transitions
- Supports route parameters (`:slug`)
- SSG-compatible

### Custom SSG

The build process:

1. `pnpm build:client` - Build client bundle with code splitting
2. `pnpm build:ssr` - Build server bundle for rendering
3. `pnpm ssg` - Generate static HTML for each route

### View Transitions

Navigation uses the View Transitions API for smooth transitions:

```typescript
if (document.startViewTransition) {
	document.startViewTransition(() => {
		// Update DOM
	});
}
```

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Adam Grady**

- Website: [gradydevelopment.com](https://gradydevelopment.com)
- GitHub: [@BlueFrog130](https://github.com/BlueFrog130)
- LinkedIn: [Adam Grady](https://linkedin.com/in/adam-grady)
