import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const linkClassName =
  "inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]";

export default function ResumePage() {
  return (
    <main className="flex-1 px-5 py-14 sm:py-20 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-[var(--max-width)]">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
        >
          <span aria-hidden="true" className="mr-1">←</span> Back to homepage
        </Link>

        <p className="mt-8 text-sm text-[var(--accent)]">Resume</p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight text-[var(--text)] md:text-5xl">
          Resume
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          My internship resume is being updated. The final PDF will be
          published here before portfolio launch.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub (opens in a new tab)"
            className={linkClassName}
          >
            GitHub <span aria-hidden="true" className="ml-1">↗</span>
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className={linkClassName}
          >
            LinkedIn <span aria-hidden="true" className="ml-1">↗</span>
          </a>
        </div>
      </div>
    </main>
  );
}
