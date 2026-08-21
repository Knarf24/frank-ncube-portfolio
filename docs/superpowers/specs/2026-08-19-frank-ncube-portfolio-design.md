# Frank Ncube portfolio v1 design

**Status:** Approved for implementation  
**Date:** 2026-08-19

## Purpose

Build a recruiter-facing personal portfolio that presents Frank Ncube as a Computer Information Sciences student and product builder working across software engineering, AI, cloud systems, and entrepreneurship.

Primary audience: software engineering recruiters, internship hiring managers, technical interviewers, engineers reviewing projects, and potential collaborators.

Primary action: `View my work`.

Secondary actions: `GitHub`, `Resume`, `LinkedIn`, and `Contact`.

## Visual direction

- Dark charcoal/black interface.
- Controlled green accent.
- Clean modern typography using Geist or equivalent.
- Large whitespace and restrained borders.
- Large project visuals with subtle gradients.
- Motion is deliberate; avoid cyberpunk clutter, aggressive glow, and constant bouncing.
- Dark mode only for v1.

## Homepage

Order:

1. Navigation
2. Animated hero
3. Selected work
4. About + experience
5. Education + achievements
6. Technical toolkit
7. Contact / GitHub / resume
8. Footer

Navigation: `Work`, `About`, `Experience`, `Contact`; logo mark `FN`.

## Hero

Copy direction:

> Hello, I’m  
> Frank Ncube  
> Computer Information Sciences student building software, AI systems, and digital products.

Actions: `View my work`, `GitHub`, `Resume`.

Supporting information: Livingstone College, Class of 2029, Software · AI · Cloud.

**Final-launch refinement:** the hero profile metadata pairs the official Livingstone College logo (small, ~22–28px visual height, subtle, original proportions preserved) with the visible "Livingstone College" text. The logo does not replace the text and must not compete with the `Frank Ncube` heading or the globe visual. Because the logo sits directly beside the visible institution name, it is treated as decorative (empty/hidden alt) to avoid duplicate screen-reader output.

The hero's signature visual is an animated globe built with SVG/CSS and Motion unless testing proves a clear need for WebGL. It includes rotating rings, orbiting nodes, connection paths, subtle depth, pointer parallax on desktop, and floating labels such as `AI / ML`, `Software`, `Cloud`, and `Product builder`.

One phrase can cycle between `software`, `AI systems`, `cloud tools`, and `digital products`. Use smooth transitions, not a terminal typing effect.

Mobile simplifies the globe and removes pointer interaction. `prefers-reduced-motion` disables nonessential animation.

## Selected work

The homepage intentionally gives projects unequal visual weight.

### 01 — Triage360

Largest card and flagship AI/software engineering project.

Positioning: AI-powered multi-domain support triage system.

Initial tags: Python, TypeScript, React, PostgreSQL, AI.

Actions: `Case study` and `GitHub`.

### 02 — Commerce platform

Positioning: multi-tenant commerce infrastructure for small businesses and multi-branch operations.

The current internal project name is not permanent portfolio branding until the commercial name is finalized.

### 03 — Streetwise

Positioning: applied AI and contextual decision-support product.

Its GitHub link stays secondary until the README and public repository hygiene are improved.

The homepage shows three primary projects. `View all projects` opens `/projects`.

Future strong projects replace weaker featured projects instead of making the homepage indefinitely longer.

## Projects archive and case studies

Route: `/projects`.

Possible filters: All, Software engineering, AI / ML, Web, Cloud, Product, Entrepreneurship.

Each project record includes title, slug, summary, year, category, technologies, featured status, thumbnail, screenshots, GitHub URL, live URL, case-study content, and status.

Case-study route: `/projects/[slug]`.

Major case studies follow: title, short engineering description, tags, live/GitHub actions, problem, what I built, architecture, key engineering decisions, screenshots/product walkthrough, challenges, results, what I learned, next project.

## About

Headline direction: `I build technology around real problems.`

Keep the section concise. Connect technical projects, client work, entrepreneurship, and practical problem solving without turning it into a long autobiography.

## Experience

Use a vertical timeline. Initial entries:

- Software & product development — independent projects and client work.
- Wi-Fi hotspot founder & operator — Gweru, Zimbabwe.
- Math & science tutor — Livingstone College.

Employment, entrepreneurship, programs, and projects must remain clearly distinguishable.

## Education and achievements

Use the approved structured card layout (version A).

Livingstone College — B.S. Computer Information Sciences — expected December 2029.

The displayed GPA must match the final resume before production launch.

**Final-launch refinement:** the education card also carries the official Livingstone College logo, somewhat more prominent than the hero placement but still secondary to the degree/institution information, alongside the visible "Livingstone College" text (again treated as decorative for accessibility, not a text replacement). The logo is not recolored or redrawn — original institutional branding is preserved.

Achievement candidates include International Presidential Scholar, AWS Academy Generative AI Foundations, HBCUniverse Campus Ambassador, and selected SWE/AI development programs.

## Technical toolkit

Eyebrow: `Technical toolkit`. Heading: `Tools I build with`.

