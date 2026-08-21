import { SectionHeading } from "@/components/section-heading";
import { TechLogoIcon, techLogos, type TechLogo } from "@/components/sections/tech-logos";

const fadeMaskStyle = {
  maskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
} as const;

function LogoChip({ logo }: { logo: TechLogo }) {
  return (
    <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-[var(--muted)]">
      <TechLogoIcon path={logo.path} className="h-6 w-auto" />
    </div>
  );
}

function MarqueeRow({
  direction,
  durationSeconds,
}: {
  direction: "left" | "right";
  durationSeconds: number;
}) {
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="overflow-hidden" style={fadeMaskStyle}>
      <div
        className="flex w-max gap-4"
        style={{ animation: `${animationName} ${durationSeconds}s linear infinite` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4">
            {techLogos.map((logo) => (
              <LogoChip key={`${copy}-${logo.name}`} logo={logo} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechnicalToolkit() {
  return (
    <section className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-36">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading eyebrow="Technical toolkit" title="Tools I build with" />

        {/* Always available to assistive tech, independent of the motion-based visual below */}
        <ul className="sr-only">
          {techLogos.map((logo) => (
            <li key={logo.name}>{logo.name}</li>
          ))}
        </ul>

        <div
          className="mt-10 space-y-4 motion-reduce:hidden sm:mt-14"
          aria-hidden="true"
        >
          <MarqueeRow direction="left" durationSeconds={38} />
          <MarqueeRow direction="right" durationSeconds={44} />
        </div>

        <div
          className="mt-10 hidden flex-wrap justify-center gap-3 motion-reduce:flex sm:mt-14"
          aria-hidden="true"
        >
          {techLogos.map((logo) => (
            <LogoChip key={logo.name} logo={logo} />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[color:rgba(116,247,154,0.35)] bg-[var(--accent-soft)] px-5 py-5 sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]">
            Currently deepening
          </p>
          <p className="mt-2 text-sm text-[var(--text)] sm:text-base">
            Python engineering · Machine learning · System design
          </p>
        </div>
      </div>
    </section>
  );
}
