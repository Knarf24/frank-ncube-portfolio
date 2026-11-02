import type { Project } from "@/lib/portfolio-types";

// Every statement below was checked against the private EtenMall repository
// (architecture notes, ADRs, migrations, source, and release records) in
// read-only mode. The repository stays private and is deliberately not linked.
// No infrastructure identifiers, credentials, customer data or internal
// financial plans are reproduced here.
export const etenMall: Project = {
  title: "EtenMall",
  slug: "etenmall",
  summary:
    "A multi-tenant e-commerce platform I am developing to help independent retailers in Zimbabwe and other African markets set up online storefronts and run their businesses. It is in development: it has not launched commercially, and payments run in test mode.",
  year: 2026,
  categories: ["Software engineering", "Cloud", "Product"],
  technologies: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
  featured: true,
  featuredOrder: 4,
  status: "In development",
  glance: [
    { label: "Role", value: "Founder; requirements, architecture, and releases" },
    { label: "Market", value: "Zimbabwe and other African markets" },
    { label: "Payments", value: "Test mode only; not live" },
  ],
  caseStudy: [
    {
      heading: "Overview and intended users",
      body: [
        "EtenMall runs many independent retailers on one codebase and one database. Each retailer, called a tenant, gets its own branded storefront, staff accounts and branches, and differs from other tenants by configuration instead of custom code.",
        "It is designed for four groups of users:",
      ],
      items: [
        "Independent retailers and their staff, who manage catalog, branches, inventory and orders from a dashboard.",
        "Customers, who browse a retailer’s storefront and check out as guests without creating an account.",
        "A platform operator, who oversees merchants and reviews held payments.",
        "Retailers starting out, who register and are guided through store setup.",
      ],
    },
    {
      heading: "The retail problem",
      body: [
        "The project’s own market analysis frames the gap this way: independent African retailers choose between generic global website builders, which are expensive in hard currency and not built for local payment methods or local delivery realities, custom software that is too costly and slow for a single shop to commission, or having no online presence at all.",
        "EtenMall explores a shared platform built for those conditions, starting with clothing and fashion retail in Zimbabwe.",
      ],
    },
    {
      heading: "My role",
      body: [
        "I am the founder of EtenMall. My work is defining the platform requirements, making the architectural decisions, directing development, reviewing the implementation results, and authorizing releases.",
        "Development is assisted by AI coding tools working inside written governance: specifications, work packages and approval gates that I define and review. I did not personally implement every component. The repository’s agent operating model and commit history record this workflow.",
      ],
    },
    {
      heading: "Technology stack",
      body: [
        "A Next.js and TypeScript application deployed on Vercel, with Supabase providing authentication, storage and a PostgreSQL database. Distributed rate limiting uses a managed Redis service, and Vitest drives the automated tests.",
      ],
    },
    {
      heading: "Verified implemented capabilities",
      body: [
        "These were confirmed in the source code and tests. They describe what exists in the code, not what is live for customers.",
      ],
      items: [
        "Tenant registration and onboarding with store configuration, branding uploads and custom-domain verification.",
        "Staff sign-in, role-checked staff management and invitations, and a staff login audit that fails closed.",
        "Product catalog with variants and structured categories.",
        "Branch management and branch-level inventory, with stock reservations and low-stock evaluation.",
        "Storefront publication controls, a shopping cart, and guest checkout with stable public order references and guest order lookup.",
        "Order management for retailers, receipts, and QR-code pickup.",
        "Payment handling with a confirm-and-hold workflow, webhook processing, and operator tools for held payments and reconciliation.",
        "Merchant suspension and other platform-operator controls, with business-critical changes written to an audit log atomically.",
      ],
    },
  ],
  architecture: {
    caption:
      "Requests are resolved to one tenant, pass through routes and services that work on a typed tenant context, and reach the database only through repositories. The database adds its own tenant checks, so isolation does not rely on application code alone.",
    steps: [
      "Storefront or dashboard request",
      "Hostname resolved to a tenant",
      "Typed tenant context",
      "Services and repositories",
      "Row-level security and privileged functions in PostgreSQL",
    ],
    visual: "etenmall",
  },
  decisions: [
    {
      title: "Tenant isolation enforced by the database as well as the code",
      body: "Repository methods require a branded tenant-context type, so passing a raw tenant ID fails to compile. In PostgreSQL, row-level security and tested privilege boundaries back this up, and functions on tables that anonymous visitors can write use the database’s privileged-function mechanism and check staff membership internally.",
    },
    {
      title: "A checkout deadlock found by concurrency testing and fixed",
      body: "Concurrency verification reproduced a PostgreSQL deadlock when two checkouts reserved the same variants in opposite order. The fix sorts cart lines into a deterministic order before inventory locks are taken, so the conflicting order can no longer occur.",
    },
    {
      title: "Staged releases behind feature flags, with held payments",
      body: "Risky behavior was released in stages behind environment flags with written rollout, rollback and backup-restore procedures. A confirm-and-hold design lets an operator review a payment instead of automatically fulfilling every order.",
    },
  ],
  evidence: {
    heading: "Development and testing evidence",
    body: [
      "The project has about 300 test files and 83 database migrations. In a local run on 1 November 2026, the type check passed, lint reported no errors, and the unit and component suite passed with 267 test files and 4,412 tests. Dependency-direction rules between layers are enforced by lint.",
      "The additional tests that run against a real local PostgreSQL database, covering row-level security and privilege boundaries, were not run in that session. The project’s release records document earlier full runs and a staged deployment process, including encrypted backups, a restore drill and a monitored activation window.",
    ],
  },
  limits: [
    "EtenMall is in development. A production environment exists and was activated through staged, approval-gated releases, but the platform has not launched commercially and is not serving paying merchants.",
    "Payments are not live. The default storefront payment provider is a stub, and the Paynow integration has only been exercised in Paynow’s test mode. Live payments are not authorized.",
    "No reporting dashboards, SMS notifications or customer accounts exist yet.",
    "Screenshots are not shown here; this page uses a labelled architectural illustration instead.",
  ],
  roadmap: [
    "Basic sales and inventory reporting for retailers.",
    "Fuller delivery and fulfillment tracking beyond QR pickup.",
    "Seller-safety controls such as policy acceptance and customer reporting of listings or stores.",
    "A resilience path for payment-provider outages, and SMS order updates.",
    "Optional customer accounts, while keeping guest checkout first.",
  ],
};
