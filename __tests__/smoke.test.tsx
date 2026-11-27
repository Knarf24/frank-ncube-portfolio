import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
// The homepage itself is an async server component (it loads the Project Hub
// list), so the hero is rendered directly here.
import { Hero } from "@/components/hero/hero";
import { siteConfig } from "@/lib/site-config";

afterEach(cleanup);

describe("Home", () => {
  it("renders Frank Ncube as the primary heading", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Frank Ncube/i }),
    ).toBeInTheDocument();
  });

  it("renders the hero portrait with meaningful alt text", () => {
    render(<Hero />);

    expect(
      screen.getByRole("img", { name: "Portrait of Frank Ncube" }),
    ).toBeInTheDocument();
  });

  it("links to LinkedIn next to GitHub in the hero", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      siteConfig.linkedin,
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
  });
});
