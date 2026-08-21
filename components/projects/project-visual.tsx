import type { Project } from "@/lib/portfolio-types";

type ProjectVisualProps = {
  slug: Project["slug"];
};

const triageSteps = [
  "Incoming ticket",
  "Classification",
  "Retrieval",
  "Risk evaluation",
  "Response",
];

const commerceSystems = ["Orders", "Inventory", "Payments", "Analytics"];

function TriageVisual() {
  return (
    <div className="relative flex h-full w-full items-center p-5 sm:p-7">
      <div className="w-full">
        <div className="mb-7 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_var(--accent)]" />
          Support routing pipeline
        </div>

        <ol className="grid gap-3 sm:grid-cols-5 sm:gap-2">
          {triageSteps.map((step, index) => (
            <li
              key={step}
              className="relative flex min-h-12 items-center rounded-xl border border-[var(--border)] bg-[color:rgba(9,11,10,0.72)] px-3 py-2.5 text-xs leading-4 text-[var(--text)] sm:min-h-20 sm:justify-center sm:px-2 sm:text-center sm:text-[11px]"
            >
              <span className="mr-3 font-mono text-[10px] text-[var(--accent)] sm:absolute sm:left-2.5 sm:top-2 sm:mr-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
              {index < triageSteps.length - 1 ? (
                <span className="absolute -bottom-3 left-6 h-3 w-px bg-[var(--accent)] opacity-45 sm:-right-2 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-px sm:w-2" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CommerceVisual() {
  return (
    <div className="relative flex h-full w-full flex-col justify-center p-5 sm:p-7">
      <div className="grid grid-cols-[minmax(0,.8fr)_2.25rem_minmax(0,1.2fr)] items-center">
        <div className="grid gap-3">
          {['Tenant A', 'Tenant B'].map((tenant) => (
            <div
              key={tenant}
              className="rounded-lg border border-[var(--border)] bg-[color:rgba(9,11,10,0.7)] px-3 py-3 text-center font-mono text-[11px] text-[var(--muted)]"
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

        <div className="rounded-xl border border-[color:rgba(116,247,154,0.42)] bg-[var(--accent-soft)] px-3 py-5 text-center text-sm font-medium text-[var(--text)]">
          Shared platform
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {commerceSystems.map((system) => (
          <div
            key={system}
            className="rounded-lg border border-[var(--border)] bg-[color:rgba(9,11,10,0.62)] px-2 py-2 text-center font-mono text-[10px] text-[var(--muted)]"
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
                ? "border-[color:rgba(116,247,154,0.42)] bg-[var(--accent-soft)] text-[var(--text)]"
                : "border-[var(--border)] bg-[color:rgba(9,11,10,0.7)] text-[var(--muted)]"
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
        {slug === "triage360" ? <TriageVisual /> : null}
        {slug === "commerce-platform" ? <CommerceVisual /> : null}
        {slug === "streetwise" ? <StreetwiseVisual /> : null}
      </div>
    </div>
  );
}
