import Image from "next/image";
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
    <section className="relative -mt-[4.5rem] flex flex-col overflow-hidden bg-[image:var(--hub-gradient)] px-5 pb-20 pt-[5.75rem] text-white sm:pb-24 sm:pt-28 md:px-8 lg:min-h-[94vh] lg:justify-center lg:pb-28 lg:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 -top-48 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.25),transparent_65%)]"
      />
      <div className="mx-auto grid w-full max-w-[var(--max-width)] items-center gap-8 lg:items-stretch sm:gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-8 xl:gap-14">
        <div className="relative z-10 max-w-3xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#4ade80] shadow-[0_0_0_4px_rgba(74,222,128,0.25)]" />
            Open to internships
          </p>
          <h1 className="mt-4 text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white">
            Frank Ncube
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:mt-7 sm:text-xl sm:leading-9">
            Computer Information Sciences student building{" "}
            <RotatingRole roles={roles} suffix="." />
          </p>
          <p className="mt-4 hidden max-w-xl text-base leading-7 text-white/75 sm:block">
            I take ideas from a rough concept to something people can use, and
            many of them are live for you to try below.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap">
            <a
              href="#work"
              className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#312e81] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9] sm:col-span-1"
            >
              View my work
            </a>
            <a href={siteConfig.github} className={secondaryLinkClassName}>
              GitHub
            </a>
            <a href="/resume" className={secondaryLinkClassName}>
              Resume
            </a>
          </div>


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

        {/* On large screens this column stretches to the text's height; the
            bottom padding equals the profile row under the divider, so the
            photo ends on the divider line. */}
        <div className="relative z-0 mx-auto w-full max-w-[260px] sm:max-w-[340px] lg:mx-0 lg:max-w-[460px] lg:self-stretch lg:justify-self-end lg:pt-1.5 lg:pb-[calc(2.75rem+1px)]">
          <HeroPortrait />
        </div>
      </div>

      <a
        href="#about"
        className="relative z-10 mx-auto mt-12 hidden flex-col items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white lg:flex"
      >
        Scroll to explore
        <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/10 text-base motion-safe:animate-bounce">
          ↓
        </span>
      </a>
    </section>
  );
}
