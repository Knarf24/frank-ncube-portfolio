import Image from "next/image";
import { getHubProjects, HUB_URL, type HubProject } from "@/lib/hub-projects";

const SHOWN = 6;

function HubCard({ project }: { project: HubProject }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] transition-transform hover:-translate-y-1">
      <a
        href={project.demoUrl}
        target="_blank"
        rel="noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[2/1] overflow-hidden bg-[var(--accent-soft)]"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center bg-[image:var(--hub-gradient)] px-6 text-center text-lg font-semibold text-white">
            {project.title}
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(17,24,39,0.82)] px-2 py-1 text-[0.7rem] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
          Live demo
        </span>
      </a>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-[var(--text)]">
          {project.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-6 text-[var(--muted)]">
          {project.description}
        </p>
        {project.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Topics">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md bg-[var(--chip)] px-2 py-0.5 text-xs text-[var(--muted)]"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-1 flex gap-2">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Try ${project.title} (opens in a new tab)`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[var(--accent)] px-3 text-sm font-semibold text-[var(--on-accent)] transition-[filter] hover:brightness-110"
          >
            Try it
          </a>
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[var(--border)] px-3 text-sm font-semibold text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Code
          </a>
        </div>
      </div>
    </article>
  );
}

export async function HubApps() {
  const projects = await getHubProjects();
  const shown = projects.slice(0, SHOWN);

  return (
    <section id="live-apps" className="scroll-mt-24 px-5 py-16 sm:py-24 md:px-8">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
            Live from my Project Hub
          </p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--text)] md:text-5xl">
            Apps you can try right now.
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Small tools that each solve one real problem and run in the
            browser. This list updates on its own from my Project Hub.
          </p>
        </div>

        {shown.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((project) => (
              <HubCard key={project.slug} project={project} />
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[image:var(--hub-gradient)] px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-lg font-semibold">
              {projects.length > 0
                ? `See all ${projects.length} live projects on the Project Hub`
                : "See all my live projects on the Project Hub"}
            </p>
            <p className="mt-1 text-sm text-white/80">
              Search, filter by category and open any demo.
            </p>
          </div>
          <a
            href={HUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Open the Project Hub (opens in a new tab)"
            className="inline-flex min-h-11 shrink-0 items-center rounded-xl bg-white px-5 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5"
          >
            Open Project Hub <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
