import { projects } from "@/data/projects";
import type { Project, ProjectCategory } from "@/lib/portfolio-types";

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function filterProjects(
  items: Project[],
  category: ProjectCategory | "All",
): Project[] {
  if (category === "All") return items;
  return items.filter((project) => project.categories.includes(category));
}

export function getFeaturedProjects(): Project[] {
  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

export function getProjectNumber(project: Project): number {
  return (
    project.featuredOrder ??
    projects.findIndex((item) => item.slug === project.slug) + 1
  );
}

export function getOrderedProjects(): Project[] {
  return projects
    .map((project, index) => ({ project, index }))
    .sort(
      (a, b) =>
        (a.project.featuredOrder ?? Number.MAX_SAFE_INTEGER) -
          (b.project.featuredOrder ?? Number.MAX_SAFE_INTEGER) ||
        a.index - b.index,
    )
    .map(({ project }) => project);
}

export function getAdjacentProjects(slug: string): {
  previous: Project;
  next: Project;
} | null {
  const ordered = getOrderedProjects();
  const index = ordered.findIndex((project) => project.slug === slug);

  if (index === -1 || ordered.length < 2) return null;

  return {
    previous: ordered[(index - 1 + ordered.length) % ordered.length],
    next: ordered[(index + 1) % ordered.length],
  };
}
