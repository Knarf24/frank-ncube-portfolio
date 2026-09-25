import { cleanup, render, screen, within } from "@testing-library/react";
import type { ResolvingMetadata } from "next";
import { afterEach, describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/projects/[slug]/page";
import { generateMetadata as projectsMetadata } from "@/app/projects/page";
import { generateMetadata as resumeMetadata } from "@/app/resume/page";
import { ProjectCard } from "@/components/projects/project-card";
import { AboutExperience } from "@/components/sections/about-experience";
import { SiteFooter } from "@/components/sections/site-footer";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/page-metadata";
import { getProjectBySlug } from "@/lib/project-utils";

afterEach(cleanup);

const inheritedImages = [{ url: "https://example.test/opengraph-image?abc" }];
const parent = Promise.resolve({
  openGraph: { images: inheritedImages },
}) as unknown as ResolvingMetadata;

describe("experience entries", () => {
  it("carry the résumé dates and the résumé's team-size wording", () => {
    const hotspot = experience.find((item) => item.title.includes("Wi-Fi"));
    const tutor = experience.find((item) => item.title.includes("tutor"));

    expect(hotspot?.period).toBe("2024 — Present");
    expect(tutor?.period).toBe("2026 — Present");
    expect(hotspot?.summary).toContain(
      "approximately 30 people across sales, marketing, installation, and maintenance",
    );
    expect(hotspot?.summary).not.toMatch(/employees/i);
  });

  it("renders the dates on the homepage", () => {
    render(<AboutExperience />);

    expect(screen.getByText("2024 — Present")).toBeInTheDocument();
    expect(screen.getAllByText("2026 — Present").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Triage360 technology list", () => {
  const triage = getProjectBySlug("triage360")!;

  it("includes Claude API without changing the retrieval description", () => {
    expect(triage.technologies).toContain("Claude API");
    expect(triage.technologies).toContain("TF-IDF");
    expect(triage.summary).toContain("TF-IDF + semantic retrieval");
    expect(triage.architecture?.caption).toContain(
      "retrieval is keyword-overlap scoring",
    );
  });

  it("renders the Claude API chip on its project card", () => {
    render(<ProjectCard project={triage} variant="standard" />);

    expect(screen.getByText("Claude API")).toBeInTheDocument();
  });
});

describe("per-page metadata", () => {
  it("builds a canonical and Open Graph URL from the page path and keeps the inherited image", async () => {
    const meta = await pageMetadata(
      { title: "T", description: "D", path: "/somewhere" },
      parent,
    );

    expect(meta.alternates?.canonical).toBe("/somewhere");
    expect(meta.openGraph?.url).toBe("/somewhere");
    expect(meta.openGraph?.title).toBe("T");
    expect(meta.openGraph?.description).toBe("D");
    expect(meta.openGraph?.images).toEqual(inheritedImages);
  });

  it.each(projects.map((project) => project.slug))(
    "case study %s canonicalises to its own route",
    async (slug) => {
      const meta = await generateMetadata(
        { params: Promise.resolve({ slug }) } as Parameters<
          typeof generateMetadata
        >[0],
        parent,
      );
      const project = getProjectBySlug(slug)!;

      expect(meta.title).toBe(`${project.title} | Frank Ncube`);
      expect(meta.description).toBe(project.summary);
      expect(meta.alternates?.canonical).toBe(`/projects/${slug}`);
      expect(meta.openGraph?.url).toBe(`/projects/${slug}`);
      expect(meta.openGraph?.title).toBe(`${project.title} | Frank Ncube`);
    },
  );

  it("gives the projects and resume pages their own titles and canonicals", async () => {
    const projectsMeta = await projectsMetadata({}, parent);
    const resumeMeta = await resumeMetadata({}, parent);

    expect(projectsMeta.title).toBe("Projects | Frank Ncube");
    expect(projectsMeta.alternates?.canonical).toBe("/projects");
    expect(projectsMeta.openGraph?.url).toBe("/projects");
    expect(resumeMeta.title).toBe("Resume | Frank Ncube");
    expect(resumeMeta.alternates?.canonical).toBe("/resume");
    expect(resumeMeta.openGraph?.url).toBe("/resume");
  });
});

describe("portfolio source link", () => {
  it("exposes the public repository from the footer", () => {
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo");
    const link = within(footer).getByRole("link", { name: /source code on GitHub/i });

    expect(link).toHaveAttribute(
      "href",
      "https://github.com/Knarf24/frank-ncube-portfolio",
    );
    expect(link).toHaveTextContent("Built with Next.js · TypeScript");
  });
});
