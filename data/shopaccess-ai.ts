import type { Project } from "@/lib/portfolio-types";

const shots = "/images/projects/shopaccess-ai";

// Every statement below is taken from the public ShopAccess AI repository
// (README.md, docs/judges.md, extension/README.md). The individual
// contribution section is intentionally absent until the author confirms it.
export const shopAccessAi: Project = {
  title: "ShopAccess AI",
  slug: "shopaccess-ai",
  summary:
    "A bilingual (English and Spanish) AI-assisted laptop-shopping prototype built for the PayPal AI Hackathon. The AI advises, the server validates every recommendation, and checkout is refused until the shopper creates a limited purchase permission. The catalog and payments are simulated.",
  year: 2026,
  categories: ["AI / ML", "Web", "Product"],
  technologies: [
    "Next.js",
    "TypeScript",
    "React",
    "Zod",
    "Vitest",
    "Qwen (optional)",
    "PayPal Sandbox (optional)",
    "Chrome extension",
  ],
  featured: true,
  featuredOrder: 1,
  status: "Completed",
  statusLabel: "Completed hackathon prototype",
  githubUrl: "https://github.com/Knarf24/shopaccess-ai",
  gatedDemoUrl: "https://shopaccess-ai.onrender.com",
  video: {
    url: "https://youtu.be/p4ItKN35qSY",
    label: "Watch the demo video on YouTube",
    poster: {
      src: `${shots}/shopaccess-recs.webp`,
      alt: "ShopAccess AI recommendation screen used as the poster for the demo video link.",
      width: 1280,
      height: 1000,
      caption:
        "Poster image from a local mock-mode run. The video itself is hosted on YouTube.",
    },
  },
  cardImage: {
    src: `${shots}/shopaccess-recs.webp`,
    alt: "ShopAccess AI recommendations screen: one laptop marked Recommended at $579.99 and two marked not eligible for exceeding the $600 budget.",
    width: 1280,
    height: 1000,
    objectPosition: "50% 0%",
  },
  glance: [
    { label: "Event", value: "PayPal AI Hackathon (submitted)" },
    { label: "Languages", value: "English and Spanish" },
    { label: "Payments", value: "Simulated; optional PayPal Sandbox" },
  ],
  caseStudy: [
    {
      heading: "Problem and target users",
      body: [
        "ShopAccess AI is designed for first-time buyers choosing a laptop in English or Spanish. Specifications can be hard to compare, and AI shopping assistants can sound more certain than the evidence allows, especially about whether a laptop can run AI workloads such as training models locally.",
        "Letting software act on a shopper’s behalf raises a second question: what is it allowed to do? The prototype explores an assistant that explains its evidence, says what it cannot verify, and never spends anything the shopper has not explicitly allowed.",
      ],
    },
    {
      heading: "The product experience",
      body: [
        "The shopper types, or dictates through the browser’s speech services, what they need and their budget. The assistant asks follow-up questions and shows its understanding, and nothing counts as the request until the shopper confirms the summary.",
        "Recommendations come from a fixed demo catalog of three laptops. The server checks price, stock, memory, storage and weight, and each card explains why a laptop is or is not eligible. The shopper then reviews a server-priced quote, confirms it, and reaches a payment step that is simulated by default.",
      ],
    },
    {
      heading: "AI evidence and uncertainty",
      body: [
        "When a request involves AI work, the assistant asks whether the models will run on the laptop or in the cloud. Each card then shows “AI compatibility: not verified” and says what evidence is missing, for example VRAM, unless the catalog contains that evidence. A laptop that has not been verified for the workload is never marked Recommended.",
        "By default the assistant is a labelled local demo assistant. A live Qwen model through Synthorai can be configured on the server, with a 15-second deadline, a 1,024-token output cap and per-session, hourly and daily limits. Its output is advisory: the server enforces catalog identity, suitability and budget, and drops any suggestion that is not eligible. If the provider fails or a limit is reached, the local assistant answers and is labelled as such.",
      ],
    },
    {
      heading: "Purchase authorization and payments",
      body: [
        "Checkout is refused, and nothing is charged, until the shopper creates a purchase permission for that exact item. A permission sets a maximum quantity, a maximum total and an expiry, and can be revoked. The total is calculated by the server and confirmed explicitly before any payment step.",
        "By default the payment step is a local simulation of order, approval and capture, and PayPal is not contacted. An optional PayPal Sandbox mode exists for owner-authorized runs: it uses sandbox accounts only, reports success only after checking the capture against the order, amount, currency and payee, and the code rejects live or production configuration. Production payments are not implemented.",
      ],
    },
    {
      heading: "Languages and the Chrome side panel",
      body: [
        "The shopping journey is available in English and Spanish, with an explicit language switch that keeps the shopper’s needs and budget. Product names stay in English and are marked as English for screen readers.",
        "A developer Chrome extension (an unpacked Manifest V3 side panel) can read and continue the same conversation after the shopper approves a pairing code on the website. It cannot confirm a purchase, check out or pay.",
      ],
    },
    {
      heading: "Testing and validation evidence",
      body: [
        "The repository’s automated tests cover sessions, catalog validation, readiness rules, quotes and confirmation, the payment state machine, purchase permissions, the PayPal Sandbox adapter, the extension API and localized routes. In a local run on 1 November 2026, the type check passed and the test suite passed with 129 test files and 2,568 tests. These are unit and handler-level tests, not a browser or accessibility audit.",
        "The project’s own records also say what that evidence does not show. One supervised PayPal Sandbox rehearsal on 18 October 2026 ended in a verified USD 579.99 capture, and the project does not treat that as acceptance. Screen-reader, native-speaker, real-microphone and multi-browser acceptance testing is incomplete.",
      ],
    },
  ],
  walkthrough: {
    heading: "Product walkthrough",
    intro:
      "Screenshots from a local run in mock mode with synthetic shopping data. No live AI provider, PayPal Sandbox or real payment was used.",
    items: [
      {
        src: `${shots}/shopaccess-confirm.webp`,
        alt: "ShopAccess AI confirmation step, asking the shopper to check the use and budget before seeing recommendations.",
        width: 1280,
        height: 780,
        caption:
          "The shopper’s message is interpreted, then shown back for confirmation. Nothing counts as the request until it is confirmed.",
      },
      {
        src: `${shots}/shopaccess-recs.webp`,
        alt: "ShopAccess AI recommendations: one laptop marked Recommended at $579.99 with its price against the budget shown on the card.",
        width: 1280,
        height: 1000,
        caption:
          "Recommendations come from a fixed demo catalog and are checked by the server. The page states that this suggestion comes from the local demo assistant, not a live model.",
      },
      {
        src: `${shots}/shopaccess-refused.webp`,
        alt: "ShopAccess AI refusing to start checkout because no purchase permission exists, with a message that nothing was charged.",
        width: 1280,
        height: 780,
        caption:
          "Without a purchase permission for that exact item, checkout is refused and nothing is charged.",
      },
      {
        src: `${shots}/shopaccess-permission.webp`,
        alt: "ShopAccess AI purchase permission review showing the item, quantity limit, total limit, currency and end time.",
        width: 1280,
        height: 900,
        caption:
          "A purchase permission is limited to one item, a maximum quantity, a maximum total and an end time, and is reviewed before it is saved.",
      },
      {
        src: `${shots}/shopaccess-checkout.webp`,
        alt: "ShopAccess AI checkout review showing the seller, item, quantity and a server-calculated total of $579.99.",
        width: 1280,
        height: 1000,
        caption:
          "The total is calculated by the server. Confirming records agreement to that exact summary and does not take payment.",
      },
      {
        src: `${shots}/shopaccess-payment.webp`,
        alt: "ShopAccess AI local payment preview stating that no money is charged and PayPal is not contacted.",
        width: 1280,
        height: 1000,
        caption:
          "The default payment step is a labelled local preview. PayPal is not contacted and no money moves.",
      },
    ],
  },
  architecture: {
    caption:
      "The AI sits at the start of the flow as an advisor. Every step after the shopper’s confirmation is decided by server-side rules. The Chrome side panel can read and continue the conversation but cannot confirm or pay.",
    steps: [
      "Shopper message (typed or dictated)",
      "Local assistant or optional Qwen interpretation",
      "Shopper confirms the summary",
      "Server-validated catalog recommendations",
      "Purchase permission check",
      "Server-priced quote and confirmation",
      "Simulated payment, or optional PayPal Sandbox",
    ],
  },
  decisions: [
    {
      title: "The AI advises and the server decides",
      body: "Model output only interprets the shopper’s use and budget and proposes products. Catalog identity, suitability, budget and every purchase rule are enforced on the server, and an ineligible suggestion is dropped instead of shown.",
    },
    {
      title: "Uncertainty is disclosed instead of guessed",
      body: "For AI workloads the cards say “AI compatibility: not verified” unless the catalog has evidence, and an unverified laptop is never marked Recommended, so a confident-sounding answer cannot hide missing evidence.",
    },
    {
      title: "Permission before payment, with explicit limits",
      body: "Checkout requires a purchase permission for the exact item, limited by quantity, total and expiry, which the shopper can revoke. The extension’s access grant has no confirm, checkout or pay scope.",
    },
  ],
  limits: [
    "ShopAccess AI is a hackathon prototype. The catalog, sellers, prices and stock are simulated demo data, nothing is shipped, and no real money moves. Production payments are not implemented.",
    "The hosted demonstration is passphrase-protected and is not open to the public. State is held in memory and a restart clears it.",
    "The live Qwen assistant, PayPal Sandbox mode and Channel3 external listings are optional configurations, not part of the default run. Product images are illustrations, and the simulated payment panel is in English even on Spanish pages.",
    "Voice input and read-aloud use the browser’s speech services, which may send audio to them. Screen-reader, native-speaker, real-microphone and multi-browser acceptance testing is incomplete, and the Chrome side panel is an unpacked developer extension.",
  ],
};
