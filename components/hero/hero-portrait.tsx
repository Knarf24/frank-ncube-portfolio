import Image from "next/image";

export function HeroPortrait() {
  return (
    <div className="relative" data-testid="hero-portrait">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_35%,var(--accent-soft),transparent_70%)] blur-2xl"
      />

      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_0_60px_-15px_var(--accent-soft)]">
        <Image
          src="/images/frank-ncube-portrait.png"
          alt="Portrait of Frank Ncube"
          fill
          priority
          sizes="(min-width: 1280px) 420px, (min-width: 1024px) 380px, (min-width: 640px) 300px, 240px"
          className="object-cover"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(180deg,transparent_60%,rgba(9,11,10,0.35)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-[color:rgba(116,247,154,0.18)]"
        />
      </div>
    </div>
  );
}
