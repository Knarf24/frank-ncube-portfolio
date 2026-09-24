import type { Project } from "@/lib/portfolio-types";

export const projects: Project[] = [
  {
    title: "Triage360",
    slug: "triage360",
    summary:
      "A multi-domain support triage system combining classification, document retrieval, risk evaluation, AI-generated responses, ticket history, and operational analytics, with a Python prototype exploring TF-IDF + semantic retrieval.",
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
          "The project includes a full-stack TypeScript application with a React interface, Express API, PostgreSQL persistence, keyword-overlap document retrieval, ticket history, and statistics views, plus an earlier Python CLI prototype using TF-IDF + semantic retrieval.",
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
      "An applied AI product that ranks nearby merchants from selectable situational context and generates structured, time-limited offers.",
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
          "A web product that combines selectable scenario context with merchant ranking, AI-generated offers, Supabase persistence, and redemption flows.",
        ],
      },
    ],
  },
  {
    title: "Horizon Desk",
    slug: "horizon-desk",
    summary:
      "Built with a three-person team at SteelHacks XIII, Horizon Desk uses synthetic banking data and AI-assisted outreach to identify customer opportunities, with deterministic eligibility checks and human review for credit decisions.",
    year: 2026,
    categories: ["AI / ML", "Web", "Product"],
    technologies: [
      "Next.js",
      "TypeScript",
      "Claude 3.5 Sonnet",
      "ElevenLabs",
      "Python",
      "Vitest",
    ],
    featured: true,
    featuredOrder: 4,
    status: "Completed",
    // Live demo temporarily removed: https://horizon-desk.netlify.app/?view=data
    // returned a Netlify 503 usage_exceeded error. To restore, re-add:
    //   liveUrl: "https://horizon-desk.netlify.app/?view=data",
    //   liveKind: "demo",
    devpostUrl: "https://devpost.com/software/nexa-j9g8ys",
    caseStudy: [
      {
        heading: "Problem",
        body: [
          "Retail banks can hold large balances in low- or zero-interest checking accounts, and branch bankers have limited ways to spot which customers may have surplus liquidity and reach them in a compliant, personal way.",
        ],
      },
      {
        heading: "The team prototype",
        body: [
          "Our team built Horizon Desk for SteelHacks XIII. The prototype analyzes synthetic retail-banking customer data, identifies potential surplus liquidity using deterministic financial eligibility checks, and drafts personalized AI-assisted outreach. It also simulates customer responses and outreach cooldowns, and routes credit opportunities to human bankers rather than automatically approving loans.",
          "All customer records and financial projections in the prototype are synthetic or simulated. Integration with core banking systems was a planned next step and was not implemented.",
        ],
      },
      {
        heading: "My contribution",
        body: [
          "I helped originate the project concept, worked primarily on the frontend, and contributed to some of the backend development.",
          "Horizon Desk was built by a team of three: Gamuchirai Mubayiwa, Sumon Mondal, and me. The prototype’s functionality reflects shared team work rather than any one contributor.",
        ],
      },
    ],
  },
];
