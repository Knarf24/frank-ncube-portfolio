import { skillGroups } from "@/data/skills";
import { SectionHeading } from "@/components/section-heading";

export function TechnicalToolkit() {
  return (
    <section className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-36">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading eyebrow="Toolkit" title="Technical toolkit" />

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6"
            >
              <h3 className="text-sm font-medium text-[var(--text)]">
                {group.label}
              </h3>
              <ul
                className="mt-4 flex flex-wrap gap-2"
                aria-label={`${group.label} skills`}
              >
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--muted)]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[color:rgba(116,247,154,0.35)] bg-[var(--accent-soft)] px-5 py-5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Currently deepening
          </p>
          <p className="mt-2 text-sm text-[var(--text)] sm:text-base">
            Python engineering · Machine learning · System design
          </p>
        </div>
      </div>
    </section>
  );
}
