# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Adam Grady (resume details in `resume.md`). Built as a React application from scratch with Server Components and Static Site Generation (SSG) - intentionally avoiding meta-frameworks like Next.js, TanStack Start, or React Router.

## Architecture Philosophy

- **No meta-frameworks**: Pure React with custom SSG/RSC implementation
- **Server Components first**: Leverage React Server Components for static content
- **Static Site Generation**: Pre-render pages at build time for optimal performance
- **Minimal dependencies**: Only add what's necessary

## Build Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start development server
pnpm build        # Build for production (SSG)
pnpm preview      # Preview production build
```

## Project Structure

```
src/
├── components/    # React components (server & client)
├── pages/         # Page components for SSG
├── lib/           # Utilities and helpers
├── styles/        # CSS/styling
└── assets/        # Static assets
public/            # Public static files
dist/              # Build output (SSG)
```

## Key Conventions

- Server Components by default; add `'use client'` directive only when needed for interactivity
- Resume data sourced from `resume.md` - parse at build time for SSG
- TypeScript for type safety
- CSS modules or Tailwind for styling (TBD)

## Deployment

Target: Cloudflare Pages (static hosting)
