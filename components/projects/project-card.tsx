import Link from "next/link";
import { ProjectVisual } from "@/components/projects/project-visual";
import type { Project } from "@/lib/portfolio-types";

type ProjectCardProps = {
  project: Project;
  variant: "flagship" | "standard";
};

const linkClassName =
  "inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]";

const secondaryLinkClassName =
  "inline-flex min-h-11 items-center text-sm text-[var(--muted)] underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--text)] hover:decoration-[var(--border)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]";

// Streetwise's public repository still needs README/description cleanup
// (see the design spec's "GitHub presentation" note), so its GitHub link
// stays visually secondary to the case study until that hygiene work lands.
const deemphasizedGithubSlugs = new Set(["streetwise"]);

export function ProjectCard({ project, variant }: ProjectCardProps) {
  const isFlagship = variant === "flagship";

  return (
    <article
      data-project-variant={variant}
      className={`group rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 transition-[border-color,transform] motion-safe:hover:-translate-y-1 motion-safe:hover:border-[color:rgba(116,247,154,0.38)] sm:p-5 ${
        isFlagship
          ? "md:grid md:grid-cols-[1.05fr_.95fr] md:items-stretch md:gap-6 lg:p-7"
          : "flex h-full flex-col"
      }`}
    >
      <div className={isFlagship ? "order-2 mt-4 md:order-1 md:mt-0" : ""}>
        <ProjectVisual slug={project.slug} />
      </div>

      <div
        className={`flex flex-1 flex-col ${
          isFlagship
            ? "order-1 px-1 pb-2 pt-2 md:order-2 md:px-2 md:py-4"
            : "px-1 pb-2 pt-6"
        }`}
      >
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span className="text-[var(--accent)]">
            {isFlagship ? "01" : String(project.featuredOrder).padStart(2, "0")}
          </span>
          <span>{project.status}</span>
        </div>

        <h3
          className={`mt-4 font-medium tracking-tight text-[var(--text)] ${
            isFlagship ? "text-4xl sm:text-5xl" : "text-3xl"
          }`}
        >
          {project.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
          {project.summary}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
          {project.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--muted)]"
            >
              {technology}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-x-6 pt-7">
          <Link
            href={`/projects/${project.slug}`}
            aria-label={`Read the ${project.title} case study`}
            className={linkClassName}
          >
            Case study <span aria-hidden="true" className="ml-1">→</span>
          </Link>
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} on GitHub (opens in a new tab)`}
              className={
                deemphasizedGithubSlugs.has(project.slug)
                  ? secondaryLinkClassName
                  : linkClassName
              }
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
      </div>
    </article>
  );
}
