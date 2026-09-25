import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import {
  getAdjacentProjects,
  getOrderedProjects,
  getProjectBySlug,
} from "@/lib/project-utils";

describe("project ordering helpers", () => {
  it("orders projects by featured order and is deterministic", () => {
    const slugs = getOrderedProjects().map((project) => project.slug);

    expect(slugs).toEqual([
      "triage360",
      "commerce-platform",
      "streetwise",
      "horizon-desk",
    ]);
    expect(getOrderedProjects().map((project) => project.slug)).toEqual(slugs);
  });

  it("returns previous and next neighbours", () => {
    expect(getAdjacentProjects("streetwise")).toMatchObject({
      previous: { slug: "commerce-platform" },
      next: { slug: "horizon-desk" },
    });
  });

  it("wraps around at both ends so every case study has both links", () => {
    expect(getAdjacentProjects("triage360")).toMatchObject({
      previous: { slug: "horizon-desk" },
      next: { slug: "commerce-platform" },
    });
    expect(getAdjacentProjects("horizon-desk")).toMatchObject({
      previous: { slug: "streetwise" },
      next: { slug: "triage360" },
    });
  });

  it("returns null for an unknown slug", () => {
    expect(getAdjacentProjects("nope")).toBeNull();
  });
});

describe("case-study data accuracy guards", () => {
  it("never labels a project as individual work until that is confirmed", () => {
    for (const project of projects) {
      expect(project.contribution?.mode).not.toBe("individual");
    }
  });

  it("keeps engineering decisions to three or fewer per project", () => {
    for (const project of projects) {
      expect((project.decisions ?? []).length).toBeLessThanOrEqual(3);
    }
  });

  it("identifies Horizon Desk as a three-person team project without repo or demo links", () => {
    const horizon = getProjectBySlug("horizon-desk");

    expect(horizon?.contribution?.mode).toBe("team");
    expect(horizon?.contribution?.team).toEqual([
      "Frank Ncube",
      "Gamuchirai Mubayiwa",
      "Sumon Mondal",
    ]);
    expect(horizon?.githubUrl).toBeUndefined();
    expect(horizon?.liveUrl).toBeUndefined();
    expect(horizon?.devpostUrl).toBe("https://devpost.com/software/nexa-j9g8ys");
  });

  it("keeps the private commerce project free of repository links and previews", () => {
    const commerce = getProjectBySlug("commerce-platform");

    expect(commerce?.status).toBe("In development");
    expect(commerce?.githubUrl).toBeUndefined();
    expect(commerce?.liveUrl).toBeUndefined();
    expect(commerce?.preview).toBeUndefined();
    expect(commerce?.architecture).toBeUndefined();
  });

  it("describes Triage360 web-app retrieval as keyword-overlap, not TF-IDF", () => {
    const triage = getProjectBySlug("triage360");

    expect(triage?.architecture?.caption).toMatch(/keyword-overlap/);
    expect(triage?.architecture?.caption).not.toMatch(/TF-IDF/);
    expect(triage?.architecture?.steps.join(" ")).not.toMatch(/TF-IDF/);
  });

  it("does not include the modeled $142M figure anywhere in Horizon Desk", () => {
    expect(JSON.stringify(getProjectBySlug("horizon-desk"))).not.toMatch(
      /142/,
    );
  });

  it("only attaches previews that point at real files under public/images/projects", () => {
    for (const project of projects) {
      if (project.preview) {
        expect(project.preview.src).toMatch(/^\/images\/projects\//);
        expect(project.preview.alt.length).toBeGreaterThan(20);
        expect(existsSync(join(process.cwd(), "public", project.preview.src))).toBe(true);
      }
    }
  });
});

describe("Horizon Desk event visuals", () => {
  const horizon = getProjectBySlug("horizon-desk");

  it("uses the approved banner copy, team caption, and alt text", () => {
    expect(horizon?.event?.title).toBe("Built at SteelHacks XIII");
    expect(horizon?.event?.subtitle).toBe("University of Pittsburgh · 2026");
    expect(horizon?.event?.banner.alt).toBe(
      "SteelHacks XIII participants gathered in the auditorium before the closing ceremony.",
    );
    expect(horizon?.event?.team.caption).toBe(
      "The Horizon Desk team at SteelHacks XIII.",
    );
    expect(horizon?.event?.team).not.toHaveProperty("copy");
  });

  it("points at optimized WebP files that exist and stay small", () => {
    for (const image of [horizon!.event!.banner, horizon!.event!.team]) {
      const file = join(process.cwd(), "public", image.src);

      expect(image.src).toMatch(/^\/images\/projects\/horizon-desk\/.+\.webp$/);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(400 * 1024);
      expect(image.alt.length).toBeGreaterThan(20);
    }
  });

  it("ships no original PNG screenshots in the repo image folder", () => {
    const dir = join(process.cwd(), "public/images/projects/horizon-desk");

    expect(readdirSync(dir).filter((name) => /\.(png|jpe?g)$/i.test(name))).toEqual([]);
  });

  it("does not name or order the people in the alt text or caption, and invents no outcomes", () => {
    const text = JSON.stringify(horizon?.event);

    expect(text).not.toMatch(/Frank|Gamuchirai|Sumon/);
    expect(text).not.toMatch(/left|right|award|prize|winner|placed|finalist/i);
  });

  it("only Horizon Desk has event visuals", () => {
    for (const project of projects) {
      expect(Boolean(project.event)).toBe(project.slug === "horizon-desk");
    }
  });
});

describe("Triage360 product walkthrough", () => {
  const triage = getProjectBySlug("triage360");
  const items = triage?.walkthrough?.items ?? [];

  it("has exactly two screenshots with the approved captions and alt text", () => {
    expect(triage?.walkthrough?.heading).toBe("Product walkthrough");
    expect(items).toHaveLength(2);
    expect(items[0].caption).toBe(
      "High-risk tickets are flagged for human review instead of receiving an automated reply.",
    );
    expect(items[0].alt).toBe(
      "Triage360 escalation result for a synthetic Visa fraud support ticket.",
    );
    expect(items[1].caption).toBe(
      "The audit log records each triaged ticket with its domain, classification confidence, escalation status and retrieved-source count, with search, filters and CSV export.",
    );
    expect(items[1].alt).toBe(
      "Triage360 audit log showing five synthetic support tickets with domains, confidence and escalation status.",
    );
  });

  it("points at lossless WebP files that exist at native size and stay small", () => {
    for (const item of items) {
      const file = join(process.cwd(), "public", item.src);

      expect(item.src).toMatch(/^\/images\/projects\/triage360\/.+\.webp$/);
      expect(existsSync(file)).toBe(true);
      expect(statSync(file).size).toBeLessThan(200 * 1024);
    }

    // Escalation screen: full 16:10 frame. History: same frame with only the empty lower canvas trimmed.
    expect(items[0].width).toBe(2880);
    expect(items[0].height).toBe(1800);
    expect(items[1].width).toBe(2880);
    expect(items[1].height).toBe(1200);
  });

  it("ships no original PNG screenshots in the Triage360 image folder", () => {
    const dir = join(process.cwd(), "public/images/projects/triage360");

    expect(readdirSync(dir).filter((name) => /\.(png|jpe?g)$/i.test(name))).toEqual([]);
  });

  it("does not claim AI detected the fraud, use production wording, or mention TF-IDF next to the screenshots", () => {
    const text = JSON.stringify(triage?.walkthrough);

    expect(text).not.toMatch(/AI (detected|identified|decided)/i);
    expect(text).not.toMatch(/AI confidence/i);
    expect(text).not.toMatch(/production|customer interactions|real customers/i);
    expect(text).not.toMatch(/TF-IDF/i);
    expect(text).toMatch(/sample support tickets/);
  });

  it("keeps the web-app versus Python-prototype retrieval distinction intact", () => {
    expect(triage?.architecture?.caption).toMatch(/keyword-overlap/);
    expect(triage?.architecture?.caption).not.toMatch(/TF-IDF/);
    expect(
      triage?.decisions?.some((decision) =>
        /Python CLI explored TF-IDF/.test(decision.body) &&
        /web application uses simpler keyword-overlap/.test(decision.body),
      ),
    ).toBe(true);
  });

  it("only Triage360 has a walkthrough, and no project uses the single header preview", () => {
    for (const project of projects) {
      expect(Boolean(project.walkthrough)).toBe(project.slug === "triage360");
      expect(project.preview).toBeUndefined();
    }
  });
});
