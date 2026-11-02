import { SectionHeading } from "@/components/section-heading";
import { TechLogoIcon, techLogos, type TechLogo } from "@/components/sections/tech-logos";
import { skillGroups } from "@/data/skills";

const fadeMaskStyle = {
  maskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
} as const;

function LogoChip({ logo }: { logo: TechLogo }) {
  return (
    <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5">
      <TechLogoIcon path={logo.path} color={logo.color} className="h-6 w-auto" />
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
    <section className="scroll-mt-24 px-5 py-20 sm:py-28 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <SectionHeading eyebrow="Technical toolkit" title="Tools I build with" />

        <div
          className="mt-10 space-y-4 motion-reduce:hidden sm:mt-12"
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

        <dl className="mt-10 divide-y divide-[var(--border)] border-y border-[var(--border)] sm:mt-14">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="grid gap-2 py-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8 sm:py-5"
            >
              <dt className="text-sm font-medium text-[var(--text)]">
                {group.label}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--muted)] sm:text-base">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
          <div className="grid gap-2 py-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-8 sm:py-5">
            <dt className="text-sm font-medium text-[var(--accent)]">
              Currently deepening
            </dt>
            <dd className="text-sm text-[var(--text)] sm:text-base">
              Python engineering · Machine learning · System design
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
