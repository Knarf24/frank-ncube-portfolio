import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SelectedWork } from "@/components/projects/selected-work";

const hubData = {
  repos: [
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
  it("lists the case studies first, in the approved order, then the hub apps", async () => {
    const section = await renderWork();

    const headings = within(section).getAllByRole("heading", { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "ShopAccess AI",
      "Triage360",
      "Horizon Desk",
      "EtenMall",
      "Brain Games Arcade",
      "New Idea",
    ]);
    expect(
      within(section).queryByRole("heading", { name: "Streetwise" }),
    ).not.toBeInTheDocument();
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

    const newIdea = within(section)
      .getByRole("link", { name: "New Idea: read more and try it" })
      .closest("article") as HTMLElement;
    expect(within(newIdea).getByText("Python")).toBeInTheDocument();
    expect(within(newIdea).getByText("Dec 2026")).toBeInTheDocument();
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
