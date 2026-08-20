# Frank Ncube portfolio

Personal portfolio showcasing my software engineering, AI, cloud, and product development work.

This repository contains the production foundation for a recruiter-facing portfolio built from the approved design specification and implementation plan in `docs/superpowers/`.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- ESLint
- Vitest and React Testing Library
- Playwright

## Requirements

- Node.js 22.x or newer
- npm 11.x or newer

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Verification

```bash
npm run lint
npm run test:run
npm run build
npm run test:e2e
```

The interactive Vitest watcher is available with `npm test`.

In restricted Codex environments where Turbopack cannot bind its internal worker port, verify the same production application with `npx next build --webpack`. The normal local and deployment build remains `npm run build`.

## Project structure

```text
app/                       Next.js App Router routes and global styles
components/                Reusable UI components added in later work packages
data/                      Typed local portfolio content added in later work packages
lib/                       Shared types, configuration, and utilities
__tests__/                 Unit and component tests
e2e/                       Playwright browser tests
docs/superpowers/specs/    Approved design specifications
docs/superpowers/plans/    Approved implementation plans
public/                    Static assets
```

WP-01 intentionally contains only a minimal homepage. Portfolio sections and visual design are implemented in later approved work packages.

## Environment and content policy

Portfolio content will remain in typed local files for v1. The project intentionally has no database, CMS, authentication, or committed environment files. Keep secrets in ignored local environment files and never commit credentials.
