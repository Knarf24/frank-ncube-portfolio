import { describe, expect, it } from "vitest";
import { projects } from "@/data/projects";
import {
  filterProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectNumber,
} from "@/lib/project-utils";

describe("project utilities", () => {
  it("returns featured projects in the approved order", () => {
    expect(getFeaturedProjects().map((project) => project.slug)).toEqual([
      "triage360",
      "commerce-platform",
      "streetwise",
      "horizon-desk",
    ]);
  });

  it("finds a project by slug", () => {
    expect(getProjectBySlug("streetwise")?.title).toBe("Streetwise");
  });

  it("numbers projects by featured order, falling back to archive position", () => {
    const horizon = getProjectBySlug("horizon-desk");

    expect(horizon && getProjectNumber(horizon)).toBe(4);
  });

  it("returns undefined for an unknown project slug", () => {
    expect(getProjectBySlug("unknown-project")).toBeUndefined();
  });

  it("filters projects by category", () => {
    expect(
      filterProjects(projects, "AI / ML").map((project) => project.slug),
    ).toEqual(["triage360", "streetwise", "horizon-desk"]);
  });

  it("returns every project when the All category is selected", () => {
    expect(filterProjects(projects, "All")).toEqual(projects);
  });
});
