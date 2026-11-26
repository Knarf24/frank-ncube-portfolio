import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/section-heading";

// "Work experience": one card per role, newest first as in data/experience.ts.
export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 px-5 py-16 sm:py-24 md:px-8">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading eyebrow="Career" title="Work experience" />

        <ol className="mt-10 space-y-5">
          {experience.map((item) => (
            <li
              key={item.title}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] transition-colors hover:border-[var(--accent-line)] sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">
                    {item.organization}
                  </h3>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold text-[var(--accent)]">{item.title}</span>
                    <span aria-hidden="true" className="text-[var(--muted)]"> • </span>
                    <span className="text-[var(--muted)]">{item.period}</span>
                    {item.location ? (
                      <span className="text-[var(--muted)]">{` • ${item.location}`}</span>
                    ) : null}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">
                  {item.kind}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
                {item.summary}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
