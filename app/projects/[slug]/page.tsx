import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchitectureFlow } from "@/components/case-study/architecture-flow";
import { CaseStudySection } from "@/components/case-study/case-study-section";
import { projects } from "@/data/projects";
import { getProjectBySlug } from "@/lib/project-utils";

const triageArchitectureLabels = [
  "Incoming ticket",
  "Classification",
  "TF-IDF retrieval",
  "Risk evaluation",
  "AI response",
  "History / stats",
];

const linkClassName =
  "inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project not found | Frank Ncube" };
  }

  return {
    title: `${project.title} | Frank Ncube`,
    description: project.summary,
  };
}

export default async function ProjectCaseStudyPage(
  props: PageProps<"/projects/[slug]">,
) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex-1 px-5 py-14 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
        >
          <span aria-hidden="true" className="mr-1">←</span> Back to projects
        </Link>

        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span className="text-[var(--accent)]">{project.status}</span>
          <span>{project.year}</span>
        </div>

        <h1 className="mt-3 text-4xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          {project.summary}
        </p>

        <ul
          className="mt-6 flex flex-wrap gap-2"
          aria-label={`${project.title} technologies`}
        >
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--muted)]"
            >
              {technology}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-x-6">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
              className={linkClassName}
            >
              GitHub <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View the live ${project.title} project (opens in a new tab)`}
              className={linkClassName}
            >
              Live project <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          ) : null}
        </div>

        <div className="mt-14 space-y-12 sm:mt-16">
          {project.caseStudy.map((section) => (
            <div key={section.heading}>
              <CaseStudySection heading={section.heading} body={section.body} />
              {project.slug === "triage360" &&
              section.heading === "Architecture" ? (
                <div className="mt-6 max-w-[var(--max-width)]">
                  <ArchitectureFlow labels={triageArchitectureLabels} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
