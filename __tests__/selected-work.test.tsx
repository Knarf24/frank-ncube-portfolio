import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SelectedWork } from "@/components/projects/selected-work";

describe("SelectedWork", () => {
  it("renders the approved featured-project hierarchy", () => {
    render(<SelectedWork />);

    const section = document.querySelector("section#work");

    expect(section).toBeInTheDocument();

    const projectHeadings = within(section as HTMLElement).getAllByRole(
      "heading",
      { level: 3 },
    );

    expect(projectHeadings).toHaveLength(3);
    expect(projectHeadings[0]).toHaveTextContent("Triage360");
    expect(
      within(section as HTMLElement).getByRole("heading", {
        name: "Commerce platform",
      }),
    ).toBeInTheDocument();
    expect(
      within(section as HTMLElement).getByRole("heading", {
        name: "Streetwise",
      }),
    ).toBeInTheDocument();

    const flagship = within(section as HTMLElement)
      .getByRole("heading", { name: "Triage360" })
      .closest("article");

    expect(flagship).toHaveAttribute("data-project-variant", "flagship");
  });
});
