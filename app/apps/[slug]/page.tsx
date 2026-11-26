import Image from "next/image";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/sections/site-footer";
import { hubWriteups } from "@/data/hub-writeups";
import { getHubProject, HUB_URL } from "@/lib/hub-projects";
import { pageMetadata } from "@/lib/page-metadata";

// Same refresh as the hub data, so a new hub app gets a page without a rebuild.
export const revalidate = 21600;
export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(hubWriteups).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/apps/[slug]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const app = await getHubProject(slug);
  const writeup = hubWriteups[slug];
  const title = app?.title ?? slug;

  if (!app && !writeup) {
    return { title: "Project not found | Frank Ncube" };
  }

  return pageMetadata(
    {
      title: `${title} | Frank Ncube`,
      description: writeup?.overview ?? app?.description ?? "",
      path: `/apps/${slug}`,
    },
    parent,
  );
}

const chipClassName =
  "rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--muted)]";

export default async function HubAppPage(props: PageProps<"/apps/[slug]">) {
  const { slug } = await props.params;
  const app = await getHubProject(slug);

  if (!app) {
    notFound();
  }

  const writeup = app.writeup;

  return (
    <>
      <main className="flex-1 px-5 py-12 sm:py-16 md:px-8">
        <article className="mx-auto w-full max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#work"
                className="inline-flex min-h-11 items-center rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--on-accent)] hover:brightness-110"
              >
                <span aria-hidden="true" className="mr-1">←</span> Back to projects
              </Link>
              <a
                href={app.demoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Try ${app.title} live (opens in a new tab)`}
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Try it live <span aria-hidden="true" className="ml-1">↗</span>
              </a>
              <a
                href={app.codeUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${app.title} on GitHub (opens in a new tab)`}
                className="inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                View on GitHub
              </a>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label="Category and date">
              {[app.category, app.date].filter(Boolean).map((chip) => (
                <li key={chip} className={chipClassName}>
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
            {app.image ? (
              <div className="relative aspect-[16/8] border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <Image
                  src={app.image}
                  alt={`Screenshot of ${app.title}`}
                  fill
                  priority
                  sizes="(min-width: 896px) 896px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            ) : null}

            <div className="p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--accent)]">
                Live app · Project Hub
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
                {app.title}
              </h1>
              <p className="mt-4 text-base text-[var(--muted)]">
                Developed using {writeup?.builtWith ?? (app.tags.join(", ") || "the browser")}.
              </p>

              {writeup ? (
                <>
                  <p className="mt-6 text-lg leading-8 text-[var(--text)]">
                    {writeup.overview}
                  </p>

                  <h2 className="mt-10 text-xl font-semibold text-[var(--text)]">
                    The problem
                  </h2>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{writeup.problem}</p>

                  <h2 className="mt-10 text-xl font-semibold text-[var(--text)]">
                    What it does
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {writeup.features.map((feature) => (
                      <li key={feature} className="flex gap-3 leading-7 text-[var(--muted)]">
                        <span aria-hidden="true" className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {writeup.howItWorks ? (
                    <>
                      <h2 className="mt-10 text-xl font-semibold text-[var(--text)]">
                        How it works
                      </h2>
                      <ol className="mt-3 space-y-2">
                        {writeup.howItWorks.map((step, index) => (
                          <li key={step} className="flex gap-3 leading-7 text-[var(--muted)]">
                            <span className="font-mono text-sm text-[var(--accent)]">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </>
                  ) : null}

                  <h2 className="mt-10 text-xl font-semibold text-[var(--text)]">
                    Built by combining
                  </h2>
                  <p className="mt-3 leading-7 text-[var(--muted)]">
                    {writeup.combines.length} GeeksforGeeks Python projects, turned into one
                    app that solves a real problem:
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {writeup.combines.map((source) => (
                      <li
                        key={source}
                        className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-sm text-[var(--muted)]"
                      >
                        {source}
                      </li>
                    ))}
                  </ul>

                  {writeup.note ? (
                    <p className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] px-5 py-4 text-sm leading-6 text-[var(--muted)]">
                      <span className="font-semibold text-[var(--text)]">Note: </span>
                      {writeup.note}
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="mt-6 text-lg leading-8 text-[var(--text)]">
                  {app.description}
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
                <a
                  href={app.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open the ${app.title} live demo (opens in a new tab)`}
                  className="inline-flex min-h-11 items-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--on-accent)] hover:brightness-110"
                >
                  Open the live demo <span aria-hidden="true" className="ml-1">↗</span>
                </a>
                <a
                  href={HUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="See all apps on the Project Hub (opens in a new tab)"
                  className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  See all apps on the Project Hub ↗
                </a>
              </div>
            </div>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
