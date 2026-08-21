import Link from "next/link";
import { ProjectFilter } from "@/components/projects/project-filter";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <main className="flex-1 px-5 py-14 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
        >
          <span aria-hidden="true" className="mr-1">←</span> Back home
        </Link>

        <p className="mt-8 text-sm text-[var(--accent)]">Project archive</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          A collection of software, AI, cloud, and product work focused on
          practical problems and real systems.
        </p>

        <div className="mt-10 sm:mt-14">
          <ProjectFilter projects={projects} />
        </div>
      </div>
    </main>
  );
}
