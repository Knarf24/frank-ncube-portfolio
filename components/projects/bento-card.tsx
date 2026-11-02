import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { ProjectVisual } from "@/components/projects/project-visual";
import { linkClassName } from "@/components/projects/project-card";
import type { Project } from "@/lib/portfolio-types";

export type BentoVariant = "flagship" | "wide" | "tile" | "strip";

const spans: Record<BentoVariant, string> = {
  flagship: "lg:col-span-12 lg:grid lg:grid-cols-12 lg:gap-10 lg:p-8",
  wide: "lg:col-span-7 flex flex-col",
  tile: "lg:col-span-5 flex flex-col",
  strip: "lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-10",
};

const frames: Record<BentoVariant, string> = {
  flagship: "aspect-[16/11] lg:col-span-7 lg:order-2",
  wide: "aspect-[16/10]",
  tile: "aspect-[16/10]",
  strip: "",
};

export function BentoCard({
  project,
  variant,
}: {
  project: Project;
  variant: BentoVariant;
}) {
  const isFlagship = variant === "flagship";
  const isStrip = variant === "strip";
  const image = project.cardImage;
  const stack = project.technologies.slice(0, isFlagship ? 6 : 4);

  return (
    <article
      data-project-variant={variant}
      className={`group rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-4 transition-[border-color,background-color] duration-300 motion-safe:hover:border-[color:rgba(120,224,156,0.4)] sm:p-5 ${spans[variant]}`}
    >
      {isStrip ? (
        <div className="lg:col-span-5">
          <ProjectVisual slug={project.slug} />
        </div>
      ) : image ? (
        <div
          className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] ${frames[variant]}`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={isFlagship}
            sizes={
              isFlagship
                ? "(min-width: 1180px) 680px, (min-width: 1024px) 55vw, 92vw"
                : "(min-width: 1024px) 560px, 92vw"
            }
            className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
            style={{ objectPosition: image.objectPosition }}
          />
          {image.caption ? (
            <span className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] rounded-full bg-[color:rgba(12,11,9,0.82)] px-3 py-1.5 text-xs text-[var(--text)]">
              {image.caption}
            </span>
          ) : null}
        </div>
      ) : (
        <ProjectVisual slug={project.slug} />
      )}

      <div
        className={`flex flex-1 flex-col px-1 pb-2 pt-6 ${
          isFlagship ? "lg:order-1 lg:col-span-5 lg:justify-center lg:py-4" : ""
        } ${isStrip ? "lg:col-span-7 lg:pt-2" : ""}`}
      >
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          <span className={isFlagship ? "text-[var(--accent)]" : ""}>
            {project.statusLabel ?? project.status}
          </span>
          <span aria-hidden="true"> · </span>
          {project.year}
        </p>

        <h3
          className={`mt-4 font-serif font-normal tracking-tight text-[var(--text)] ${
            isFlagship ? "text-5xl sm:text-6xl" : "text-4xl"
          }`}
        >
          {project.title}
        </h3>
        <p
          className={`mt-4 leading-7 text-[var(--muted)] ${
            isFlagship ? "text-base sm:text-lg sm:leading-8" : "text-base"
          }`}
        >
          {project.summary}
        </p>

        <ul
          className="mt-6 flex flex-wrap gap-2"
          aria-label={`${project.title} technologies`}
        >
          {stack.map((technology) => (
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
          {project.video ? (
            <a
              href={project.video.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${project.video.label} (opens in a new tab)`}
              className={linkClassName}
            >
              <Play aria-hidden="true" className="mr-1.5 h-3.5 w-3.5 fill-current" />
              Demo video <span aria-hidden="true" className="ml-1">↗</span>
            </a>
          ) : null}
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
      </div>
    </article>
  );
}
