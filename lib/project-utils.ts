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
