# Frank Ncube portfolio v1 implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the approved recruiter-facing Frank Ncube portfolio with an animated hero, curated project case studies, responsive presentation, accessibility safeguards, and production testing.

**Architecture:** Use a mostly server-rendered Next.js App Router site with typed local portfolio data. Keep interactive behavior inside small client components such as the mobile menu, animated globe, reveal wrapper, and project filters; keep the rest as server components to minimize JavaScript. Project pages are generated from local data, with Motion used only where CSS/SVG alone is insufficient.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Motion for React, Lucide React, Vitest + React Testing Library, Playwright, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-19-frank-ncube-portfolio-design.md`

## Global constraints

- Dark charcoal/black interface with a controlled green accent.
- Dark mode only for v1.
- Minimum supported layout width: 320 CSS px.
- Homepage project hierarchy: Triage360 first, commerce platform second, Streetwise third.
- Homepage shows three primary projects; `/projects` contains the archive.
- No authentication, database, CMS, blog, visitor accounts, comments, live chat, AI chatbot, admin dashboard, decorative Three.js dependency, or automatic GitHub activity graph.
- `prefers-reduced-motion` must disable nonessential animation.
- No invented production metrics. Numbers shown in earlier visual mockups are decorative mockup data and must not be presented as real project results unless verified.
- Production launch requires GitHub and LinkedIn links to be correct and the final resume/GPA to be synchronized.
- Target Lighthouse scores after optimization: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Use Node.js 22.x or newer in local development so current Playwright tooling is supported; Next.js itself requires Node.js 20.9 or newer.

---

## File map

The final repository should converge on this structure:

```text
app/
  globals.css                     # theme tokens, global reset, reusable utility classes
  layout.tsx                      # root metadata, font, body shell
  page.tsx                        # homepage section composition
  projects/
    page.tsx                      # project archive route
    [slug]/
      page.tsx                    # generated project case studies
  resume/
    page.tsx                      # resume placeholder/web route
  robots.ts                       # robots configuration
  sitemap.ts                      # sitemap generation
components/
  site-header.tsx                 # desktop nav + mobile menu boundary
  mobile-menu.tsx                 # client-side mobile menu
  section-heading.tsx             # shared section heading primitive
  reveal.tsx                      # reduced-motion-aware section reveal
  hero/
    hero.tsx                      # hero content composition
    animated-globe.tsx            # client SVG/CSS/Motion globe
    rotating-role.tsx             # client rotating hero phrase
  projects/
    selected-work.tsx             # homepage project hierarchy
    project-card.tsx              # reusable project card
    project-filter.tsx            # client filter control for archive
    project-visual.tsx            # CSS/SVG visuals for projects
  sections/
    about-experience.tsx          # about + timeline section
    education-achievements.tsx    # approved version A
    technical-toolkit.tsx         # grouped skill presentation
    contact-section.tsx           # approved version B
    site-footer.tsx               # footer
  case-study/
    architecture-flow.tsx         # reusable accessible architecture diagram
    case-study-section.tsx        # section wrapper for project pages
data/
  projects.ts                     # project records and case-study content
  experience.ts                   # experience records
  education.ts                    # education record
  achievements.ts                 # achievement records
  skills.ts                       # skill groups
lib/
  portfolio-types.ts              # shared TypeScript types
  project-utils.ts                # filter/find helpers
  site-config.ts                  # canonical profile/contact/site config
e2e/
  home.spec.ts                    # homepage flows
  projects.spec.ts                # archive and case-study flows
  accessibility.spec.ts           # keyboard + reduced-motion checks
__tests__/
  project-utils.test.ts           # pure project helper tests
  site-header.test.tsx            # nav component test
  selected-work.test.tsx          # flagship project rendering test
  project-filter.test.tsx         # archive filtering behavior
public/
  projects/                       # real screenshots added as available
  resume/                         # final PDF when approved
playwright.config.ts
vitest.config.mts
vitest.setup.ts
```

---

### Task 1: Scaffold the application and testing harness

**Files:**
- Create/merge: `package.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `__tests__/smoke.test.tsx`
- Create: `e2e/smoke.spec.ts`

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `test`, `test:run`, `test:e2e` used by every later task.
- Produces: import alias `@/*` rooted at the repository.

- [ ] **Step 1: Scaffold Next.js into a temporary directory and copy it into the documentation repository**

Run from the repository root:

```bash
node --version
TMP_DIR="$(mktemp -d)"
npx create-next-app@latest "$TMP_DIR/site" --typescript --eslint --tailwind --app --use-npm --import-alias "@/*" --no-src-dir
rsync -a --exclude='.git' "$TMP_DIR/site/" ./
rm -rf "$TMP_DIR"
npm install motion lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
npx playwright install chromium firefox webkit
```

Expected: existing `docs/` remains present; Next.js files are added at repository root; install completes without errors.

- [ ] **Step 2: Write the failing unit smoke test**

Create `__tests__/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from '@/app/page'

describe('Home', () => {
  it('renders Frank Ncube as the primary heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1, name: /Frank Ncube/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Configure Vitest and verify the smoke test fails before the homepage copy is added**

Create `vitest.config.mts`:

```ts
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

Add these scripts to `package.json` without removing the generated scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Run:

```bash
npm run test:run -- __tests__/smoke.test.tsx
```

Expected: FAIL because the generated starter page does not yet expose `Frank Ncube` as the `h1`.

- [ ] **Step 4: Add the minimal homepage heading and make the unit test pass**

