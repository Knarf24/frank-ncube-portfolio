import Image from "next/image";
import Link from "next/link";
import { HeroPortrait } from "@/components/hero/hero-portrait";
import { RotatingRole } from "@/components/hero/rotating-role";
import { siteConfig } from "@/lib/site-config";

const roles = ["software", "AI systems", "cloud tools", "digital products"];

const profileItems = [
  "Livingstone College",
  "Class of 2029",
  "Software · AI · Cloud",
];

const secondaryLinkClassName =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-white/30 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9] sm:w-auto";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[image:var(--hub-gradient)] px-5 pb-20 pt-6 text-white sm:pb-24 sm:pt-14 md:px-8 lg:pb-28 lg:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.25),transparent_65%)]"
      />
      <div className="mx-auto grid w-full max-w-[var(--max-width)] items-center gap-8 sm:gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-8 xl:gap-14">
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-white/75">
            Hello, I’m
          </p>
          <h1 className="mt-3 text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white">
            Frank Ncube
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:mt-7 sm:text-xl sm:leading-9">
            Computer Information Sciences student building{" "}
            <RotatingRole roles={roles} suffix="." />
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap">
            <a
              href="#work"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]"
            >
              View my work
            </a>
            <a href="#live-apps" className={secondaryLinkClassName}>
              Try live apps
            </a>
            <a href={siteConfig.github} className={secondaryLinkClassName}>
              GitHub
            </a>
            <a href="/resume" className={secondaryLinkClassName}>
              Resume
            </a>
          </div>

          <Link
            href="/projects/shopaccess-ai"
            className="mt-8 hidden min-h-11 sm:inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pl-4 pr-5 text-sm text-white/85 transition-colors hover:bg-white/15 hover:text-white"
          >
            <span className="h-2 w-2 rounded-full bg-[#4ade80]" aria-hidden="true" />
            Latest: ShopAccess AI, a PayPal AI Hackathon prototype
            <span aria-hidden="true">→</span>
          </Link>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/20 pt-4 text-sm text-white/80 sm:mt-9 sm:gap-0 sm:pt-5">
            {profileItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 after:hidden after:text-white/30 after:content-['/'] last:after:hidden sm:after:mx-4 sm:after:block"
              >
                {item === "Livingstone College" ? (
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white p-[3px] sm:h-6 sm:w-6">
                    <Image
                      src="/logos/livingstone-college.png"
                      alt=""
                      aria-hidden="true"
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                    />
                  </span>
                ) : null}
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-0 mx-auto w-full max-w-[220px] sm:max-w-[300px] lg:max-w-[380px] lg:-translate-x-4 lg:justify-self-center xl:max-w-[420px] xl:-translate-x-6">
          <HeroPortrait />
        </div>
      </div>
    </section>
  );
}
