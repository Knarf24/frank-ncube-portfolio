import Image from "next/image";
import { AnimatedGlobe } from "@/components/hero/animated-globe";
import { RotatingRole } from "@/components/hero/rotating-role";
import { siteConfig } from "@/lib/site-config";

const roles = ["software", "AI systems", "cloud tools", "digital products"];

const profileItems = [
  "Livingstone College",
  "Class of 2029",
  "Software · AI · Cloud",
];

const secondaryLinkClassName =
  "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--text)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)] sm:w-auto";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-12 pt-8 sm:pb-20 sm:pt-16 md:px-8 md:pb-28 md:pt-20 lg:min-h-[calc(100svh-76px)] lg:py-20">
      <div className="mx-auto grid w-full max-w-[var(--max-width)] items-center gap-11 sm:gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-8 xl:gap-14">
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-[var(--muted)]">
            Hello, I’m
          </p>
          <h1 className="mt-3 text-[clamp(3.5rem,8vw,6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[var(--text)]">
            Frank Ncube
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:mt-7 sm:text-xl sm:leading-9">
            Computer Information Sciences student building{" "}
            <RotatingRole roles={roles} suffix="." />
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap">
            <a
              href="#work"
              className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)] sm:col-span-1"
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

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)] sm:mt-9 sm:gap-0 sm:pt-5">
            {profileItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 after:hidden after:text-[var(--border)] after:content-['/'] last:after:hidden sm:after:mx-4 sm:after:block"
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

        <div className="relative z-0 mx-auto w-full max-w-[300px] sm:max-w-[430px] lg:-translate-x-4 lg:justify-self-center xl:-translate-x-6">
          <AnimatedGlobe />
        </div>
      </div>
    </section>
  );
}
