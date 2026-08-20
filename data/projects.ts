import type { Project } from "@/lib/portfolio-types";

export const projects: Project[] = [
  {
    title: "Triage360",
    slug: "triage360",
    summary:
      "A multi-domain support triage system combining classification, TF-IDF retrieval, risk evaluation, AI-generated responses, ticket history, and operational analytics.",
    year: 2026,
    categories: ["AI / ML", "Software engineering"],
    technologies: [
      "Python",
      "TypeScript",
      "React",
      "Express",
      "PostgreSQL",
      "TF-IDF",
    ],
    featured: true,
    featuredOrder: 1,
    status: "Completed",
    githubUrl: "https://github.com/Knarf24/support-triangle-agent",
    caseStudy: [
      {
        heading: "Problem",
        body: [
          "Support requests can arrive across unrelated domains and require different classification, retrieval, response, and escalation behavior.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "The project includes a Python support-triage workflow and a TypeScript application with a React interface, Express API, PostgreSQL persistence, ticket history, and statistics views.",
        ],
      },
      {
        heading: "Architecture",
        body: [
          "Incoming tickets move through classification, domain retrieval, risk evaluation, response generation, and persistence so the UI can expose both individual results and operational history.",
        ],
      },
    ],
  },
  {
    title: "Commerce platform",
    slug: "commerce-platform",
    summary:
      "Multi-tenant commerce infrastructure designed for small businesses and multi-branch retail operations.",
    year: 2026,
    categories: ["Software engineering", "Cloud", "Product"],
    technologies: ["Next.js", "PostgreSQL", "Supabase", "Vercel"],
    featured: true,
    featuredOrder: 2,
    status: "In development",
    caseStudy: [
      {
        heading: "Problem",
        body: [
          "Small retailers need online storefronts, branch-aware inventory, staff access, orders, payments, and operational controls without maintaining separate systems for each business.",
        ],
      },
      {
        heading: "What I am building",
        body: [
          "A single-codebase multi-tenant platform with tenant-scoped commerce features and a product architecture designed to grow with multiple businesses.",
        ],
      },
    ],
  },
  {
    title: "Streetwise",
    slug: "streetwise",
    summary:
      "An applied AI product focused on contextual recommendations and location-aware decision support.",
    year: 2026,
    categories: ["AI / ML", "Product", "Web"],
    technologies: ["React", "TypeScript", "Supabase"],
    featured: true,
    featuredOrder: 3,
    status: "Completed",
    githubUrl: "https://github.com/Knarf24/streetwise-offer-ai",
    caseStudy: [
      {
        heading: "Problem",
        body: [
          "Generic recommendations often ignore the user context that determines whether an option is actually useful.",
        ],
      },
      {
        heading: "What I built",
        body: [
          "A web product that combines user context with AI-assisted recommendation flows and persistent application data.",
        ],
      },
    ],
  },
];
