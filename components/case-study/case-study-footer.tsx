import Link from "next/link";
import { getAdjacentProjects } from "@/lib/project-utils";
import type { Project } from "@/lib/portfolio-types";

type CaseStudyFooterProps = {
  project: Project;
};

const linkClassName =
  "inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]";

const neighborClassName =
  "group flex min-h-11 flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-4 transition-[border-color] hover:border-[color:rgba(116,247,154,0.38)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]";

export function CaseStudyFooter({ project }: CaseStudyFooterProps) {
  const adjacent = getAdjacentProjects(project.slug);

  return (
    <footer className="mt-16 border-t border-[var(--border)] pt-8 sm:mt-20">
      {adjacent ? (
        <nav
          aria-label="More case studies"
          className="grid gap-3 sm:grid-cols-2"
        >
          <Link
            href={`/projects/${adjacent.previous.slug}`}
            className={neighborClassName}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              <span aria-hidden="true">← </span>Previous project
            </span>
            <span className="mt-2 text-base font-medium text-[var(--text)]">
              {adjacent.previous.title}
            </span>
          </Link>
          <Link
            href={`/projects/${adjacent.next.slug}`}
            className={`${neighborClassName} sm:items-end sm:text-right`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              Next project<span aria-hidden="true"> →</span>
            </span>
            <span className="mt-2 text-base font-medium text-[var(--text)]">
              {adjacent.next.title}
            </span>
          </Link>
        </nav>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-x-6">
        <Link href="/projects" className={linkClassName}>
          All projects
        </Link>
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source on GitHub (opens in a new tab)`}
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
            aria-label={`${project.title} live ${project.liveKind ?? "project"} (opens in a new tab)`}
            className={linkClassName}
          >
            {project.liveKind === "demo" ? "Live demo" : "Live project"}{" "}
            <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        ) : null}
        {project.devpostUrl ? (
          <a
            href={project.devpostUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} submission on Devpost (opens in a new tab)`}
            className={linkClassName}
          >
            Devpost <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        ) : null}
        <Link href="/#contact" className={linkClassName}>
          Contact me
        </Link>
      </div>
    </footer>
  );
}
