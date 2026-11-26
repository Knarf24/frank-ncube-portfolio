import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";
import { SectionNav } from "@/components/section-nav";
import { siteConfig } from "@/lib/site-config";

// Name on the left, a floating pill menu in the middle that highlights the
// section being read, and the Project Hub on the right.
export function SiteHeader() {
  return (
    <header className="pointer-events-none sticky top-0 z-50">
      <div className="mx-auto flex max-w-[var(--max-width)] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link
          href="/#top"
          className="pointer-events-auto inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[color:rgba(30,27,75,0.88)] py-1.5 pl-1.5 pr-4 font-bold tracking-tight text-white shadow-lg shadow-black/10 backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9]"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-[linear-gradient(135deg,#818cf8,#67e8f9)] text-xs font-extrabold text-[#1e1b4b]"
          >
            FN
          </span>
          Frank Ncube
        </Link>

        <SectionNav />

        <a
          href={siteConfig.projectHub}
          target="_blank"
          rel="noreferrer"
          aria-label="Project Hub (opens in a new tab)"
          className="pointer-events-auto hidden min-h-11 items-center rounded-full bg-[color:rgba(30,27,75,0.88)] px-4 text-sm font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-xl transition-colors hover:bg-[color:rgba(49,46,129,0.95)] lg:inline-flex"
        >
          Project Hub <span aria-hidden="true" className="ml-1">↗</span>
        </a>

        <div className="pointer-events-auto md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
