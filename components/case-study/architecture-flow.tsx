type ArchitectureFlowProps = {
  labels: string[];
};

export function ArchitectureFlow({ labels }: ArchitectureFlowProps) {
  return (
    <div
      role="img"
      aria-label={labels.join(" to ")}
      className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(circle_at_50%_10%,var(--accent-soft),transparent_52%),var(--surface)] p-5 sm:p-7"
    >
      <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,var(--border)_32%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--border)_32%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />

      <div className="relative flex flex-col items-start gap-1 sm:flex-row sm:flex-wrap sm:gap-3">
        {labels.map((label, index) => (
          <div
            key={label}
            data-flow-step=""
            className="flex min-w-0 max-w-full flex-col items-start gap-1"
          >
            <div
              data-flow-box=""
              className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[color:rgba(9,11,10,0.72)] px-3 py-2.5 text-xs text-[var(--text)] sm:text-sm"
            >
              <span className="font-mono text-[10px] text-[var(--accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{label}</span>
            </div>
            {index < labels.length - 1 ? (
              <span
                aria-hidden="true"
                className="ml-5 text-base text-[var(--accent)] opacity-60 sm:hidden"
              >
                ↓
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
