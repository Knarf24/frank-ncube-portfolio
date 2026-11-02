import type { Project } from "@/lib/portfolio-types";

type ProjectVisualProps = {
  slug: Project["slug"];
};

const commerceSystems = ["Orders", "Inventory", "Payments", "Analytics"];

function CommerceVisual() {
  return (
    <div className="relative flex h-full w-full flex-col justify-center p-5 sm:p-7">
      <div className="grid grid-cols-[minmax(0,.8fr)_2.25rem_minmax(0,1.2fr)] items-center">
        <div className="grid gap-3">
          {['Tenant A', 'Tenant B'].map((tenant) => (
            <div
              key={tenant}
              className="rounded-lg border border-[var(--border)] bg-[color:rgba(12,11,9,0.7)] px-3 py-3 text-center font-mono text-xs text-[var(--muted)]"
            >
              {tenant}
            </div>
          ))}
        </div>

        <svg
          className="h-24 w-full text-[var(--accent)] opacity-55"
          viewBox="0 0 36 96"
          fill="none"
        >
          <path d="M0 18h10c6 0 8 8 8 20v10M0 78h10c6 0 8-8 8-20V48h14" stroke="currentColor" strokeWidth="1.5" />
          <path d="m27 43 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="rounded-xl border border-[color:rgba(120,224,156,0.42)] bg-[var(--accent-soft)] px-3 py-5 text-center text-sm font-medium text-[var(--text)]">
          Shared platform
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {commerceSystems.map((system) => (
          <div
            key={system}
            className="rounded-lg border border-[var(--border)] bg-[color:rgba(12,11,9,0.62)] px-2 py-2 text-center font-mono text-xs text-[var(--muted)]"
          >
            {system}
          </div>
        ))}
      </div>
    </div>
  );
}

function StreetwiseVisual() {
  const steps = ["User context", "Intelligent matching", "Ranked recommendations"];

  return (
    <div className="relative flex h-full w-full items-center p-5 sm:p-7">
      <ol className="mx-auto grid w-full max-w-sm gap-5">
        {steps.map((step, index) => (
          <li
            key={step}
            className={`relative rounded-xl border px-4 py-3 text-center text-xs ${
              index === 1
                ? "border-[color:rgba(120,224,156,0.42)] bg-[var(--accent-soft)] text-[var(--text)]"
                : "border-[var(--border)] bg-[color:rgba(12,11,9,0.7)] text-[var(--muted)]"
            }`}
          >
            {step}
            {index < steps.length - 1 ? (
              <span className="absolute -bottom-5 left-1/2 h-5 w-px -translate-x-1/2 bg-[var(--accent)] opacity-45" />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProjectVisual({ slug }: ProjectVisualProps) {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[250px] overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(circle_at_50%_10%,var(--accent-soft),transparent_52%),var(--surface)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--border)_32%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--border)_32%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
      <div className="relative h-full min-h-[250px]">
        {slug === "etenmall" ? <CommerceVisual /> : null}
        {slug === "streetwise" ? <StreetwiseVisual /> : null}
      </div>
    </div>
  );
}
