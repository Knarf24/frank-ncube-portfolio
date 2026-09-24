import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchitectureFlow } from "@/components/case-study/architecture-flow";
import { CaseStudyFooter } from "@/components/case-study/case-study-footer";
import { CaseStudySection } from "@/components/case-study/case-study-section";
import { ContributionSection } from "@/components/case-study/contribution-section";
import { EngineeringDecisions } from "@/components/case-study/engineering-decisions";
import { noBreakTerms } from "@/components/case-study/no-break-terms";
import { ProductPreview } from "@/components/case-study/product-preview";
import { ProjectGlance } from "@/components/case-study/project-glance";
import { ScopeLimits } from "@/components/case-study/scope-limits";
import { projects } from "@/data/projects";
import { getProjectBySlug } from "@/lib/project-utils";

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

        <h1 className="mt-8 text-4xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          {noBreakTerms(project.summary)}
        </p>

        <ProjectGlance project={project} />

        <div className="mt-4 flex flex-wrap gap-x-6">
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
              aria-label={`View the live ${project.title} ${project.liveKind ?? "project"} (opens in a new tab)`}
              className={linkClassName}
            >
              {project.liveKind === "demo" ? "Live demo" : "Live project"} <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          ) : null}
          {project.devpostUrl ? (
            <a
              href={project.devpostUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} on Devpost (opens in a new tab)`}
              className={linkClassName}
            >
              Devpost <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          ) : null}
        </div>

        <ProductPreview preview={project.preview} />

        <div className="mt-14 space-y-12 sm:mt-16">
          {project.caseStudy.map((section) => (
            <CaseStudySection
              key={section.heading}
              heading={section.heading}
              body={section.body}
            />
          ))}

          <ContributionSection contribution={project.contribution} />

          {project.architecture ? (
            <div>
              <CaseStudySection
                heading="Architecture"
                body={[project.architecture.caption]}
              />
              <div className="mt-6 max-w-[var(--max-width)]">
                <ArchitectureFlow labels={project.architecture.steps} />
              </div>
            </div>
          ) : null}

          <EngineeringDecisions decisions={project.decisions} />
          <ScopeLimits limits={project.limits} />
        </div>

        <CaseStudyFooter project={project} />
      </div>
    </main>
  );
}