Replace `app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Frank Ncube</h1>
    </main>
  )
}
```

Run:

```bash
npm run test:run -- __tests__/smoke.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Configure Playwright and add the browser smoke test**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

Create `e2e/smoke.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /Frank Ncube/i })).toBeVisible()
})
```

Run:

```bash
npm run test:e2e -- e2e/smoke.spec.ts --project=chromium
```

Expected: PASS.

- [ ] **Step 6: Run the baseline quality gates**

Run:

```bash
npm run lint
npm run test:run
npm run build
```

Expected: all commands succeed.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json app eslint.config.mjs postcss.config.mjs tsconfig.json vitest.config.mts vitest.setup.ts playwright.config.ts __tests__ e2e
git commit -m "chore: scaffold portfolio app and tests"
```

---

### Task 2: Define design tokens, site config, and typed portfolio content

**Files:**
- Modify: `app/globals.css`
- Create: `lib/site-config.ts`
- Create: `lib/portfolio-types.ts`
- Create: `lib/project-utils.ts`
- Create: `data/projects.ts`
- Create: `data/experience.ts`
- Create: `data/education.ts`
- Create: `data/achievements.ts`
- Create: `data/skills.ts`
- Create: `__tests__/project-utils.test.ts`

**Interfaces:**
- Produces: `siteConfig` for metadata/footer/contact links.
- Produces: `Project`, `ExperienceItem`, `Achievement`, `SkillGroup` types.
- Produces: `projects`, `experience`, `education`, `achievements`, `skillGroups` data exports.
- Produces: `getProjectBySlug(slug)` and `filterProjects(projects, category)`.

- [ ] **Step 1: Write the failing project utility tests**

Create `__tests__/project-utils.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'
import { filterProjects, getProjectBySlug } from '@/lib/project-utils'

describe('project utilities', () => {
  it('keeps Triage360 as the first featured project', () => {
    const featured = projects.filter((project) => project.featured)
    expect(featured[0]?.slug).toBe('triage360')
  })

  it('finds a project by slug', () => {
    expect(getProjectBySlug('streetwise')?.title).toBe('Streetwise')
  })

  it('filters AI projects', () => {
    const ai = filterProjects(projects, 'AI / ML')
    expect(ai.map((project) => project.slug)).toContain('triage360')
    expect(ai.map((project) => project.slug)).toContain('streetwise')
  })
})
```

Run:

```bash
npm run test:run -- __tests__/project-utils.test.ts
```

Expected: FAIL because the data and helpers do not exist.

- [ ] **Step 2: Create the shared types**

Create `lib/portfolio-types.ts`:

```ts
export type ProjectCategory =
  | 'Software engineering'
  | 'AI / ML'
  | 'Web'
  | 'Cloud'
  | 'Product'
  | 'Entrepreneurship'

export type CaseStudySection = {
  heading: string
  body: string[]
}

export type Project = {
  title: string
  slug: string
  summary: string
  year: number
  categories: ProjectCategory[]
  technologies: string[]
  featured: boolean
  featuredOrder?: number
  status: 'Live' | 'In development' | 'Completed'
  githubUrl?: string
  liveUrl?: string
  caseStudy: CaseStudySection[]
}

export type ExperienceItem = {
  title: string
  organization: string
  location?: string
  period: string
  kind: 'Professional' | 'Entrepreneurship' | 'Campus' | 'Client work'
  summary: string
}

export type EducationRecord = {
  institution: string
  degree: string
  graduation: string
  gpa: string
  coursework: string[]
}

export type Achievement = {
  title: string
  issuer: string
  year: number
}

export type SkillGroup = {
  label: string
  skills: string[]
}
```

- [ ] **Step 3: Create verified initial project data without fabricated metrics**

Create `data/projects.ts`:

```ts
import type { Project } from '@/lib/portfolio-types'

export const projects: Project[] = [
  {
    title: 'Triage360',
    slug: 'triage360',
    summary:
      'A multi-domain support triage system combining classification, TF-IDF retrieval, risk evaluation, AI-generated responses, ticket history, and operational analytics.',
    year: 2026,
    categories: ['AI / ML', 'Software engineering'],
    technologies: ['Python', 'TypeScript', 'React', 'Express', 'PostgreSQL', 'TF-IDF'],
    featured: true,
    featuredOrder: 1,
    status: 'Completed',
    githubUrl: 'https://github.com/Knarf24/support-triangle-agent',
    caseStudy: [
      {
        heading: 'Problem',
        body: [
          'Support requests can arrive across unrelated domains and require different classification, retrieval, response, and escalation behavior.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'The project includes a Python support-triage workflow and a TypeScript application with a React interface, Express API, PostgreSQL persistence, ticket history, and statistics views.',
        ],
      },
      {
        heading: 'Architecture',
        body: [
          'Incoming tickets move through classification, domain retrieval, risk evaluation, response generation, and persistence so the UI can expose both individual results and operational history.',
        ],
      },
    ],
  },
  {
    title: 'Commerce platform',
    slug: 'commerce-platform',
    summary:
      'Multi-tenant commerce infrastructure designed for small businesses and multi-branch retail operations.',
    year: 2026,
    categories: ['Software engineering', 'Cloud', 'Product'],
    technologies: ['Next.js', 'PostgreSQL', 'Supabase', 'Vercel'],
    featured: true,
    featuredOrder: 2,
    status: 'In development',
    caseStudy: [
      {
        heading: 'Problem',
        body: [
          'Small retailers need online storefronts, branch-aware inventory, staff access, orders, payments, and operational controls without maintaining separate systems for each business.',
        ],
      },
      {
        heading: 'What I am building',
        body: [
          'A single-codebase multi-tenant platform with tenant-scoped commerce features and a product architecture designed to grow with multiple businesses.',
        ],
      },
    ],
  },
  {
    title: 'Streetwise',
    slug: 'streetwise',
    summary:
      'An applied AI product focused on contextual recommendations and location-aware decision support.',
    year: 2026,
    categories: ['AI / ML', 'Product', 'Web'],
    technologies: ['React', 'TypeScript', 'Supabase'],
    featured: true,
    featuredOrder: 3,
    status: 'Completed',
    githubUrl: 'https://github.com/Knarf24/streetwise-offer-ai',
    caseStudy: [
      {
        heading: 'Problem',
        body: [
          'Generic recommendations often ignore the user context that determines whether an option is actually useful.',
        ],
      },
      {
        heading: 'What I built',
        body: [
          'A web product that combines user context with AI-assisted recommendation flows and persistent application data.',
        ],
      },
    ],
  },
]
```

