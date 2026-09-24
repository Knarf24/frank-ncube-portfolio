import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CaseStudyFooter } from "@/components/case-study/case-study-footer";
import { ContributionSection } from "@/components/case-study/contribution-section";
import { EngineeringDecisions } from "@/components/case-study/engineering-decisions";
import { ProductPreview } from "@/components/case-study/product-preview";
import {
  getGlanceItems,
  ProjectGlance,
} from "@/components/case-study/project-glance";
import { ScopeLimits } from "@/components/case-study/scope-limits";
import type { Project } from "@/lib/portfolio-types";

afterEach(cleanup);

const baseProject: Project = {
  title: "Sample",
  slug: "sample",
  summary: "Sample summary",
  year: 2026,
  categories: ["Web"],
  technologies: ["A", "B", "C", "D", "E"],
  featured: false,
  status: "Completed",
  caseStudy: [],
};

describe("ProjectGlance", () => {
  it("derives year, status, and the full stack from project data", () => {
    expect(getGlanceItems(baseProject)).toEqual([
      { label: "Year", value: "2026" },
      { label: "Status", value: "Completed" },
      { label: "Stack", value: "A · B · C · D · E" },
    ]);
  });

  it("adds only supplied, non-empty extra facts and never invents Role or Team", () => {
    render(
      <ProjectGlance
        project={{
          ...baseProject,
          glance: [
            { label: "Role", value: "Frontend" },
            { label: "Team", value: "  " },
          ],
        }}
      />,
    );

    const list = screen.getByText("Role").closest("dl");

    expect(list).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.queryByText("Team")).not.toBeInTheDocument();
  });

  it("does not render Role, Team, or Event when none are supplied", () => {
    render(<ProjectGlance project={baseProject} />);

    for (const label of ["Role", "Team", "Event"]) {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    }
  });

  it("uses statusLabel and primaryStack overrides", () => {
    const items = getGlanceItems({
      ...baseProject,
      statusLabel: "Completed prototype",
      primaryStack: ["X", "Y"],
    });

    expect(items).toContainEqual({
      label: "Status",
      value: "Completed prototype",
    });
    expect(items).toContainEqual({ label: "Stack", value: "X · Y" });
  });
});

describe("ContributionSection", () => {
  it("renders nothing without contribution data", () => {
    const { container } = render(<ContributionSection />);

    expect(container).toBeEmptyDOMElement();
  });

  it("lists the team for team projects and never says Individual project", () => {
    render(
      <ContributionSection
        contribution={{
          mode: "team",
          summary: "My part.",
          team: ["A Person", "B Person"],
        }}
      />,
    );

    expect(screen.getByText("Team project")).toBeInTheDocument();
    expect(screen.queryByText("Individual project")).not.toBeInTheDocument();
    expect(
      within(screen.getByRole("list", { name: "Team members" })).getAllByRole(
        "listitem",
      ),
    ).toHaveLength(2);
  });

  it("only shows Individual project when explicitly configured", () => {
    render(
      <ContributionSection
        contribution={{ mode: "individual", summary: "All mine." }}
      />,
    );

    expect(screen.getByText("Individual project")).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Team members" })).toBeNull();
  });
});

describe("ProductPreview", () => {
  it("renders nothing when preview data is absent", () => {
    const { container } = render(<ProductPreview />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a figure with alt text and a caption", () => {
    render(
      <ProductPreview
        preview={{
          src: "/images/projects/x.png",
          alt: "A real screenshot",
          width: 1280,
          height: 720,
          caption: "Caption text",
        }}
      />,
    );

    const figure = screen.getByRole("figure");

    expect(within(figure).getByRole("img")).toHaveAttribute(
      "alt",
      "A real screenshot",
    );
    expect(within(figure).getByText("Caption text")).toBeInTheDocument();
  });
});

describe("EngineeringDecisions", () => {
  it("renders nothing without decisions", () => {
    const { container } = render(<EngineeringDecisions decisions={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders at most three decisions", () => {
    const decisions = ["One", "Two", "Three", "Four"].map((title) => ({
      title,
      body: `${title} body`,
    }));

    render(<EngineeringDecisions decisions={decisions} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.queryByText("Four")).not.toBeInTheDocument();
  });
});

describe("ScopeLimits", () => {
  it("renders nothing without limits and lists supplied ones", () => {
    const { container, rerender } = render(<ScopeLimits limits={[]} />);

    expect(container).toBeEmptyDOMElement();

    rerender(<ScopeLimits limits={["A limit"]} />);

    expect(
      screen.getByRole("heading", { name: "Scope and limits" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A limit")).toBeInTheDocument();
  });
});

describe("CaseStudyFooter", () => {
  it("links to neighbouring projects, the archive, and contact", () => {
    render(
      <CaseStudyFooter
        project={{ ...baseProject, slug: "commerce-platform", title: "Commerce platform" }}
      />,
    );

    expect(
      screen.getByRole("link", { name: /Previous project/ }),
    ).toHaveAttribute("href", "/projects/triage360");
    expect(screen.getByRole("link", { name: /Next project/ })).toHaveAttribute(
      "href",
      "/projects/streetwise",
    );
    expect(screen.getByRole("link", { name: "All projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByRole("link", { name: "Contact me" })).toHaveAttribute(
      "href",
      "/#contact",
    );
  });

  it("shows external links only when the project has them", () => {
    const { rerender } = render(<CaseStudyFooter project={baseProject} />);

    expect(screen.queryByRole("link", { name: /GitHub/ })).toBeNull();
    expect(screen.queryByRole("link", { name: /Devpost/ })).toBeNull();

    rerender(
      <CaseStudyFooter
        project={{
          ...baseProject,
          githubUrl: "https://github.com/x/y",
          devpostUrl: "https://devpost.com/software/z",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: /source on GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/x/y",
    );
    expect(
      screen.getByRole("link", { name: /submission on Devpost/ }),
    ).toHaveAttribute("href", "https://devpost.com/software/z");
  });
});
