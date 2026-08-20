type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm text-[var(--accent)]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