- [ ] **Step 4: Create project helpers**

Create `lib/project-utils.ts`:

```ts
import { projects } from '@/data/projects'
import type { Project, ProjectCategory } from '@/lib/portfolio-types'

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function filterProjects(
  items: Project[],
  category: ProjectCategory | 'All',
): Project[] {
  if (category === 'All') return items
  return items.filter((project) => project.categories.includes(category))
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
}
```

- [ ] **Step 5: Create the remaining content/config files**

Create `lib/site-config.ts`:

```ts
export const siteConfig = {
  name: 'Frank Ncube',
  title: 'Frank Ncube | Software Engineering, AI & Product Development',
  description:
    'Computer Information Sciences student building software, AI systems, cloud tools, and digital products.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  email: 'frankdumoluhle24@gmail.com',
  github: 'https://github.com/Knarf24',
  linkedin: 'https://www.linkedin.com/in/frank-ncube-417a52338',
  location: 'Salisbury, North Carolina',
} as const
```

Create `data/experience.ts`:

```ts
import type { ExperienceItem } from '@/lib/portfolio-types'

export const experience: ExperienceItem[] = [
  {
    title: 'Software & product development',
    organization: 'Independent projects and client work',
    period: '2026 — Present',
    kind: 'Client work',
    summary:
      'Designing and building software products, AI systems, websites, and production-facing digital experiences.',
  },
  {
    title: 'Wi-Fi hotspot founder & operator',
    organization: 'Community hotspot business',
    location: 'Gweru, Zimbabwe',
    period: 'Entrepreneurship',
    kind: 'Entrepreneurship',
    summary:
      'Worked on network deployment, voucher-based access, operations, monitoring, and a small team supporting community connectivity.',
  },
  {
    title: 'Math & science tutor',
    organization: 'Livingstone College',
    period: 'Campus',
    kind: 'Campus',
    summary:
      'Supporting students through academic problem-solving, structured explanations, and one-on-one learning.',
  },
]
```

Create `data/education.ts`:

```ts
import type { EducationRecord } from '@/lib/portfolio-types'

export const education: EducationRecord = {
  institution: 'Livingstone College',
  degree: 'B.S. Computer Information Sciences',
  graduation: 'December 2029',
  gpa: '4.0 / 4.0',
  coursework: [
    'Programming Fundamentals',
    'Computer Information Systems',
    'Networks & Telecommunications',
    'Introduction to Computing',
  ],
}
```

Create `data/achievements.ts`:

```ts
import type { Achievement } from '@/lib/portfolio-types'

export const achievements: Achievement[] = [
  { title: 'Generative AI Foundations', issuer: 'AWS Academy', year: 2026 },
  { title: 'International Presidential Scholar', issuer: 'Livingstone College', year: 2026 },
  { title: 'Campus Ambassador', issuer: 'HBCUniverse', year: 2026 },
]
```

Create `data/skills.ts`:

```ts
import type { SkillGroup } from '@/lib/portfolio-types'

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', skills: ['Python', 'JavaScript', 'HTML', 'CSS'] },
  { label: 'Web & application', skills: ['Next.js', 'React', 'REST APIs', 'Tailwind CSS'] },
  { label: 'Backend & data', skills: ['PostgreSQL', 'Supabase', 'Sanity CMS'] },
  { label: 'AI & data systems', skills: ['LLM integration', 'TF-IDF', 'Retrieval', 'Prompt engineering'] },
  { label: 'Cloud & development', skills: ['AWS', 'Vercel', 'Git', 'GitHub', 'VS Code'] },
]
```

- [ ] **Step 6: Add the design tokens**

Replace the starter color rules in `app/globals.css` with variables that include:

