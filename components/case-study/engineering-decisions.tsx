import { noBreakTerms } from "@/components/case-study/no-break-terms";
import type { EngineeringDecision } from "@/lib/portfolio-types";

type EngineeringDecisionsProps = {
  decisions?: EngineeringDecision[];
};

export const MAX_DECISIONS = 3;

export function EngineeringDecisions({
  decisions,
}: EngineeringDecisionsProps) {
  const items = (decisions ?? []).slice(0, MAX_DECISIONS);

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="decisions-heading" className="max-w-2xl">
      <h2
        id="decisions-heading"
        className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl"
      >
        Engineering decisions
      </h2>
      <ol className="mt-5 divide-y divide-[var(--border)] border-t border-[var(--border)]">
        {items.map((decision, index) => (
          <li key={decision.title} className="py-5">
            <p className="font-mono text-[10px] text-[var(--accent)]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-base font-medium text-[var(--text)]">
              {noBreakTerms(decision.title)}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
              {noBreakTerms(decision.body)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
