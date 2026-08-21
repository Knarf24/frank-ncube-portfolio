"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/projects/project-card";
import { filterProjects } from "@/lib/project-utils";
import type { Project, ProjectCategory } from "@/lib/portfolio-types";

type ProjectFilterProps = {
  projects: Project[];
};

const categories = [
  "All",
  "Software engineering",
  "AI / ML",
  "Web",
  "Cloud",
  "Product",
  "Entrepreneurship",
] as const satisfies readonly (ProjectCategory | "All")[];

export function ProjectFilter({ projects }: ProjectFilterProps) {
  const [active, setActive] = useState<ProjectCategory | "All">("All");
  const filtered = filterProjects(projects, active);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap gap-2"
      >
        {categories.map((category) => {
          const isActive = active === category;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(category)}
              className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)] ${
                isActive
                  ? "border-[color:rgba(116,247,154,0.45)] bg-[var(--accent-soft)] text-[var(--text)]"
                  : "border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-[color:rgba(116,247,154,0.35)] hover:text-[var(--text)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} variant="standard" />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-sm text-[var(--muted)]">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