```css
:root {
  --background: #090b0a;
  --surface: #101310;
  --surface-elevated: #151915;
  --text: #f4f7f4;
  --muted: #9da69f;
  --border: #273029;
  --accent: #74f79a;
  --accent-strong: #35d96d;
  --accent-soft: rgba(116, 247, 154, 0.1);
  --max-width: 1180px;
}

html {
  scroll-behavior: smooth;
  background: var(--background);
}

body {
  margin: 0;
  background: var(--background);
  color: var(--text);
}

::selection {
  background: var(--accent);
  color: #071008;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

Keep Tailwind's generated import/configuration intact.

- [ ] **Step 7: Run tests and commit**

Run:

```bash
npm run test:run -- __tests__/project-utils.test.ts
npm run lint
```

Expected: PASS.

Commit:

```bash
git add app/globals.css lib data __tests__/project-utils.test.ts
git commit -m "feat: add portfolio content model and design tokens"
```

---

### Task 3: Build the site shell and responsive navigation

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `components/site-header.tsx`
- Create: `components/mobile-menu.tsx`
- Create: `components/section-heading.tsx`
- Create: `__tests__/site-header.test.tsx`

**Interfaces:**
- Produces: `<SiteHeader />` with anchors `#work`, `#about`, `#experience`, `#contact`.
- Produces: `<SectionHeading eyebrow title description?>`.
- `MobileMenu` owns only menu open/close state.

- [ ] **Step 1: Write the failing navigation test**

Create `__tests__/site-header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from '@/components/site-header'

describe('SiteHeader', () => {
  it('renders the FN mark and primary navigation', () => {
    render(<SiteHeader />)
    expect(screen.getByText('FN')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#work')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })
})
```

Run:

```bash
npm run test:run -- __tests__/site-header.test.tsx
```

Expected: FAIL because `SiteHeader` does not exist.

- [ ] **Step 2: Implement the reusable section heading**

Create `components/section-heading.tsx`:

