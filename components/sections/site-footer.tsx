import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] px-5 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-[var(--max-width)] flex-col gap-2 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p>{siteConfig.location}</p>
        <p>
          <a
            href={siteConfig.sourceRepo}
            target="_blank"
            rel="noreferrer"
            aria-label="Built with Next.js and TypeScript. View the portfolio source code on GitHub (opens in a new tab)"
            className="inline-flex min-h-11 items-center underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--text)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]"
          >
            Built with Next.js · TypeScript
          </a>
        </p>
      </div>
    </footer>
  );
}
