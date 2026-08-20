# Project authority

The approved portfolio specification and implementation plan are the source of truth for scope, content, design, architecture, and work-package boundaries:

- `docs/superpowers/specs/2026-08-19-frank-ncube-portfolio-design.md`
- `docs/superpowers/plans/2026-08-19-frank-ncube-portfolio.md`

The managed Next.js guidance below applies only to framework-version accuracy. It must not override or expand the approved portfolio documents.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
