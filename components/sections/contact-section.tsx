import { ContactForm } from "@/components/sections/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/site-config";

const directLinkClassName =
  "inline-flex min-h-11 items-center rounded-xl border border-white/30 bg-white/5 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 px-5 py-16 sm:py-24 md:px-8">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            eyebrow="Contact"
            title="Have an internship, project, or interesting problem?"
            align="center"
          />
          <p className="mt-4 text-base leading-7 text-[var(--muted)] sm:text-lg">
            I’m interested in opportunities where I can learn quickly,
            contribute technically, and work on products people use.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <ContactForm email={siteConfig.email} />

          <aside
            aria-labelledby="direct-contact-heading"
            className="self-start rounded-3xl bg-[image:var(--hub-gradient)] p-6 text-white shadow-[var(--card-shadow)] sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#67e8f9]">
              Direct contact
            </p>
            <h3 id="direct-contact-heading" className="mt-2 text-2xl font-bold tracking-tight">
              Email and profiles
            </h3>
            <p className="mt-3 break-words text-sm text-white/80">
              {siteConfig.email}
              <br />
              {siteConfig.location}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5"
            >
              Email me
            </a>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn (opens in a new tab)"
                className={directLinkClassName}
              >
                LinkedIn
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub (opens in a new tab)"
                className={directLinkClassName}
              >
                GitHub
              </a>
              <a
                href={siteConfig.devpost}
                target="_blank"
                rel="noreferrer"
                aria-label="Devpost (opens in a new tab)"
                className={directLinkClassName}
              >
                Devpost
              </a>
              <a href="/resume" className={directLinkClassName}>
                View resume
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
