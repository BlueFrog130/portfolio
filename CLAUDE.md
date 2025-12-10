# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Adam Grady. Built as a React 19 application with custom routing, Static Site Generation (SSG), and a Cloudflare Workers backend - intentionally avoiding meta-frameworks like Next.js, TanStack Start, or React Router.

## Architecture Philosophy

- **No meta-frameworks**: Pure React with custom SSG and routing implementation
- **Vite + Cloudflare**: Uses Vite 7 with `@cloudflare/vite-plugin` for dual client/worker builds
- **Static Site Generation**: Auto-crawling SSG script pre-renders pages at build time
- **Cloudflare Workers backend**: API routes for analytics and AI chat via Hono
- **React Compiler**: Uses `babel-plugin-react-compiler` for automatic optimizations
- **Minimal dependencies**: Only add what's necessary

## Tech Stack

- **Frontend**: React 19 (canary), TypeScript, Tailwind CSS v4
- **Build**: Vite 7, MDX for project content
- **Backend**: Cloudflare Workers with Hono, D1 database for analytics
- **AI**: Cloudflare AI (Llama 4) for project chat feature
- **Styling**: Tailwind CSS with `@tailwindcss/typography` and `@tailwindcss/container-queries`

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start development server (Vite + Workers)
pnpm build            # Build for production (client + server + SSG)
pnpm build:environments  # Build client and server only (no SSG)
pnpm ssg              # Run SSG script only
pnpm preview          # Preview production build
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting
```

## Project Structure

```
src/
├── lib/
│   ├── analytics/     # Client-side analytics (sessions, pageviews, web vitals)
│   ├── chat/          # AI chat utilities
│   ├── components/    # Shared components (Header, Footer, Layout, Tooltip, ModeSwitcher)
│   ├── content/       # Content loading utilities
│   ├── mode/          # Portfolio mode context (web vs terminal)
│   ├── router/        # Custom client-side router (Link, Router, context)
│   ├── data.ts        # Resume data (experiences, education, skills, publications)
│   └── util.ts        # General utilities
├── content/
│   └── projects/      # MDX project files with metadata
├── pages/
│   ├── +Page.tsx      # Home page
│   ├── 404/           # 404 page
│   ├── project/[slug]/ # Dynamic project pages
│   └── terminal/      # Terminal mode with AI commands
├── styles/
│   └── global.css     # Global Tailwind styles
├── routes.ts          # Route definitions with lazy loading
├── App.tsx            # Root app component
├── main.tsx           # Client entry point
└── entry-server.tsx   # SSG entry point
worker/
└── index.ts           # Cloudflare Worker (Hono API)
scripts/
└── ssg.ts             # Auto-crawling SSG build script
public/                # Public static files
dist/
├── client/            # Client build output
├── server/            # Server build output
└── static/            # Final SSG output (deployed)
```

## Key Features

### Dual Mode UI
- **Web mode**: Standard portfolio view at `/`
- **Terminal mode**: CLI-style interface at `/terminal` with AI commands

### Custom Router
- File-based-like routing with lazy loading
- Dynamic routes (e.g., `/projects/:slug`)
- View transitions support

### MDX Projects
- Projects defined as MDX files in `src/content/projects/`
- Metadata exported from each MDX file (title, description, technologies, etc.)
- Custom Vite plugin for metadata extraction (`vite-plugin-mdx-metadata.ts`)

### Analytics
- Client-side analytics with session tracking
- Web Vitals collection (LCP, FID, CLS, etc.)
- D1 database storage via Worker API

### AI Chat
- Per-project AI chat feature using Cloudflare AI
- Streaming responses with SSE
- Usage tracking and analytics

## Key Conventions

- TypeScript for type safety
- Tailwind CSS v4 for styling (no CSS modules)
- Resume/profile data in `src/lib/data.ts` - single source of truth
- Projects as MDX files in `src/content/projects/`
- `@/` path alias maps to `src/`

## Deployment

Target: Cloudflare Workers + Static Assets

- Worker serves API routes (`/api/*`)
- Static assets served from `dist/static/`
- D1 database for analytics
- Cloudflare AI for chat features

Configuration in `wrangler.jsonc`.

## MCP

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.
