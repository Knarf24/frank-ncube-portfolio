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
        heading: "The system",
        body: [
          "The project includes a full-stack TypeScript application with a React interface, Express API, PostgreSQL persistence, keyword-overlap document retrieval, ticket history, and statistics views, plus an earlier Python CLI prototype using TF-IDF + semantic retrieval.",
        ],
      },
    ],
    architecture: {
      caption:
        "Each ticket is classified, checked for escalation risk, and matched to documentation before a response is generated or the ticket is routed to a human. In the web application, retrieval is keyword-overlap scoring over per-domain documentation. Results are persisted so the UI can show ticket history and stats.",
      steps: [
        "Incoming ticket",
        "Domain classification",
        "Risk evaluation",
        "Documentation retrieval",
        "AI-assisted response or human escalation",
        "Persistence and history",
      ],
    },
    decisions: [
      {
        title: "Rule-based escalation before AI generation",
        body: "Tickets are checked against six risk categories (fraud, billing disputes, account access, platform bugs, legal or compliance, and safety-critical language) before any reply is generated, so risky cases go to a human instead of receiving an automated answer.",
      },
      {
        title: "Responses grounded in retrieved documentation",
        body: "Replies are generated from support documents retrieved for the classified domain, and the retrieved sources are stored with each ticket so an answer can be traced back to its documentation.",
      },
      {
        title: "Keeping the retrieval prototype separate from the web app",
        body: "The earlier Python CLI explored TF-IDF with semantic retrieval. The TypeScript web application uses simpler keyword-overlap retrieval over the same corpus, and the two are described separately rather than as one system.",
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
    glance: [{ label: "Role", value: "Product & Software Development" }],
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
    limits: [
      "This is a private project that is still in development, so it is described at a high level. The capabilities above are goals for the platform, not a shipped product.",
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
        heading: "The system",
        body: [
          "A web product that combines selectable scenario context with merchant ranking, AI-generated offers, Supabase persistence, and redemption flows.",
        ],
      },
    ],
    architecture: {
      caption:
        "Merchants are ranked in the client from the selected scenario. The top match and the context go to a Supabase Edge Function that generates one structured offer, which the user can accept and redeem.",
      steps: [
        "Scenario context",
        "Merchant ranking",
        "AI offer generation",
        "Redemption",
      ],
    },
    decisions: [
      {
        title: "Structured AI output instead of free text",
        body: "Offers are generated through structured function-calling, so every offer has the same fields (headline, description, discount, validity window, call to action, and reason) that the interface can render and store.",
      },
      {
        title: "Server-side discount limit",
        body: "The discount is clamped on the server to the merchant's configured maximum, whatever the model returns, so a generated offer cannot exceed the limit a merchant set.",
      },
      {
        title: "Row-Level Security in the database",
        body: "Supabase Row-Level Security policies scope merchant data to its owner and offers to their user, so access rules are enforced in the database rather than only in the client.",
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
    statusLabel: "Completed prototype",
    glance: [
      { label: "Role", value: "Frontend + supporting backend" },
      { label: "Team", value: "3 developers" },
      { label: "Event", value: "SteelHacks XIII" },
    ],
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
        ],
      },
    ],
    contribution: {
      mode: "team",
      summary:
        "I helped originate the project concept, worked primarily on the frontend, and contributed to some of the backend development.",
      team: ["Frank Ncube", "Gamuchirai Mubayiwa", "Sumon Mondal"],
      teamNote:
        "Horizon Desk was built by a team of three. The prototype’s functionality reflects shared team work rather than any one contributor.",
    },
    architecture: {
      caption:
        "A simplified view of the prototype’s main workflow. Customer records, responses, and outcomes are synthetic or simulated.",
      steps: [
        "Synthetic customer data",
        "Deterministic eligibility checks",
        "AI-assisted outreach",
        "Simulated responses and cooldowns",
        "Human banker review for credit opportunities",
      ],
    },
    decisions: [
      {
        title: "Deterministic eligibility before AI-assisted outreach",
        body: "Potential surplus liquidity is identified with deterministic financial eligibility checks rather than a language model, so who is contacted follows explicit criteria. AI-assisted drafting comes afterwards.",
      },
      {
        title: "Human review for credit opportunities",
        body: "Credit opportunities are routed to human bankers instead of being approved automatically, which keeps lending decisions with people.",
      },
      {
        title: "Synthetic data and modeled outcomes stay labeled",
        body: "The prototype runs on synthetic customer data and simulated responses, and it is presented as modeled behavior, not as real customer activity or results.",
      },
    ],
    limits: [
      "All customer records and financial projections in the prototype are synthetic or simulated.",
      "Integration with core banking systems was a planned next step and was not implemented.",
    ],
  },
];