```tsx
type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">{description}</p>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 3: Implement the mobile menu client boundary**

Create `components/mobile-menu.tsx`:

```tsx
'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
] as const

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-[var(--border)]"
      >
        {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
      </button>
      {open ? (
        <nav aria-label="Mobile navigation" className="absolute left-4 right-4 top-20 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4">
          <ul className="space-y-1">
            {links.map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 4: Implement `SiteHeader` and make the test pass**

Create `components/site-header.tsx`:

```tsx
import { MobileMenu } from '@/components/mobile-menu'

const links = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Experience', '#experience'],
  ['Contact', '#contact'],
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-[color:rgba(9,11,10,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--max-width)] items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="font-medium tracking-wide">FN</a>
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm text-[var(--muted)]">
            {links.map(([label, href]) => (
              <li key={href}><a className="transition-colors hover:text-[var(--text)]" href={href}>{label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="hidden md:block rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)]">Open to internships</div>
        <MobileMenu />
      </div>
    </header>
  )
}
```

Run:

```bash
npm run test:run -- __tests__/site-header.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Add Geist and root metadata shell**

Update `app/layout.tsx` so it imports `Geist` from `next/font/google`, applies the font class to `<body>`, and imports `siteConfig` for basic metadata. Keep `metadataBase` derived from `new URL(siteConfig.url)`.

The metadata object should include:

```ts
export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
}
```

Compose `<SiteHeader />` above `{children}`.

- [ ] **Step 6: Add the page shell and run quality gates**

Update `app/page.tsx` to use `<main id="top">` and a centered max-width container beneath the header while preserving the tested `h1`.

Run:

```bash
npm run test:run
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app components __tests__/site-header.test.tsx
git commit -m "feat: add portfolio shell and navigation"
```

---

### Task 4: Implement the animated hero and signature globe

**Files:**
- Create: `components/hero/hero.tsx`
- Create: `components/hero/animated-globe.tsx`
- Create: `components/hero/rotating-role.tsx`
- Create: `components/reveal.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `e2e/accessibility.spec.ts`

**Interfaces:**
- Produces: `<Hero />` rendered directly below the header.
- Produces: `<AnimatedGlobe />` with no semantic noise from decorative SVG elements.
- Produces: `<RotatingRole roles intervalMs>`.
- Produces: `<Reveal>` for later sections.

- [ ] **Step 1: Write the failing reduced-motion browser test**

Create `e2e/accessibility.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('hero is readable with reduced motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Frank Ncube' })).toBeVisible()
  await expect(page.getByText(/Computer Information Sciences student/i)).toBeVisible()
  await expect(page.getByTestId('animated-globe')).toHaveAttribute('data-reduced-motion', 'true')
})
```

Run:

```bash
npm run test:e2e -- e2e/accessibility.spec.ts --project=chromium
```

Expected: FAIL because the globe is not implemented.

- [ ] **Step 2: Implement the rotating phrase with reduced-motion fallback**

Create `components/hero/rotating-role.tsx`:

```tsx
'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

type RotatingRoleProps = {
  roles: string[]
  intervalMs?: number
}

export function RotatingRole({ roles, intervalMs = 2200 }: RotatingRoleProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % roles.length), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs, reduceMotion, roles.length])

  if (reduceMotion) return <span className="text-[var(--accent)]">{roles[0]}</span>

  return (
    <span className="relative inline-grid min-w-[8.5ch] text-[var(--accent)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
```

- [ ] **Step 3: Implement the animated globe as SVG/CSS + Motion**

Create `components/hero/animated-globe.tsx` with a client boundary. Use `useMotionValue`, `useSpring`, and `useReducedMotion` from `motion/react`. Render an outer circular SVG with three elliptical orbit paths, six decorative nodes, and a centered `Build / Learn / Ship` label. Set `aria-hidden="true"` on the SVG and `data-testid="animated-globe"` on the wrapper. Set `data-reduced-motion={String(Boolean(reduceMotion))}`.

Pointer movement may update only `x` and `y` transforms with a maximum displacement of 10px. When reduced motion is enabled, do not start rotation or pointer movement.

The outer wrapper must include:

```tsx
className="relative mx-auto aspect-square w-full max-w-[360px]"
```

Floating labels:

```ts
['AI / ML', 'Software', 'Cloud', 'Product builder']
```

- [ ] **Step 4: Implement the hero composition**

Create `components/hero/hero.tsx`:

```tsx
import { AnimatedGlobe } from '@/components/hero/animated-globe'
import { RotatingRole } from '@/components/hero/rotating-role'
import { siteConfig } from '@/lib/site-config'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24">
      <div className="mx-auto grid max-w-[var(--max-width)] items-center gap-12 md:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-sm text-[var(--muted)]">Hello, I’m</p>
          <h1 className="mt-2 text-5xl font-medium tracking-[-0.04em] sm:text-6xl lg:text-7xl">Frank Ncube</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] md:text-xl">
            Computer Information Sciences student building{' '}
            <RotatingRole roles={['software', 'AI systems', 'cloud tools', 'digital products']} />,
            AI systems, and digital products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-[#071008]">View my work</a>
            <a href={siteConfig.github} className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm">GitHub ↗</a>
            <a href="/resume" className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm">Resume</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
            <span>Livingstone College</span><span>Class of 2029</span><span>Software · AI · Cloud</span>
          </div>
        </div>
        <AnimatedGlobe />
      </div>
    </section>
  )
}
```

Before committing, revise the sentence so it does not duplicate `AI systems` when the rotating phrase itself shows `AI systems`. The final copy must remain grammatically correct for every role value; one acceptable form is: `Computer Information Sciences student building <RotatingRole ... />.`

- [ ] **Step 5: Implement a reusable reduced-motion-aware reveal wrapper**

Create `components/reveal.tsx`:

```tsx
'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function Reveal({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45 }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 6: Wire the hero into the homepage and make reduced-motion test pass**

Update `app/page.tsx` so `<Hero />` is the first page section.

Run:

```bash
npm run test:e2e -- e2e/accessibility.spec.ts --project=chromium
npm run test:run
npm run lint
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app components/hero components/reveal.tsx e2e/accessibility.spec.ts
git commit -m "feat: add animated portfolio hero"
```

---

### Task 5: Build selected work with Triage360 as the flagship

**Files:**
- Create: `components/projects/selected-work.tsx`
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/project-visual.tsx`
- Create: `__tests__/selected-work.test.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- `ProjectCard` consumes one `Project` and `variant: 'flagship' | 'standard'`.
- `ProjectVisual` consumes `slug` and returns decorative-but-informative CSS/SVG visuals without fake metrics.
- `SelectedWork` consumes `getFeaturedProjects()` and exposes section id `work`.

- [ ] **Step 1: Write the failing hierarchy test**

Create `__tests__/selected-work.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SelectedWork } from '@/components/projects/selected-work'

describe('SelectedWork', () => {
  it('renders Triage360 first and exposes all three featured projects', () => {
    render(<SelectedWork />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings[0]).toHaveTextContent('Triage360')
    expect(screen.getByRole('heading', { name: 'Commerce platform' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Streetwise' })).toBeInTheDocument()
  })
})
```

Run and expect FAIL.

- [ ] **Step 2: Implement `ProjectVisual` without fabricated statistics**

For `triage360`, show a labeled flow:

```text
Incoming ticket → Classification → Retrieval → Risk evaluation → Response
```

For `commerce-platform`, show two tenant nodes feeding a shared platform node with labels `Orders`, `Inventory`, `Payments`, and `Analytics`.

For `streetwise`, show `User context → Intelligent matching → Ranked recommendations`.

Every visual wrapper uses `aria-hidden="true"`; project meaning remains available in surrounding text.

- [ ] **Step 3: Implement `ProjectCard`**

Requirements:

- Flagship uses `md:grid-cols-[1.05fr_.95fr]`, larger heading, and prominent visual.
- Standard cards share a two-column row at desktop and stack at mobile.
- Technology chips are text, not logo images.
- GitHub link appears only when `githubUrl` exists.
- Case-study link always points to `/projects/${project.slug}`.
- Hover motion is transform-only and disabled under reduced motion via CSS media query.

- [ ] **Step 4: Implement `SelectedWork` and make the hierarchy test pass**

Use:

```tsx
const [flagship, ...secondary] = getFeaturedProjects()
```

Render the flagship first, then a `md:grid-cols-2` container for secondary projects, then a `View all projects →` link to `/projects`.

Run:

```bash
npm run test:run -- __tests__/selected-work.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Add the section to the homepage and commit**

Wrap `<SelectedWork />` in `<Reveal>` below the hero.

Run:

```bash
npm run test:run
npm run lint
npm run build
```

Commit:

```bash
git add app components/projects __tests__/selected-work.test.tsx
git commit -m "feat: add selected work section"
```

---

### Task 6: Build About, Experience, Education, Achievements, and Technical Toolkit

**Files:**
- Create: `components/sections/about-experience.tsx`
- Create: `components/sections/education-achievements.tsx`
- Create: `components/sections/technical-toolkit.tsx`
- Modify: `app/page.tsx`
- Create: `e2e/home.spec.ts`

**Interfaces:**
- `AboutExperience` exposes `id="about"` and contains a nested experience anchor `id="experience"`.
- `EducationAchievements` consumes `education` and `achievements`.
- `TechnicalToolkit` consumes `skillGroups`.

- [ ] **Step 1: Write the failing homepage content E2E test**

Create `e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('homepage presents the approved content hierarchy', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'I build technology around real problems.' })).toBeVisible()
  await expect(page.getByText('Livingstone College')).toBeVisible()
  await expect(page.getByText('Generative AI Foundations')).toBeVisible()
  await expect(page.getByText('Python', { exact: true })).toBeVisible()
})
```

Run on Chromium and expect FAIL.

- [ ] **Step 2: Implement About + Experience**

Use the approved two-column layout. Left column contains the concise About copy and interest chips. Right column renders the experience array as a vertical timeline with kind labels so entrepreneurship, campus work, and client work are visibly different.

Do not display an invented `3+ technical domains` metric. The only numeric academic metric may be GPA after verifying it against the final resume before launch.

- [ ] **Step 3: Implement Education + Achievements using version A**

Create a structured education card with institution, degree, graduation, GPA, and coursework chips. Under it, render achievement cards from `achievements`.

- [ ] **Step 4: Implement Technical Toolkit using version A**

Render each skill group with a heading and text chips. Add a final `Currently deepening` callout with `Python engineering · Machine learning · System design`.

- [ ] **Step 5: Wire the sections into the homepage and pass the E2E test**

Order below selected work:

```tsx
<Reveal><AboutExperience /></Reveal>
<Reveal><EducationAchievements /></Reveal>
<Reveal><TechnicalToolkit /></Reveal>
```

Run:

```bash
npm run test:e2e -- e2e/home.spec.ts --project=chromium
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app components/sections e2e/home.spec.ts
git commit -m "feat: add profile education and skills sections"
```

---

### Task 7: Build the projects archive and filters

**Files:**
- Create: `app/projects/page.tsx`
- Create: `components/projects/project-filter.tsx`
- Create: `__tests__/project-filter.test.tsx`
- Create: `e2e/projects.spec.ts`

**Interfaces:**
- `ProjectFilter` consumes `projects` and renders category buttons locally; it does not fetch remote data.
- Archive page is server-rendered shell + client filter only.

- [ ] **Step 1: Write the failing filter component test**

Create `__tests__/project-filter.test.tsx`:

```tsx
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { projects } from '@/data/projects'
import { ProjectFilter } from '@/components/projects/project-filter'

describe('ProjectFilter', () => {
  it('shows AI projects when AI / ML is selected', async () => {
    const user = userEvent.setup()
    render(<ProjectFilter projects={projects} />)
    await user.click(screen.getByRole('button', { name: 'AI / ML' }))
    expect(screen.getByRole('heading', { name: 'Triage360' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Streetwise' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Commerce platform' })).not.toBeInTheDocument()
  })
})
```

Run and expect FAIL.

- [ ] **Step 2: Implement `ProjectFilter`**

Use a client component with state typed as `ProjectCategory | 'All'`. Buttons must use `aria-pressed={active === category}`. Reuse `ProjectCard` with `variant="standard"`.

Categories shown in this order:

```ts
['All', 'Software engineering', 'AI / ML', 'Web', 'Cloud', 'Product', 'Entrepreneurship']
```

- [ ] **Step 3: Implement `/projects`**

The route includes a back link to `/`, heading `Projects`, short explanation, and `<ProjectFilter projects={projects} />`.

- [ ] **Step 4: Add archive E2E navigation coverage**

Append to `e2e/projects.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('project archive is reachable from the homepage', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /View all projects/i }).click()
  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()
})
```

- [ ] **Step 5: Run tests and commit**

```bash
npm run test:run -- __tests__/project-filter.test.tsx
npm run test:e2e -- e2e/projects.spec.ts --project=chromium
npm run lint
npm run build
```

Commit:

```bash
git add app/projects components/projects/project-filter.tsx __tests__/project-filter.test.tsx e2e/projects.spec.ts
git commit -m "feat: add filterable project archive"
```

---

### Task 8: Build reusable project case studies

**Files:**
- Create: `app/projects/[slug]/page.tsx`
- Create: `components/case-study/case-study-section.tsx`
- Create: `components/case-study/architecture-flow.tsx`
- Modify: `e2e/projects.spec.ts`

**Interfaces:**
- `generateStaticParams()` returns all project slugs.
- `generateMetadata({ params })` returns route-specific title/description.
- Unknown slugs call `notFound()`.
- `ArchitectureFlow` consumes `labels: string[]`.

- [ ] **Step 1: Write the failing Triage360 case-study E2E test**

Append:

```ts
test('Triage360 has a dedicated engineering case study', async ({ page }) => {
  await page.goto('/projects/triage360')
  await expect(page.getByRole('heading', { level: 1, name: 'Triage360' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Problem' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Architecture' })).toBeVisible()
  await expect(page.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
    'href',
    'https://github.com/Knarf24/support-triangle-agent',
  )
})
```

Run and expect FAIL.

- [ ] **Step 2: Implement the case-study primitives**

`CaseStudySection` accepts `heading` and `body: string[]` and renders a semantic `<section>` with an `<h2>`.

`ArchitectureFlow` renders labeled nodes connected by CSS arrows. For Triage360 use:

```ts
['Incoming ticket', 'Classification', 'TF-IDF retrieval', 'Risk evaluation', 'AI response', 'History / stats']
```

Give the diagram `role="img"` and `aria-label` that reads the same flow in plain text.

- [ ] **Step 3: Implement the dynamic case-study route**

Use `getProjectBySlug`. Render project title, summary, status, technology chips, conditional GitHub/live links, the architecture flow for Triage360, and every `caseStudy` section from data.

For projects whose case-study data does not contain `Architecture`, render the existing data sections only; do not fabricate technical details.

- [ ] **Step 4: Generate static params and metadata**

`generateStaticParams()` maps `projects` to `{ slug }`.

`generateMetadata` should produce `${project.title} | Frank Ncube` and project summary.

- [ ] **Step 5: Pass tests and commit**

```bash
npm run test:e2e -- e2e/projects.spec.ts --project=chromium
npm run lint
npm run build
```

Commit:

```bash
git add app/projects components/case-study e2e/projects.spec.ts
git commit -m "feat: add project case study system"
```

---

### Task 9: Build the approved contact section, footer, and resume route

**Files:**
- Create: `components/sections/contact-section.tsx`
- Create: `components/sections/site-footer.tsx`
- Create: `app/resume/page.tsx`
- Modify: `app/page.tsx`
- Modify: `e2e/home.spec.ts`

**Interfaces:**
- Contact section id: `contact`.
- External profile links come only from `siteConfig`.
- Resume route is explicitly marked as in-progress until the final PDF is available.

- [ ] **Step 1: Extend the E2E test with contact-link assertions**

Append to `e2e/home.spec.ts`:

```ts
test('contact links point to the verified profiles', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /LinkedIn/i }).last()).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/frank-ncube-417a52338',
  )
  await expect(page.getByRole('link', { name: /GitHub/i }).last()).toHaveAttribute(
    'href',
    'https://github.com/Knarf24',
  )
})
```

Run and expect FAIL.

- [ ] **Step 2: Implement contact section version B**

Use the approved large closing headline:

```text
Have an internship, project, or interesting problem?
```

Copy:

```text
I’m interested in opportunities where I can learn quickly, contribute technically, and work on products people use.
```

Buttons: email, LinkedIn, GitHub, resume. Use `mailto:${siteConfig.email}` for email.

Include three compact cards: GitHub `@Knarf24`, LinkedIn `Frank Ncube`, Resume `View resume`.

- [ ] **Step 3: Implement the footer**

Use `new Date().getFullYear()` for copyright year. Render `siteConfig.location` and `Built with Next.js · TypeScript`.

- [ ] **Step 4: Implement the resume placeholder route**

Until the final PDF is approved, `/resume` renders:

- heading `Resume`
- text `My internship resume is being updated. The final PDF will be published here before portfolio launch.`
- links to GitHub and LinkedIn
- back link to homepage

Do not publish an outdated PDF simply to fill the route.

- [ ] **Step 5: Wire contact/footer and pass tests**

Add contact and footer after the technical toolkit.

Run:

```bash
npm run test:e2e -- e2e/home.spec.ts --project=chromium
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app components/sections e2e/home.spec.ts
git commit -m "feat: add contact footer and resume route"
```

---

### Task 10: Add SEO, social metadata, sitemap, and robots

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `app/icon.svg`
- Create: `app/opengraph-image.tsx`
- Create: `e2e/seo.spec.ts`

**Interfaces:**
- Canonical site base comes from `siteConfig.url`.
- Sitemap includes `/`, `/projects`, `/resume`, and every project slug.

- [ ] **Step 1: Write the failing metadata browser test**

Create `e2e/seo.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

test('homepage exposes title and description metadata', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Frank Ncube | Software Engineering, AI & Product Development')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Computer Information Sciences student/i)
})
```

Run and expect FAIL if full metadata is not yet present.

- [ ] **Step 2: Expand root metadata**

Add Open Graph and canonical metadata using `siteConfig`. Use the generated `/opengraph-image` route.

- [ ] **Step 3: Implement sitemap and robots**

`sitemap.ts` maps project slugs to absolute URLs based on `siteConfig.url`.

`robots.ts` allows `/` and points to `${siteConfig.url}/sitemap.xml`.

- [ ] **Step 4: Create the FN icon and Open Graph image**

`app/icon.svg` should be a simple dark square/circle mark with `FN` represented as vector paths or text converted to path only if available; do not embed remote fonts.

`app/opengraph-image.tsx` uses Next.js `ImageResponse` with Frank Ncube, the portfolio descriptor, dark background, and green accent. No external image fetch is necessary.

- [ ] **Step 5: Run tests and commit**

```bash
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000 npm run test:e2e -- e2e/seo.spec.ts --project=chromium
npm run lint
npm run build
```

Commit:

```bash
git add app e2e/seo.spec.ts
git commit -m "feat: add portfolio metadata and SEO routes"
```

---

### Task 11: Harden responsive behavior and accessibility

**Files:**
- Modify: affected components and `app/globals.css`
- Modify: `e2e/accessibility.spec.ts`
- Create: `e2e/responsive.spec.ts`

**Interfaces:**
- All interactive controls remain keyboard reachable.
- No horizontal overflow at approved widths.

- [ ] **Step 1: Add the failing responsive test**

Create `e2e/responsive.spec.ts`:

```ts
import { expect, test } from '@playwright/test'

for (const width of [320, 375, 430, 768, 1024, 1440]) {
  test(`homepage has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
    expect(overflow).toBe(false)
  })
}
```

Run and fix any failures rather than hiding overflow globally.

- [ ] **Step 2: Add keyboard navigation coverage**

Append to `e2e/accessibility.spec.ts`:

```ts
test('primary actions are keyboard reachable', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toBeVisible()

  for (let i = 0; i < 12; i += 1) {
    const text = await page.locator(':focus').textContent()
    if (text?.includes('View my work')) break
    await page.keyboard.press('Tab')
  }

  await expect(page.locator(':focus')).toContainText('View my work')
})
```

- [ ] **Step 3: Fix responsive issues at each specified width**

Inspect 320, 375, 430, 768, 1024, and 1440 widths. Required fixes include:

- hero stacks before text becomes cramped;
- globe never exceeds its container;
- buttons wrap instead of overflowing;
- secondary projects stack on narrow widths;
- timeline cards stay inside the viewport;
- contact headline wraps naturally;
- minimum interactive height is 44px for primary touch controls.

- [ ] **Step 4: Verify semantic/accessibility details**

Manual checks:

```text
- exactly one h1 per page
- logical h2/h3 order
- visible focus ring on links/buttons
- mobile menu exposes aria-expanded
- decorative globe does not appear in the accessibility tree
- architecture diagram has a useful text alternative
- reduced-motion removes continuous orbit/reveal animation
```

- [ ] **Step 5: Run the full cross-browser suite and commit**

```bash
npm run test:run
npm run test:e2e
npm run lint
npm run build
```

Expected: PASS in Chromium, Firefox, and WebKit.

Commit:

```bash
git add app components e2e
 git commit -m "fix: harden responsive and accessible behavior"
```

---

### Task 12: Add continuous integration and production deployment readiness

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.nvmrc`
- Create: `README.md`
- Modify: `.gitignore` only if needed

**Interfaces:**
- Pull requests run lint, unit tests, build, and Chromium E2E.
- Vercel receives `NEXT_PUBLIC_SITE_URL` in production after the final production URL is known.

- [ ] **Step 1: Create Node version pin**

Create `.nvmrc`:

```text
22
```

- [ ] **Step 2: Create GitHub Actions CI**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run lint
      - run: npm run test:run
      - run: npm run build
      - run: npm run test:e2e -- --project=chromium
```

- [ ] **Step 3: Write a recruiter/developer-facing README**

`README.md` should include:

```markdown
# Frank Ncube portfolio

Personal portfolio for Frank Ncube, a Computer Information Sciences student focused on software engineering, AI, cloud systems, and product development.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Motion for React
- Vitest
- Playwright

## Local development

\`\`\`bash
npm ci
npm run dev
\`\`\`

## Verification

\`\`\`bash
npm run lint
npm run test:run
npm run build
npm run test:e2e
\`\`\`

## Content

Portfolio content is stored in typed files under `data/`. The site intentionally has no CMS or database in v1.
```

- [ ] **Step 4: Run the exact CI commands locally**

```bash
npm ci
npx playwright install chromium
npm run lint
npm run test:run
npm run build
npm run test:e2e -- --project=chromium
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add .github .nvmrc README.md .gitignore
git commit -m "ci: add portfolio verification workflow"
```

---

### Task 13: Final content audit, repository hygiene, and launch gate

**Files:**
- Modify: `data/projects.ts`, `data/education.ts`, `lib/site-config.ts` only when verified source information differs
- Add: `public/projects/*` real project screenshots when available
- Add: `public/resume/frank-ncube-resume.pdf` only after resume approval
- Modify: `app/resume/page.tsx` after the PDF exists

**Interfaces:**
- Production links and claims must match the final resume and public repositories.

- [ ] **Step 1: Audit public project repositories before exposing recruiter links**

For Triage360 and Streetwise, verify:

```text
README quality
screenshots/demo
setup instructions
public environment-file hygiene
no private credentials
repository description
consistent project name
```

Streetwise currently requires special attention because its README needs replacement and a `.env` file is committed. Publishable client configuration is different from a private service-role secret, but the repository should still follow a deliberate `.env.example` + ignored local environment workflow before it is promoted heavily.

- [ ] **Step 2: Verify every portfolio claim against the final resume/current facts**

Check exact values for:

```text
GPA
graduation date
experience dates
achievement titles
project status
technology proficiency
location
email
GitHub
LinkedIn
```

Remove or revise any claim that cannot be supported.

- [ ] **Step 3: Add real screenshots**

For each featured project, add optimized WebP/AVIF screenshots under `public/projects/<slug>/` and replace CSS-only visuals where the real interface tells the story better. Keep accessible alt text in project data/components.

- [ ] **Step 4: Connect the final resume**

After the final PDF is approved:

1. Add it as `public/resume/frank-ncube-resume.pdf`.
2. Replace the placeholder resume copy with a web summary and a direct download link to `/resume/frank-ncube-resume.pdf`.
3. Re-run link tests.

- [ ] **Step 5: Run launch verification**

```bash
npm run lint
npm run test:run
npm run build
npm run test:e2e
```

Then manually run Lighthouse against the production preview and record:

```text
Performance       target ≥ 90
Accessibility     target ≥ 95
Best Practices    target ≥ 95
SEO               target ≥ 95
```

Do not state the targets as achieved unless the measured report meets them.

- [ ] **Step 6: Deploy through Vercel preview, review, then promote**

Deployment sequence:

```text
feature branch → GitHub → Vercel preview → visual/functional review → main → production
```

After Vercel assigns the production URL, set `NEXT_PUBLIC_SITE_URL` to that canonical URL and redeploy so metadata, sitemap, and canonical links use the production origin.

- [ ] **Step 7: Commit final launch content changes**

```bash
git add data lib app public README.md
git commit -m "feat: prepare portfolio for internship launch"
```

