import Image from "next/image";

// The photo is a cut-out on the hub's indigo-to-teal gradient. On large
// screens the frame stretches to the height of the text beside it (see
// hero.tsx), so it starts level with the badge and ends at the divider.
export function HeroPortrait() {
  return (
    <div className="relative lg:h-full" data-testid="hero-portrait">
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_35%,rgba(103,232,249,0.25),transparent_70%)] blur-2xl"
      />

      <div className="relative aspect-[11/10] overflow-hidden rounded-3xl border-[6px] border-white/15 bg-[radial-gradient(circle_at_50%_30%,rgba(165,180,252,0.55),transparent_60%),linear-gradient(160deg,#6366f1_0%,#4338ca_40%,#0e7490_100%)] shadow-[0_30px_60px_rgba(0,0,0,0.35)] lg:aspect-auto lg:h-full">
        <Image
          src="/images/frank-ncube-portrait-cutout.webp"
          alt="Portrait of Frank Ncube"
          fill
          priority
          sizes="(min-width: 1024px) 460px, (min-width: 640px) 340px, 260px"
          className="object-cover object-top"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(180deg,transparent_65%,rgba(15,14,40,0.35)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10"
        />
      </div>
    </div>
  );
}
