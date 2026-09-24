import { existsSync } from "node:fs";
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
