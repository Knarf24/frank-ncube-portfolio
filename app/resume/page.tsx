import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const linkClassName =
  "inline-flex min-h-11 items-center text-sm font-medium text-[var(--text)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:[outline-color:var(--accent)]";

const primaryButtonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]";

const secondaryButtonClassName =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--text)] transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]";

const RESUME_PDF_PATH = "/resume/Frank_Dumoluhle_Ncube_Resume.pdf";

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
          View or download my current internship resume below.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={RESUME_PDF_PATH}
            target="_blank"
            rel="noreferrer"
            className={primaryButtonClassName}
          >
            Open resume PDF
          </a>
          <a
            href={RESUME_PDF_PATH}
            download="Frank_Dumoluhle_Ncube_Resume.pdf"
            className={secondaryButtonClassName}
          >
            Download PDF
          </a>
        </div>

        <div className="mt-10 hidden sm:block">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <object
              data={RESUME_PDF_PATH}
              type="application/pdf"
              title="Frank Ncube's resume"
              className="h-[75vh] min-h-[600px] w-full"
            >
              <div className="flex h-[75vh] min-h-[600px] flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="max-w-sm text-base text-[var(--muted)]">
                  Your browser can’t display the embedded PDF here.
                </p>
                <a
                  href={RESUME_PDF_PATH}
                  target="_blank"
                  rel="noreferrer"
                  className={primaryButtonClassName}
                >
                  Open PDF in a new tab
                </a>
              </div>
            </object>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-sm text-[var(--muted)] sm:hidden">
          Inline preview isn’t available on this device. Use{" "}
          <span className="text-[var(--text)]">Open resume PDF</span> or{" "}
          <span className="text-[var(--text)]">Download PDF</span> above to
          view the full document.
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
