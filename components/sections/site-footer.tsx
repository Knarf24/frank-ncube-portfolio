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
        <p>Built with Next.js · TypeScript</p>
      </div>
    </footer>
  );
}
