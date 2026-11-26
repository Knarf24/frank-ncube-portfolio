import { describe, expect, it } from "vitest";
import { toHubProjects, type HubRepo } from "@/lib/hub-projects";

const repo = (overrides: Partial<HubRepo>): HubRepo => ({
  name: "demo-app",
  description: "A demo app.",
  homepage: "https://knarf24.github.io/demo-app/",
  topics: [],
  html_url: "https://github.com/Knarf24/demo-app",
  pushed_at: "2026-11-01T00:00:00Z",
  ...overrides,
});

describe("toHubProjects", () => {
  it("keeps only public apps with a live demo link", () => {
    const result = toHubProjects([
      repo({ name: "live-app" }),
      repo({ name: "no-demo", homepage: "" }),
      repo({ name: "bad-demo", homepage: "javascript:alert(1)" }),
      repo({ name: "forked", fork: true }),
      repo({ name: "old", archived: true }),
      repo({ name: "hidden", topics: ["hide-from-showcase"] }),
      repo({ name: "frank-ncube-portfolio" }),
      repo({ name: "project-hub" }),
      repo({ name: "Knarf24" }),
      repo({ name: "no-description", description: null }),
    ]);
    expect(result.map((p) => p.slug)).toEqual(["live-app"]);
  });

  it("puts featured apps first, then the most recently updated", () => {
    const result = toHubProjects([
      repo({ name: "older", pushed_at: "2026-10-01T00:00:00Z" }),
      repo({ name: "newer", pushed_at: "2026-11-20T00:00:00Z" }),
      repo({ name: "starred", topics: ["featured"], pushed_at: "2026-01-01T00:00:00Z" }),
    ]);
    expect(result.map((p) => p.slug)).toEqual(["starred", "newer", "older"]);
  });

  it("builds a readable title, tags and image", () => {
    const [project] = toHubProjects([
      repo({
        name: "brain-games-arcade",
        topics: ["featured", "pyodide", "puzzle-game", "python"],
      }),
    ]);
    expect(project.title).toBe("Brain Games Arcade");
    expect(project.tags).toEqual(["puzzle game", "python"]);
    expect(project.featured).toBe(true);
    expect(project.image).toBe("/images/hub/brain-games-arcade.webp");
    expect(toHubProjects([repo({ name: "new-thing" })])[0].image).toBeNull();
  });

  it("uses the write-up's title when the repo name can't spell it", () => {
    const [project] = toHubProjects([repo({ name: "trafficflow" })]);
    expect(project.title).toBe("TrafficFlow");
    expect(project.image).toBe("/images/hub/trafficflow.webp");
    expect(project.writeup?.note).toMatch(/synthetic/);
  });
});
