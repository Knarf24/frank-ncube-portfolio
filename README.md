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
- Geist and Instrument Serif (via `next/font`)
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
- Playwright covers Chromium, Firefox, and WebKit locally, against the dev server.
- In CI (`CI=true`) Playwright runs against the **production build** served by `next start`, so the tested output is what ships. `playwright.config.ts` chooses the server.
- GitHub Actions runs the lint, unit, build and Chromium E2E gate on pull requests and pushes to `main`.
- To reproduce CI locally: `npm run build && CI=true npx playwright test --project=chromium`.

## Current implementation (November 2026 redesign)

The site follows the November 2026 redesign, an editorial bento layout with a warm near-black palette and a restrained green accent. The August 2026 specification and plan under `docs/superpowers/` are historical (see `AGENTS.md`).

### Routes

- `/` — homepage
- `/projects` — filterable project archive, in the approved project order
- `/projects/[slug]` — case studies: `shopaccess-ai`, `triage360`, `horizon-desk`, `etenmall`, `streetwise`
- `/projects/commerce-platform` — permanent redirect to `/projects/etenmall` (the old name)
- `/resume` — embedded résumé viewer with open and download actions; the PDF is served at `/resume/Frank_Dumoluhle_Ncube_Resume.pdf` (URL kept stable when the file is replaced)

### Project hierarchy

Order comes from `featuredOrder` in `data/` and is used on the homepage, the archive and the previous/next links:

1. **ShopAccess AI** — flagship: completed hackathon prototype, largest tile, real mock-mode screenshots, demo-video link, passphrase-protected hosted demo
2. **Triage360** — supporting tile
3. **Horizon Desk** — supporting tile (team photo, labelled as such)
4. **EtenMall** — full-width tile, "In development", architecture illustration instead of screenshots; its source repository is private
5. **Streetwise** — archive only, labelled "Archived prototype"

## Content architecture

- Portfolio content lives in typed local data files under `data/`.
- No CMS, database, or authentication in v1.
- Reusable UI lives under `components/`.
- Routes and layouts live under `app/`.

## Security headers

`next.config.ts` sends `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and a framing restriction of `frame-ancestors 'self'` (plus `X-Frame-Options: SAMEORIGIN`) on every response. Framing is limited to the site itself, not blocked, because `/resume` embeds its own PDF. There is deliberately no `script-src` policy: Next.js inlines scripts and a strict policy would need per-request nonces.

## Résumé

The résumé is a static file at `public/resume/Frank_Dumoluhle_Ncube_Resume.pdf`. Replace the file in place to keep the URL. Keep it consistent with the project descriptions in `data/`.

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
