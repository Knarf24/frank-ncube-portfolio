import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectedWork } from "@/components/projects/selected-work";

const app = (name: string, pushed_at: string) => ({
  name,
  description: `The ${name} app.`,
  homepage: `https://knarf24.github.io/${name}/`,
  topics: [],
  html_url: `https://github.com/Knarf24/${name}`,
  pushed_at,
});

const hubData = {
  repos: [
    app("voice-helper", "2026-11-25T00:00:00Z"),
    app("security-watch", "2026-11-01T00:00:00Z"),
    app("trafficflow", "2026-10-15T00:00:00Z"),
    {
      name: "brain-games-arcade",
      description: "Four brain games in one page.",
      homepage: "https://knarf24.github.io/brain-games-arcade/",
      topics: ["featured"],
      html_url: "https://github.com/Knarf24/brain-games-arcade",
      pushed_at: "2026-11-26T00:00:00Z",
    },
    {
      name: "new-idea",
      description: "A brand new app.",
      homepage: "https://knarf24.github.io/new-idea/",
      topics: ["python"],
      html_url: "https://github.com/Knarf24/new-idea",
      pushed_at: "2026-11-20T00:00:00Z",
      created_at: "2026-12-02T00:00:00Z",
    },
  ],
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function renderWork() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(JSON.stringify(hubData), { status: 200 })),
  );
  render(await SelectedWork());
  return document.querySelector("section#work") as HTMLElement;
}

describe("SelectedWork", () => {
  it("shows six projects: three case studies, the chosen apps, then the rest of the hub", async () => {
    const section = await renderWork();

    const headings = within(section).getAllByRole("heading", { level: 3 });
    // TrafficFlow and Security Watch are chosen, in that order; Brand Monitor
    // is missing from this hub data, so the next hub app fills its place.
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "ShopAccess AI",
      "Triage360",
      "Horizon Desk",
      "TrafficFlow",
      "Security Watch",
      "Brain Games Arcade",
    ]);
    for (const name of ["Streetwise", "EtenMall", "New Idea"]) {
      expect(within(section).queryByRole("heading", { name })).not.toBeInTheDocument();
    }
  });

  it("links to every project on the Project Hub and to the case studies", async () => {
    const section = await renderWork();

    expect(
      within(section).getByRole("link", {
        name: "See all projects on the Project Hub (opens in a new tab)",
      }),
    ).toHaveAttribute("href", "https://knarf24.github.io/project-hub/");
    expect(
      within(section).getByRole("link", { name: "View all case studies" }),
    ).toHaveAttribute("href", "/projects");
  });

  it("links case studies and hub apps to their own pages, with chips", async () => {
    const section = await renderWork();

    expect(within(section).getByRole("link", { name: "Read the Triage360 case study" })).toHaveAttribute(
      "href",
      "/projects/triage360",
    );
    expect(
      within(section).getByRole("link", { name: "Brain Games Arcade: read more and try it" }),
    ).toHaveAttribute("href", "/apps/brain-games-arcade");

    const security = within(section)
      .getByRole("link", { name: "Security Watch: read more and try it" })
      .closest("article") as HTMLElement;
    expect(within(security).getByText("Python · Computer vision")).toBeInTheDocument();
    expect(within(security).getByText("Nov 2026")).toBeInTheDocument();
  });

  it("expands a card's summary in place", async () => {
    const user = userEvent.setup();
    const section = await renderWork();

    const toggle = within(section).getByRole("button", {
      name: "Show summary of Triage360",
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: "Hide summary of Triage360" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      within(section).getByText(/multi-domain support triage system/i),
    ).toBeVisible();
  });
});
