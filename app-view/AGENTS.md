# AGENTS.md

This document outlines project-specific context and best practices for
AI agents working in this repo (React, TypeScript, Next.js).

## Project Context
- Framework: Next.js App Router (`app/`)
- Build target: static export (`output: "export"` in `next.config.ts`)
- Styling: CSS Modules (`*.module.css`) + global styles in `src/global.css`
- Path aliases: `@/*` → `src/*`, `@/public/*` → `public/*`
- MDX support: `.mdx` pages enabled via `@next/mdx`
- Images: unoptimized (static export) via `images.unoptimized: true`

## General Principles
- Prefer clarity and simplicity over cleverness.
- Keep components small and focused; compose via props.
- Avoid unnecessary abstractions and custom hooks unless reused.
- Favor accessibility: semantic HTML, labels, `alt`, and keyboard-friendly UI.

## React Best Practices
- Use function components and hooks.
- Only add `"use client"` when needed (state, effects, browser APIs).
- Keep server components pure; avoid client-only APIs in them.
- Keep props typed and descriptive; avoid `any`.
- Avoid inline anonymous functions in tight loops when it affects perf.

## TypeScript Best Practices
- Type component props and exported functions.
- Prefer explicit types for public APIs and shared modules.
- Use `as const` for literal objects used as enums.
- Avoid type assertions unless narrowing is impossible.

## Next.js App Router Guidelines
- Use `app/` segment structure and `page.tsx` for routes.
- Static export means:
  - Avoid dynamic rendering and runtime-only APIs.
  - Avoid `cookies()`, `headers()`, or `draftMode()` in pages intended for export.
  - Prefer static data and `generateStaticParams` for dynamic routes.
- Use metadata exports in layouts/pages where needed.
- Keep `layout.tsx` server-only unless there is a strong reason to opt into client.

## Styling Conventions
- Use CSS Modules for component-level styles: `component.module.css`.
- Keep global styles in `src/global.css`.
- Avoid inline styles except for dynamic, small, one-off cases.
- Prefer CSS variables for theme tokens and reuse.

## Assets and Media
- Place public assets in `public/` and reference via `/...` paths.
- Use static images for export compatibility.
- Prefer `CardGrid.StackedCard.Image` or existing media components for consistency.

## Accessibility
- Provide meaningful `alt` text for non-decorative images.
- Use `aria-label` when there is no visible label.
- Keep contrast and color usage accessible across light/dark themes.

## Testing and Scripts
- Use existing npm scripts (`npm run build`, `npm run lint`).

## When Editing
- Match existing code style and naming patterns.
- Keep diffs minimal and focused.
- Update or add comments only when they clarify non-obvious logic.

