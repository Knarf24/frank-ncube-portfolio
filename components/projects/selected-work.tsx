import Link from "next/link";
import { ProjectCard } from "@/components/projects/project-card";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProjects } from "@/lib/project-utils";

export function SelectedWork() {
  const [flagship, ...secondary] = getFeaturedProjects();

  if (!flagship) {
    return null;
  }

  return (
    <section id="work" className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects built around real problems."
        />

        <div className="mt-10 sm:mt-14">
          <ProjectCard project={flagship} variant="flagship" />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {secondary.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variant="standard"
            />
          ))}
        </div>

        <div className="mt-9 flex justify-end sm:mt-11">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]"
          >
            View all projects <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
