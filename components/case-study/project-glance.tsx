import type { GlanceItem, Project } from "@/lib/portfolio-types";

type ProjectGlanceProps = {
  project: Project;
};

function clean(value: string | undefined): string {
  return value?.trim() ?? "";
}

export function getGlanceItems(project: Project): GlanceItem[] {
  const extras = (project.glance ?? []).filter(
    (item) => clean(item.label) && clean(item.value),
  );
  const stack = (project.primaryStack ?? project.technologies).filter(
    (item) => clean(item),
  );

  return [
    ...extras,
    { label: "Year", value: String(project.year) },
    { label: "Status", value: clean(project.statusLabel) || project.status },
    ...(stack.length > 0
      ? [{ label: "Stack", value: stack.join(" · ") }]
      : []),
  ];
}

export function ProjectGlance({ project }: ProjectGlanceProps) {
  const items = getGlanceItems(project);

  return (
    <dl
      aria-label={`${project.title} at a glance`}
      className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 sm:px-5 md:flex md:flex-wrap md:gap-x-5 md:gap-y-4 md:py-4"
    >
      {items.map((item) => {
        const isStack = item.label === "Stack";

        return (
          <div
            key={item.label}
            className={`grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-t border-[var(--border)] py-3 first:border-t-0 sm:grid-cols-[6rem_minmax(0,1fr)] md:block md:border-t-0 md:py-0 ${
              isStack
                ? "md:min-w-[18rem] md:flex-1 md:basis-[29rem]"
                : "md:max-w-[15rem] md:flex-none"
            }`}
          >
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              {item.label}
            </dt>
            <dd className="text-sm leading-6 text-[var(--text)] md:mt-1.5">
              {isStack ? <StackList value={item.value} /> : item.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

// Each technology is a non-breaking unit. The middle-dot separator is drawn
// in the gap before every item except the first, and the list clips anything
// pushed outside its left edge, so a wrapped line never starts (or ends) with
// a stray separator.
function StackList({ value }: { value: string }) {
  return (
    <ul
      role="list"
      className="flex flex-wrap gap-x-[1.25em] overflow-hidden"
    >
      {value.split(" · ").map((technology) => (
        <li
          key={technology}
          className="relative whitespace-nowrap before:absolute before:-left-[0.625em] before:-translate-x-1/2 before:content-['·'] first:before:content-none"
        >
          {technology}
        </li>
      ))}
    </ul>
  );
}
