import type { ProjectContribution } from "@/lib/portfolio-types";

type ContributionSectionProps = {
  contribution?: ProjectContribution;
};

export function ContributionSection({
  contribution,
}: ContributionSectionProps) {
  if (!contribution) return null;

  const team = contribution.team?.filter((name) => name.trim()) ?? [];
  const isTeam = contribution.mode === "team";

  return (
    <section aria-labelledby="contribution-heading" className="max-w-2xl">
      <h2
        id="contribution-heading"
        className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl"
      >
        My contribution
      </h2>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
        {contribution.summary}
      </p>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
        {isTeam ? "Team project" : "Individual project"}
      </p>

      {isTeam && team.length > 0 ? (
        <>
          <h3 className="sr-only">Team</h3>
          <ul
            aria-label="Team members"
            className="mt-3 flex flex-wrap gap-2"
          >
            {team.map((name) => (
              <li
                key={name}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs text-[var(--text)]"
              >
                {name}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {contribution.teamNote ? (
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          {contribution.teamNote}
        </p>
      ) : null}
    </section>
  );
}