**Final-launch refinement — logo marquee (supersedes the earlier grouped text-card layout):** two continuous horizontal rows of technology logos moving in opposite directions, restrained/monochrome treatment against the dark charcoal + green accent system, edge fade masks, slow enough to inspect individual logos, no visible seam. `prefers-reduced-motion` disables the continuous movement and swaps to a clean static wrapped/grid presentation of the same logos. Decorative/duplicated marquee copies are hidden from the accessibility tree; technology names remain available to assistive technology via an always-present text list so no information exists only in the animation.

Logo set is limited to technologies with a safe, redistributable local SVG brand asset: Python, JavaScript, HTML, CSS, Next.js, React, Tailwind CSS, PostgreSQL, Supabase, Sanity, Vercel, Git, GitHub. AWS and VS Code are intentionally excluded from the logo marquee — their brand marks were removed from the Simple Icons open-icon set after legal takedown requests from Amazon and Microsoft, so no safe local asset exists; both remain listed as text skills in the underlying skill data. Concepts without a canonical product/brand logo (REST APIs, TF-IDF, retrieval, prompt engineering, LLM integration) are not represented as fake brand icons; they remain in portfolio copy elsewhere.

Underlying skill groups (unchanged, still the source of truth for skill text, e.g. resume/other copy):

Languages: Python, JavaScript, HTML, CSS.

Web/application: Next.js, React, REST APIs, Tailwind CSS.

Backend/data: PostgreSQL, Supabase, Sanity CMS.

AI/data systems: LLM integration, TF-IDF, retrieval, prompt engineering.

Cloud/development: AWS, Vercel, Git, GitHub, VS Code.

TypeScript can move to Languages once it accurately reflects current working proficiency.

Currently deepening: Python engineering, machine learning, system design.

## Contact and footer

Approved final-section direction: version B, a stronger closing visual moment.

Headline concept: `Have an internship, project, or interesting problem?`

Actions: `Email me`, `LinkedIn`, `GitHub`, `View resume`.

GitHub handle: `Knarf24`.

LinkedIn slug: `frank-ncube-417a52338`.

Footer: automatic copyright year, Salisbury, North Carolina, and `Built with Next.js · TypeScript`.

## Technical architecture

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Motion for React, with CSS/SVG animation where simpler.
- Lucide icons.
- Vercel deployment.
- Git + GitHub source control.
- Typed local data files for v1; no CMS, database, or authentication.

Suggested data files:

- `data/projects.ts`
- `data/experience.ts`
- `data/education.ts`
- `data/achievements.ts`
- `data/skills.ts`

## Responsive behavior

Desktop: two-column hero, full interactive globe, large featured project, two-column secondary projects, visible navigation.

Tablet: reduced spacing, globe retained, project hierarchy preserved.

Mobile: single-column layout, simplified globe, compact menu, stacked project cards, comfortable tap targets. Minimum supported width: 320px.

## Animation rules

Allowed: hero entrance, globe rotation, node movement, subtle pointer parallax, section reveals, project hover movement, navigation transitions, button feedback, case-study diagram transitions.

Avoid: constant bouncing, aggressive glow, excessive parallax, long page-transition delays, and motion that blocks reading or navigation.

## Accessibility

Required: semantic HTML, keyboard navigation, visible focus states, adequate contrast, descriptive link text, screenshot alt text, `prefers-reduced-motion`, correct heading hierarchy, accessible mobile menu, comfortable tap targets, and hidden decorative globe semantics.

## Performance

Use optimized responsive images, lazy-load below the fold, minimize client-side JavaScript, avoid Three.js unless justified, avoid autoplay video in the initial homepage, prefer GPU-friendly transforms/opacity, and keep portfolio data static/local.

Target Lighthouse scores after optimization: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

## SEO

Homepage title concept: `Frank Ncube | Software Engineering, AI & Product Development`.

Provide route-specific metadata, Open Graph metadata, social preview image, favicon/FN mark, canonical URLs, sitemap, robots configuration, and useful structured data where appropriate.

## GitHub presentation

Link only curated repositories. Before a repository is prominent, it should have a clear README, screenshots, technical explanation, setup instructions, stack, architecture where useful, clean structure, and no inappropriate committed environment files or private credentials.

## Resume

Until the Big Tech internship resume is finalized, `/resume` can be a placeholder route. Production launch requires the portfolio and resume to agree on projects, dates, GPA, GitHub, and LinkedIn.

## Testing

Functional: navigation, project routes, external profile links, email, resume, filters, mobile menu.

Responsive checks at 320, 375, 430, 768, 1024, and 1440+ CSS pixels.

Browsers: Chrome, Safari, Firefox, Edge.

Manual accessibility: keyboard-only navigation and reduced-motion behavior.

Automated: Playwright for major flows; Lighthouse for performance/accessibility checks.

## Deployment workflow

Feature branch → GitHub → Vercel preview → visual/functional review → `main` → production.

No direct editing of production files.

## V1 exclusions

No authentication, database, CMS, blog, visitor accounts, comments, live chat, AI chatbot, admin dashboard, decorative Three.js dependency, or automatic GitHub activity graph.

## Success criteria

V1 is internship-ready when the approved visual system is faithfully implemented, mobile and desktop behavior is strong, Triage360 has a proper case study, at least three strong projects are present, GitHub/LinkedIn links are correct, recruiter-visible repos are cleaned up, the final resume is connected, there are no broken links, reduced-motion works, accessibility checks pass, production deployment is stable, and the site loads quickly on normal mobile connections.
