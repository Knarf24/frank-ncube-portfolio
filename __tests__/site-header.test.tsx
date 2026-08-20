import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/site-header";

afterEach(cleanup);

describe("SiteHeader", () => {
  it("links the FN mark home and exposes the approved primary navigation", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "FN" })).toHaveAttribute(
      "href",
      "#top",
    );

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    });

    expect(within(navigation).getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "#work",
    );
    expect(within(navigation).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#about",
    );
    expect(
      within(navigation).getByRole("link", { name: "Experience" }),
    ).toHaveAttribute("href", "#experience");
    expect(
      within(navigation).getByRole("link", { name: "Contact" }),
    ).toHaveAttribute("href", "#contact");
  });

  it("updates the mobile menu state and closes after navigation", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const menuButton = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);

    const closeButton = screen.getByRole("button", {
      name: "Close navigation menu",
    });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");

    const mobileNavigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    await user.click(within(mobileNavigation).getByRole("link", { name: "Work" }));

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});
