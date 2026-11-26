import { siteConfig } from "@/lib/site-config";

const primaryActionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]";

const secondaryActionClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-24"
    >
      <div className="mx-auto w-full max-w-[var(--max-width)] rounded-[2rem] bg-[image:var(--hub-gradient)] px-6 text-white shadow-[var(--card-shadow)] py-14 sm:px-10 sm:py-20 md:px-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#67e8f9]">Contact</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Have an internship, project, or interesting problem?
          </h2>
          <p className="mt-6 text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
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
