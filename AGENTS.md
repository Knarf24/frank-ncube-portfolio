# Project authority

The **November 2026 redesign** is the current implementation. The code, the tests, and the "Current implementation" section of `README.md` describe what the site is and does today. Treat them as the source of truth for scope, content, design and architecture.

The August 2026 specification and plan are **historical**. They describe the original v1 build (Triage360 as the flagship project, an animated globe in the hero) and no longer match the site. Do not use them to reverse or "restore" the redesign:

- `docs/superpowers/specs/2026-08-19-frank-ncube-portfolio-design.md` (historical)
- `docs/superpowers/plans/2026-08-19-frank-ncube-portfolio.md` (historical)

## Content rules for any change

- Every claim about a person, project or credential must be backed by evidence the owner has confirmed. If it cannot be verified, omit it or mark it pending. Never invent dates, credentials, awards, placements or outcomes.
- EtenMall is publicly named and labelled "In development". Its source repository is private: never link to it, and never copy private source, infrastructure identifiers, credentials, customer data or internal plans into this repository.
- The ShopAccess AI hosted demo is passphrase-protected: label it that way, and never publish the passphrase. Do not claim a hackathon award or placement.
- Streetwise stays in the archive only, labelled as an archived prototype.
- The public contact email and the résumé PDF (`public/resume/Frank_Dumoluhle_Ncube_Resume.pdf`, URL unchanged) must stay consistent with each other and with the project descriptions.

The managed Next.js guidance below applies only to framework-version accuracy. It must not override or expand the project documents above.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
