# Repository Guidelines

## Project Structure & Module Organization
- `src/app/`: Next.js App Router entry (e.g., `layout.tsx`, `page.tsx`, `globals.css`).
- `src/components/`: Reusable UI; `ui/*` contains shadcn-style primitives.
- `src/features/`: Feature-scoped components (e.g., intro animations).
- `src/hooks/`: Custom hooks (e.g., `use-scroll-lock.ts`).
- `src/lib/`: Utilities (`cn()` for Tailwind class merging). Import via `@/*` alias.
- `public/`: Static assets (images, icons, fonts).
- `scrolltrigger-svg-text-mask/`: Self-contained demo; not part of the Next build.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server with Turbopack at http://localhost:3000.
- `npm run build`: Production build (Turbopack).
- `npm run start`: Serve the production build.
- `npm run lint`: Run ESLint on the project.
Example: `npm run dev` then visit `/test-preview` or other routes under `src/app`.

## Coding Style & Naming Conventions
- Language: TypeScript (`strict: true`). Prefer explicit types and avoid `any`.
- Formatting/Linting: ESLint (`eslint.config.mjs`). Use `npx eslint . --fix` to auto-fix.
- Components: Export names in PascalCase; files generally kebab-case (e.g., `variable-font-and-cursor.tsx`).
- Hooks: Files start with `use-` and export `useXyz` (e.g., `use-mouse-position.ts`).
- Styling: Tailwind CSS v4; compose classes with `cn()` from `src/lib/utils.ts`.
- Client code: Add `"use client"` at top when using hooks, GSAP, or browser APIs.

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer:
  - Unit: Vitest + React Testing Library (`*.test.tsx` mirroring `src/*`).
  - E2E: Playwright for interactive flows/animations.
- Keep tests colocated with features or under `src/__tests__/`.

## Commit & Pull Request Guidelines
- Commits: Use clear, imperative messages (English or team language). Example: `feat(intro): add MultiQuoteTyping component`.
- PRs: Include purpose, linked issues, and screenshots/GIFs for UI/animation changes.
- Checklist before opening PR:
  - `npm run lint` passes; types check with `npx tsc --noEmit`.
  - No secrets committed; only necessary assets in `public/`.

## Security & Configuration Tips
- Use `.env.local` for secrets; never commit `.env*` files. Client-exposed vars must start with `NEXT_PUBLIC_`.
- Keep secrets on the server (RSC, API routes). Avoid bundling keys into client components.

