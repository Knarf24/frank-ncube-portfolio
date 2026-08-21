type CaseStudySectionProps = {
  heading: string;
  body: string[];
};

export function CaseStudySection({ heading, body }: CaseStudySectionProps) {
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
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
