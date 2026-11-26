import Link from "next/link";
import { ProjectVisual } from "@/components/projects/project-visual";
import { WorkCard, type WorkItem } from "@/components/projects/work-card";
import { SectionHeading } from "@/components/section-heading";
import { getHubProjects, HUB_URL } from "@/lib/hub-projects";
import { getFeaturedProjects } from "@/lib/project-utils";

// The homepage shows only the strongest work: three case studies and three
// live apps. The full catalogue lives on the Project Hub.
const SHOWCASE_CASE_STUDIES = ["shopaccess-ai", "triage360", "horizon-desk"];
const SHOWCASE_APPS = ["security-watch", "brand-monitor", "driver-drowsiness-alert"];
const SHOWCASE_SIZE = 6;

export async function SelectedWork() {
  const caseStudies = getFeaturedProjects().filter((project) =>
    SHOWCASE_CASE_STUDIES.includes(project.slug),
  );
  const allApps = await getHubProjects();
  // The chosen apps in the order above, topped up from the rest of the hub
  // if one of them is ever missing from the hub's data.
  const chosen = SHOWCASE_APPS.flatMap((slug) =>
    allApps.filter((app) => app.slug === slug),
  );
  const hubApps = [
    ...chosen,
    ...allApps.filter((app) => !SHOWCASE_APPS.includes(app.slug)),
  ].slice(0, Math.max(0, SHOWCASE_SIZE - caseStudies.length));

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

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={HUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="See all projects on the Project Hub (opens in a new tab)"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[image:var(--hub-gradient)] px-7 text-sm font-semibold text-white shadow-[var(--card-shadow)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            See all projects <span aria-hidden="true" className="ml-1.5">↗</span>
          </a>
          <Link
            href="/projects"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--accent)]"
          >
            View all case studies
          </Link>
        </div>
      </div>
    </section>
  );
}
