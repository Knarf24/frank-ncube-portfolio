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
import { noBreakTerms } from "@/components/case-study/no-break-terms";
import { EventSection } from "@/components/case-study/event-section";
import { ProductWalkthrough } from "@/components/case-study/product-walkthrough";
import { ScopeLimits } from "@/components/case-study/scope-limits";
import { ArchitectureFlow } from "@/components/case-study/architecture-flow";
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

describe("Stack list separators", () => {
  it("renders each technology as its own non-breaking list item without literal dots", () => {
    render(<ProjectGlance project={baseProject} />);

    const stack = screen.getByRole("list");
    const items = within(stack).getAllByRole("listitem");

    expect(items.map((item) => item.textContent)).toEqual(["A", "B", "C", "D", "E"]);
    for (const item of items) {
      expect(item.className).toContain("whitespace-nowrap");
    }
    expect(stack.textContent).not.toContain("·");
    expect(stack.className).toContain("overflow-hidden");
  });
});

describe("noBreakTerms", () => {
  it("wraps TF-IDF in a non-breaking span and leaves other text alone", () => {
    const { container } = render(
      <p>{noBreakTerms("uses TF-IDF + semantic retrieval")}</p>,
    );

    const span = container.querySelector("span.whitespace-nowrap");

    expect(span).toHaveTextContent("TF-IDF");
    expect(container).toHaveTextContent("uses TF-IDF + semantic retrieval");
  });

  it("returns plain text when no protected term is present", () => {
    const { container } = render(<p>{noBreakTerms("nothing special")}</p>);

    expect(container.querySelector("span")).toBeNull();
    expect(container).toHaveTextContent("nothing special");
  });
});

describe("ArchitectureFlow", () => {
  it("keeps the plain-language label and only renders vertical connectors for phones", () => {
    const { container } = render(<ArchitectureFlow labels={["One", "Two", "Three"]} />);

    expect(screen.getByRole("img")).toHaveAttribute("aria-label", "One to Two to Three");
    expect(container.querySelectorAll("[data-flow-step]")).toHaveLength(3);

    const connectors = Array.from(container.querySelectorAll('[aria-hidden="true"]')).filter(
      (el) => el.textContent === "↓" || el.textContent === "→",
    );

    expect(connectors).toHaveLength(2);
    for (const connector of connectors) {
      expect(connector.textContent).toBe("↓");
      expect(connector.className).toContain("sm:hidden");
    }
  });
});

describe("EventSection", () => {
  const event = {
    title: "Built at Some Event",
    subtitle: "Somewhere · 2026",
    banner: {
      src: "/images/projects/x/banner.webp",
      alt: "A banner photo.",
      width: 1600,
      height: 1200,
      objectPosition: "50% 10%",
    },
    team: {
      src: "/images/projects/x/team.webp",
      alt: "A team photo.",
      width: 1000,
      height: 1400,
      caption: "The team at the event.",
    },
  };

  it("renders nothing when there is no event data", () => {
    const { container } = render(<EventSection />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the banner heading as real text and both images with alt text and captions", () => {
    render(<EventSection event={event} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Built at Some Event" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Somewhere · 2026")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A banner photo." })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "A team photo." })).toBeInTheDocument();
    expect(screen.getByText("The team at the event.")).toBeInTheDocument();
    expect(screen.queryByText("Team")).not.toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);
  });

  it("does not make the images headings and does not mark either as priority", () => {
    const { container } = render(<EventSection event={event} />);

    expect(container.querySelector("h2 img, h3 img")).toBeNull();
    for (const img of Array.from(container.querySelectorAll("img"))) {
      expect(img.getAttribute("fetchpriority")).not.toBe("high");
      expect(img.getAttribute("loading")).not.toBe("eager");
    }
  });
});

describe("ProductWalkthrough", () => {
  const walkthrough = {
    heading: "Product walkthrough",
    intro: "Sample screens.",
    items: [
      {
        src: "/images/projects/x/one.webp",
        alt: "First screen.",
        width: 2880,
        height: 1800,
        caption: "First caption.",
      },
      {
        src: "/images/projects/x/two.webp",
        alt: "Second screen.",
        width: 2880,
        height: 1800,
        caption: "Second caption.",
      },
    ],
  };

  it("renders nothing without walkthrough data or without items", () => {
    const { container, rerender } = render(<ProductWalkthrough />);

    expect(container).toBeEmptyDOMElement();

    rerender(<ProductWalkthrough walkthrough={{ ...walkthrough, items: [] }} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("reuses ProductPreview for each screenshot with its alt text and caption", () => {
    render(<ProductWalkthrough walkthrough={walkthrough} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Product walkthrough" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Sample screens.")).toBeInTheDocument();
    expect(screen.getAllByRole("figure")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "First screen." })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Second screen." })).toBeInTheDocument();
    expect(screen.getByText("First caption.")).toBeInTheDocument();
    expect(screen.getByText("Second caption.")).toBeInTheDocument();
  });

  it("does not draw decorative window dots around walkthrough screenshots, but ProductPreview still can", () => {
    const { container, rerender } = render(
      <ProductWalkthrough walkthrough={walkthrough} />,
    );

    expect(container.querySelectorAll('[aria-hidden="true"] .rounded-full')).toHaveLength(0);

    rerender(<ProductPreview preview={walkthrough.items[0]} />);

    expect(container.querySelectorAll('[aria-hidden="true"] .rounded-full')).toHaveLength(3);

    rerender(<ProductPreview preview={walkthrough.items[0]} showChrome={false} />);

    expect(container.querySelectorAll('[aria-hidden="true"] .rounded-full')).toHaveLength(0);
  });

  it("serves the text-heavy screenshots as-is and lazy-loads them", () => {
    const { container } = render(<ProductWalkthrough walkthrough={walkthrough} />);

    for (const img of Array.from(container.querySelectorAll("img"))) {
      expect(img.getAttribute("src")).toMatch(/^\/images\/projects\/x\/.+\.webp$/);
      expect(img.getAttribute("loading")).not.toBe("eager");
      expect(img.getAttribute("fetchpriority")).not.toBe("high");
    }
  });
});
