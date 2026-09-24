type ScopeLimitsProps = {
  limits?: string[];
};

export function ScopeLimits({ limits }: ScopeLimitsProps) {
  const items = (limits ?? []).filter((item) => item.trim());

  if (items.length === 0) return null;

  return (
    <section aria-labelledby="limits-heading" className="max-w-2xl">
      <h2
        id="limits-heading"
        className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl"
      >
        Scope and limits
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8"
          >
            <span aria-hidden="true" className="text-[var(--accent)]">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
