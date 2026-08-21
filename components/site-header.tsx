import Link from "next/link";
import { MobileMenu } from "@/components/mobile-menu";

const links = [
  ["Work", "/#work"],
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Contact", "/#contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-[color:rgba(9,11,10,0.84)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--max-width)] items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/#top"
          className="inline-flex min-h-11 min-w-11 items-center font-medium tracking-wide text-[var(--text)] transition-colors hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
        >
          FN
        </Link>

        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-4 text-sm text-[var(--muted)] lg:gap-6">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link
                  className="inline-flex min-h-11 items-center px-1 transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
                  href={href}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] md:block">
          Open to internships
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
