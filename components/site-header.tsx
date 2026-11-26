import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { siteConfig } from "@/lib/site-config";

const links = [
  ["Work", "/#work"],
  ["Live apps", "/#live-apps"],
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Contact", "/#contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[color:rgba(30,27,75,0.9)] text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--max-width)] items-center justify-between px-5 py-3 md:px-8">
        <Link
          href="/#top"
          className="inline-flex min-h-11 items-center gap-2.5 font-bold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-[0.6rem] bg-[linear-gradient(135deg,#818cf8,#67e8f9)] text-xs font-extrabold text-[#1e1b4b]"
          >
            FN
          </span>
          Frank Ncube
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-4 text-sm font-medium text-white/80 lg:gap-6">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link
                  className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]"
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={siteConfig.projectHub}
          target="_blank"
          rel="noreferrer"
          aria-label="Project Hub (opens in a new tab)"
          className="hidden min-h-9 items-center rounded-full border border-white/25 bg-white/10 px-4 text-sm font-medium text-white transition-colors hover:bg-white/20 md:inline-flex"
        >
          Project Hub <span aria-hidden="true" className="ml-1">↗</span>
        </a>

        <MobileMenu />
      </div>
    </header>
  );
}
