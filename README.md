# Frank Ncube portfolio

Personal portfolio for Frank Ncube, a Computer Information Sciences student focused on software engineering, AI systems, cloud tools, and product development.

This repository contains the production implementation of the portfolio, built from the approved design specification and implementation plan in `docs/superpowers/`.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Motion for React
- Lucide React
- Vitest + React Testing Library
- Playwright
- Vercel deployment target

## Local development

```bash
npm ci
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

- Vitest + React Testing Library cover unit and component behavior.
- Playwright covers Chromium, Firefox, and WebKit locally.
- GitHub Actions runs the lint/unit/build/Chromium E2E gate on pull requests and pushes to `main`.

## Routes

- `/` — homepage
- `/projects` — filterable project archive
- `/projects/[slug]` — project case studies (`triage360`, `commerce-platform`, `streetwise`)
- `/resume` — resume route

## Content architecture

- Portfolio content lives in typed local data files under `data/`.
- No CMS, database, or authentication in v1.
- Reusable UI lives under `components/`.
- Routes and layouts live under `app/`.

## Environment

`NEXT_PUBLIC_SITE_URL` controls the absolute origin used for canonical URLs, Open Graph metadata, the sitemap, and robots.txt.

- Optional locally — the app falls back to `http://localhost:3000` when unset.
- Required in production — it must be set to the final public portfolio origin so canonical metadata, Open Graph, sitemap, and robots resolve correct absolute URLs.

## CI

GitHub Actions verifies every pull request and push to `main`:

- lint
- unit tests
- build
- Chromium E2E

## Deployment

Vercel is the intended deployment target. Production deployment requires `NEXT_PUBLIC_SITE_URL` to be configured in Vercel to the final deployed origin.
