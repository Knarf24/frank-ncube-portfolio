import { noBreakTerms } from "@/components/case-study/no-break-terms";

type CaseStudySectionProps = {
  heading: string;
  body: string[];
  items?: string[];
};

export function CaseStudySection({ heading, body, items }: CaseStudySectionProps) {
  return (
    <section className="max-w-2xl">
      <h2 className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl">
        {heading}
      </h2>
      <div className="mt-4 space-y-4">
        {body.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8"
          >
            {noBreakTerms(paragraph)}
          </p>
        ))}
      </div>
      {items && items.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8"
            >
              <span aria-hidden="true" className="text-[var(--accent)]">
                •
              </span>
              <span>{noBreakTerms(item)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
