import { experience } from "@/data/experience";
import { SectionHeading } from "@/components/section-heading";
import type { ExperienceItem } from "@/lib/portfolio-types";

const focusAreas = [
  "Software engineering",
  "AI systems",
  "Cloud",
  "Product development",
];

const kindLabel: Record<ExperienceItem["kind"], string> = {
  "Client work": "Client work",
  Entrepreneurship: "Entrepreneurship",
  Campus: "Campus",
  Professional: "Professional",
};

export function AboutExperience() {
  return (
    <section
      id="about"
      className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-36"
    >
      <div className="mx-auto grid w-full max-w-[var(--max-width)] gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <SectionHeading eyebrow="About" title="I build technology around real problems." />

          <p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            I build software, AI systems, and digital products end to end —
            from client-facing projects to my own ventures. I care about
            practical problem solving over theory, and I like taking an idea
            from a rough concept to something people can actually use.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Areas of focus">
            {focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)]"
              >
                {area}
              </li>
            ))}
          </ul>
        </div>

        <div id="experience" className="scroll-mt-24">
          <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Experience
          </h3>

          <ol className="mt-6 space-y-8 border-l border-[var(--border)] pl-6">
            {experience.map((item) => (
              <li key={item.title} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.6rem] top-1.5 h-2.5 w-2.5 rounded-full border border-[var(--accent)] bg-[var(--background)]"
                />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {kindLabel[item.kind]}
                  </span>
                  <span className="text-xs text-[var(--muted)]">{item.period}</span>
                </div>

                <h4 className="mt-2 text-lg font-medium text-[var(--text)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {item.organization}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {item.summary}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
