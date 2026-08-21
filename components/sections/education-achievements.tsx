import { achievements } from "@/data/achievements";
import { education } from "@/data/education";
import { SectionHeading } from "@/components/section-heading";

export function EducationAchievements() {
  return (
    <section className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-36">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading eyebrow="Education" title="Education & achievements" />

        <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-8">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
              {education.graduation}
            </p>
            <h3 className="mt-3 text-2xl font-medium tracking-tight text-[var(--text)] sm:text-3xl">
              {education.institution}
            </h3>
            <p className="mt-2 text-base text-[var(--muted)]">{education.degree}</p>

            <p className="mt-5 text-sm text-[var(--muted)]">
              GPA <span className="text-[var(--text)]">{education.gpa}</span>
            </p>

            <ul
              className="mt-6 flex flex-wrap gap-2"
              aria-label="Relevant coursework"
            >
              {education.coursework.map((course) => (
                <li
                  key={course}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--muted)]"
                >
                  {course}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Achievements
            </h3>

            <ul className="mt-6 space-y-3">
              {achievements.map((achievement) => (
                <li
                  key={achievement.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5"
                >
                  <p className="text-sm font-medium text-[var(--text)]">
                    {achievement.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {achievement.issuer} · {achievement.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
