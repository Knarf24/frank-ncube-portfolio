import { siteConfig } from "@/lib/site-config";

const primaryActionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]";

const secondaryActionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--text)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-24"
    >
      <div className="mx-auto w-full max-w-[var(--max-width)] rounded-[2rem] border border-[var(--border)] bg-[radial-gradient(circle_at_50%_0%,var(--accent-soft),transparent_60%),var(--surface)] px-6 py-14 sm:px-10 sm:py-20 md:px-16">
        <div className="max-w-2xl">
          <p className="text-sm text-[var(--accent)]">Contact</p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-[var(--text)] sm:text-4xl md:text-5xl">
            Have an internship, project, or interesting problem?
          </h2>
          <p className="mt-6 text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            I’m interested in opportunities where I can learn quickly,
            contribute technically, and work on products people use.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-11 sm:flex sm:flex-wrap">
          <a
            href={`mailto:${siteConfig.email}`}
            className={`col-span-2 ${primaryActionClassName} sm:col-span-1`}
          >
            Email me
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className={secondaryActionClassName}
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub (opens in a new tab)"
            className={secondaryActionClassName}
          >
            GitHub
          </a>
          <a
            href={siteConfig.devpost}
            target="_blank"
            rel="noreferrer"
            aria-label="Devpost (opens in a new tab)"
            className={secondaryActionClassName}
          >
            Devpost
          </a>
          <a href="/resume" className={secondaryActionClassName}>
            View resume
          </a>
        </div>
      </div>
    </section>
  );
}
