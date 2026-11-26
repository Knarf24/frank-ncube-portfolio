// Live apps shown on the portfolio come from Frank's Project Hub
// (https://knarf24.github.io/project-hub/). The hub's GitHub Action writes
// projects.json every 6 hours from the GitHub repos' About fields, so a new
// project appears here without editing this repository.

import { siteConfig } from "@/lib/site-config";

export const HUB_URL = siteConfig.projectHub;
// HUB_DATA_URL can point at a local copy for offline development.
const HUB_DATA_URL = process.env.HUB_DATA_URL ?? `${HUB_URL}projects.json`;
const GITHUB_FALLBACK_URL =
  "https://api.github.com/users/Knarf24/repos?per_page=100&sort=pushed";

// Re-fetch at most every 6 hours, matching the hub's own refresh.
export const HUB_REVALIDATE_SECONDS = 21600;

// Repos that are not hub apps: this site, the hub itself, the profile repo.
const EXCLUDED = new Set([
  "frank-ncube-portfolio",
  "project-hub",
  "knarf24",
]);

// Local screenshots for apps that have one; others get a styled title tile.
const SCREENSHOTS = new Set([
  "brain-games-arcade",
  "brand-monitor",
  "business-card-scanner",
  "driver-drowsiness-alert",
  "face-attendance",
  "gesture-kiosk",
  "security-watch",
  "voice-helper",
]);

// Topics that describe the platform rather than the app; not shown as tags.
const HIDDEN_TOPICS = new Set([
  "featured",
  "hide-from-showcase",
  "github-pages",
  "pyodide",
  "webassembly",
  "browser",
]);

export type HubRepo = {
  name: string;
  description: string | null;
  homepage: string | null;
  topics?: string[];
  fork?: boolean;
  archived?: boolean;
  language?: string | null;
  html_url: string;
  pushed_at?: string;
};

export type HubProject = {
  slug: string;
  title: string;
  description: string;
  demoUrl: string;
  codeUrl: string;
  tags: string[];
  featured: boolean;
  image: string | null;
};

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

// Turns raw repos into the live apps shown on the portfolio: only public,
// non-archived repos with a working demo link, featured first, newest next.
export function toHubProjects(repos: HubRepo[]): HubProject[] {
  return repos
    .filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        !EXCLUDED.has(repo.name.toLowerCase()) &&
        !(repo.topics ?? []).includes("hide-from-showcase") &&
        isHttpUrl(repo.homepage) &&
        Boolean(repo.description),
    )
    .sort((a, b) => {
      const fa = (a.topics ?? []).includes("featured") ? 0 : 1;
      const fb = (b.topics ?? []).includes("featured") ? 0 : 1;
      if (fa !== fb) return fa - fb;
      return (b.pushed_at ?? "").localeCompare(a.pushed_at ?? "");
    })
    .map((repo) => {
      const topics = repo.topics ?? [];
      // Topics, not the GitHub language: Python apps ship a vendored
      // JavaScript runtime, so GitHub often labels them JavaScript.
      const tags = topics
        .filter((topic) => !HIDDEN_TOPICS.has(topic))
        .slice(0, 3)
        .map((topic) => topic.replace(/-/g, " "));
      return {
        slug: repo.name,
        title: titleFromSlug(repo.name),
        description: repo.description ?? "",
        demoUrl: repo.homepage as string,
        codeUrl: repo.html_url,
        tags,
        featured: topics.includes("featured"),
        image: SCREENSHOTS.has(repo.name)
          ? `/images/hub/${repo.name}.webp`
          : null,
      };
    });
}

async function fetchRepos(url: string, pick: (data: unknown) => unknown) {
  const response = await fetch(url, {
    next: { revalidate: HUB_REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  const repos = pick(await response.json());
  if (!Array.isArray(repos)) throw new Error(`${url} returned no repo list`);
  return repos as HubRepo[];
}

// Never throws: if the hub and GitHub are both unreachable at build time the
// section falls back to just the link to the hub.
export async function getHubProjects(): Promise<HubProject[]> {
  try {
    return toHubProjects(
      await fetchRepos(HUB_DATA_URL, (data) => (data as { repos?: unknown }).repos),
    );
  } catch {
    try {
      return toHubProjects(await fetchRepos(GITHUB_FALLBACK_URL, (data) => data));
    } catch {
      return [];
    }
  }
}
