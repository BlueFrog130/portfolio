# File-Based Router with Vite Glob Imports

A lightweight, file-based routing system for React applications using Vite's glob import feature. This router automatically discovers routes based on your file structure and supports dynamic routes, catch-all routes, and nested layouts.

## Features

- 🚀 **Automatic Route Discovery**: Routes are automatically discovered using Vite's `import.meta.glob`
- 📁 **File-Based Routing**: Similar to Next.js App Router, but for client-side applications
- 🎯 **Dynamic Routes**: Support for parameterized routes with `[param]` syntax
- 🔄 **Catch-All Routes**: Handle multiple path segments with `[...slug]` syntax
- 🎨 **Nested Layouts**: Support for layout components with `+layout.tsx`
- 🔗 **TypeScript Support**: Fully typed with TypeScript
- 📱 **Browser History**: Integrated with the browser's history API
- ⚡ **Performance**: Minimal runtime overhead with compile-time route discovery

## File Structure Convention

```
src/routes/
├── +page.tsx                    → /
├── about/
│   └── +page.tsx               → /about
├── projects/
│   ├── +page.tsx               → /projects
│   ├── +layout.tsx             → Layout for /projects/*
│   └── [id]/
│       └── +page.tsx           → /projects/:id
├── blog/
│   └── [...slug]/
│       └── +page.tsx           → /blog/*slug
└── demo/
    └── +page.tsx               → /demo
```

## Route Types

### Static Routes

- `+page.tsx` → `/`
- `about/+page.tsx` → `/about`
- `projects/+page.tsx` → `/projects`

### Dynamic Routes

- `[id]/+page.tsx` → `/:id`
- `projects/[id]/+page.tsx` → `/projects/:id`
- `users/[userId]/posts/[postId]/+page.tsx` → `/users/:userId/posts/:postId`

### Catch-All Routes

- `[...slug]/+page.tsx` → `/*slug`
- `blog/[...slug]/+page.tsx` → `/blog/*slug`

### Layouts

- `+layout.tsx` - Wraps all child routes in the same directory and subdirectories

## Usage

### Basic Setup

```tsx
// src/App.tsx
import { Router } from '@/lib/router';

function NotFound() {
	return <div>404 - Page not found</div>;
}

export default function App() {
	return <Router fallback={NotFound} />;
}
```

### Creating Routes

Create a new file in the `src/routes` directory:

```tsx
// src/routes/about/+page.tsx
export default function AboutPage() {
	return (
		<div>
			<h1>About</h1>
			<p>This is the about page.</p>
		</div>
	);
}
```

### Dynamic Routes with Parameters

```tsx
// src/routes/projects/[id]/+page.tsx
import { useLocation } from '@/lib/router';

export default function ProjectDetailPage() {
	const { params } = useLocation();
	const projectId = params.id;

	return (
		<div>
			<h1>Project: {projectId}</h1>
			<p>Project details for {projectId}</p>
		</div>
	);
}
```

### Catch-All Routes

```tsx
// src/routes/blog/[...slug]/+page.tsx
import { useLocation } from '@/lib/router';

export default function BlogPage() {
	const { params } = useLocation();
	const slug = params.slug || '';

	return (
		<div>
			<h1>Blog Post</h1>
			<p>Path: {slug}</p>
		</div>
	);
}
```

### Layouts

```tsx
// src/routes/dashboard/+layout.tsx
import type { ReactNode } from 'react';

interface LayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
	return (
		<div>
			<nav>Dashboard Navigation</nav>
			<main>{children}</main>
		</div>
	);
}
```

### Navigation

```tsx
import { Link, useNavigate, useLocation } from '@/lib/router';

function MyComponent() {
	const navigate = useNavigate();
	const { pathname, params } = useLocation();

	return (
		<div>
			<p>Current path: {pathname}</p>

			{/* Declarative navigation */}
			<Link to="/about">About</Link>
			<Link to="/projects/123">Project 123</Link>

			{/* Programmatic navigation */}
			<button onClick={() => navigate('/projects')}>Go to Projects</button>

			{/* Replace current history entry */}
			<button onClick={() => navigate('/home', true)}>Replace with Home</button>
		</div>
	);
}
```

## API Reference

### Components

#### `<Router>`

The main router component that handles route matching and rendering.

**Props:**

- `fallback?: React.ComponentType` - Component to render when no route matches (404 page)
- `children?: ReactNode` - Optional children to render alongside routes

#### `<Link>`

Navigation component for client-side routing.

**Props:**

- `to: string` - Destination path
- `replace?: boolean` - Replace current history entry instead of pushing new one
- `className?: string` - CSS classes
- `children: ReactNode` - Link content
- `onClick?: (e: React.MouseEvent) => void` - Click handler

### Hooks

#### `useRouter()`

Access the router context.

**Returns:**

- `currentPath: string` - Current pathname
- `navigate: (path: string, replace?: boolean) => void` - Navigation function
- `params: Record<string, string>` - Route parameters

#### `useNavigate()`

Get the navigation function.

**Returns:**

- `navigate: (path: string, replace?: boolean) => void`

#### `useLocation()`

Get current location information.

**Returns:**

- `pathname: string` - Current pathname
- `params: Record<string, string>` - Route parameters

## Route Matching Priority

Routes are matched in order of specificity:

1. **Static segments** (highest priority)
2. **Dynamic segments** (`[param]`)
3. **Catch-all segments** (`[...slug]`, lowest priority)

Example matching order:

1. `/projects/new` (static)
2. `/projects/[id]` (dynamic)
3. `/projects/[...slug]` (catch-all)

## TypeScript Support

The router is fully typed. Route parameters are automatically inferred:

```tsx
// src/routes/users/[userId]/posts/[postId]/+page.tsx
import { useLocation } from '@/lib/router';

export default function PostPage() {
	const { params } = useLocation();
	// params.userId and params.postId are automatically typed as string

	return (
		<div>
			User: {params.userId}, Post: {params.postId}
		</div>
	);
}
```

## Performance Considerations

- Routes are discovered at build time using Vite's glob imports
- Only matched routes are rendered, keeping the bundle size minimal
- Route matching uses efficient regular expressions
- Browser history integration provides native back/forward behavior

## Migration from Other Routers

### From React Router

```tsx
// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// File-based Router
import { Router } from '@/lib/router';
// Routes are automatically discovered from file structure
```

### From Next.js

The file structure is very similar to Next.js App Router:

```
// Next.js App Router
app/
├── page.tsx
├── about/
│   └── page.tsx
└── layout.tsx

// File-based Router
routes/
├── +page.tsx
├── about/
│   └── +page.tsx
└── +layout.tsx
```

## Limitations

- Client-side only (no SSR support)
- No route preloading
- No route-level code splitting (relies on Vite's default code splitting)
- Limited to file system routes (no programmatic route registration)

## Examples

Check out the `/demo` route in this application to see all features in action, including:

- Static routes
- Dynamic routes with parameters
- Catch-all routes
- Nested layouts
- Navigation between routes
