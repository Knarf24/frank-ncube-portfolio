import Link from "next/link";
import { ProjectVisual } from "@/components/projects/project-visual";
import { WorkCard, type WorkItem } from "@/components/projects/work-card";
import { SectionHeading } from "@/components/section-heading";
import { getHubProjects, HUB_URL } from "@/lib/hub-projects";
import { getFeaturedProjects } from "@/lib/project-utils";

// Every project in one grid: the case studies first, in the approved order,
// then the live apps from the Project Hub (featured first, newest next).
export async function SelectedWork() {
  const caseStudies = getFeaturedProjects();
  const hubApps = await getHubProjects();

  const items: { item: WorkItem; slug?: string }[] = [
    ...caseStudies.map((project) => ({
      slug: project.cardImage ? undefined : project.slug,
      item: {
        key: project.slug,
        title: project.title,
        href: `/projects/${project.slug}`,
        category: project.categories[0] ?? "Project",
        date: String(project.year),
        summary: project.summary,
        kind: "Case study" as const,
        image: project.cardImage
          ? {
              src: project.cardImage.src,
              alt: project.cardImage.alt,
              objectPosition: project.cardImage.objectPosition,
            }
          : null,
      },
    })),
    ...hubApps.map((app) => ({
      item: {
        key: app.slug,
        title: app.title,
        href: `/apps/${app.slug}`,
        category: app.category,
        date: app.date,
        summary: app.writeup?.overview ?? app.description,
        kind: "Live app" as const,
        image: app.image ? { src: app.image, alt: "" } : null,
      },
    })),
  ];

  return (
    <section id="work" className="scroll-mt-24 px-5 py-16 sm:py-24 md:px-8">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects built around real problems."
            align="center"
          />
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            In-depth case studies and live apps you can try in your browser.
            Open any card for the full write-up.
          </p>
        </div>

        <div id="live-apps" className="mt-10 grid scroll-mt-24 gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ item, slug }) => (
            <WorkCard
              key={item.key}
              item={item}
              visual={slug ? <ProjectVisual slug={slug} /> : undefined}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[image:var(--hub-gradient)] px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-lg font-semibold">
              Browse everything on my Project Hub
            </p>
            <p className="mt-1 text-sm text-white/80">
              Search, filter by category and open any live demo. New apps appear
              here on their own.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex min-h-11 items-center rounded-xl border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              View all projects
            </Link>
            <a
              href={HUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Open the Project Hub (opens in a new tab)"
              className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-white px-5 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5"
            >
              Open Project Hub <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
