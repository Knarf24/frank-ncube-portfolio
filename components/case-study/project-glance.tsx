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
      className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 sm:px-5 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] lg:gap-x-6 lg:py-4"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 border-t border-[var(--border)] py-3 first:border-t-0 sm:grid-cols-[6rem_minmax(0,1fr)] lg:block lg:border-t-0 lg:py-0"
        >
          <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
            {item.label}
          </dt>
          <dd className="text-sm leading-6 text-[var(--text)] lg:mt-1.5">
            {item.label === "Stack"
              ? item.value.split(" · ").map((technology, index) => (
                  <span key={technology}>
                    {index > 0 ? " · " : null}
                    <span className="whitespace-nowrap">{technology}</span>
                  </span>
                ))
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
