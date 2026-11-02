import Link from "next/link";
import { BentoCard, type BentoVariant } from "@/components/projects/bento-card";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedProjects } from "@/lib/project-utils";

// Position in the bento: flagship first, then two image tiles, then a strip.
const variants: BentoVariant[] = ["flagship", "wide", "tile", "strip"];

export function SelectedWork() {
  const featured = getFeaturedProjects();

  if (featured.length === 0) {
    return null;
  }

  return (
    <section id="work" className="scroll-mt-24 px-5 py-16 sm:py-24 md:px-8">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading
          eyebrow="Selected work"
          title="Projects built around real problems."
        />

        <div className="mt-10 grid gap-5 sm:mt-14 lg:grid-cols-12">
          {featured.map((project, index) => (
            <BentoCard
              key={project.slug}
              project={project}
              variant={variants[index] ?? "tile"}
            />
          ))}
        </div>

        <div className="mt-9 flex justify-end sm:mt-11">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
          >
            View all projects <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
