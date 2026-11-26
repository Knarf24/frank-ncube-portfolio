"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

export type WorkItem = {
  key: string;
  title: string;
  href: string;
  category: string;
  date: string;
  summary: string;
  kind: "Case study" | "Live app";
  image?: { src: string; alt: string; objectPosition?: string } | null;
};

// One card in the "Selected work" grid: picture, title, category and date
// chips, and a chevron that expands a short summary in place. The picture and
// title open the project's own page.
export function WorkCard({ item, visual }: { item: WorkItem; visual?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const summaryId = useId();

  return (
    <article
      data-work-kind={item.kind}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] transition-[transform,border-color] duration-300 motion-safe:hover:-translate-y-1 hover:border-[var(--accent-line)]"
    >
      <Link
        href={item.href}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[16/10] overflow-hidden bg-[var(--surface-elevated)]"
      >
        {item.image ? (
          <Image
            src={item.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            style={{ objectPosition: item.image.objectPosition ?? "50% 0%" }}
          />
        ) : visual ? (
          <span className="flex h-full items-center justify-center p-4">{visual}</span>
        ) : (
          <span className="flex h-full items-center justify-center bg-[image:var(--hub-gradient)] px-6 text-center text-xl font-semibold text-white">
            {item.title}
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-[rgba(17,24,39,0.82)] px-2 py-1 text-[0.7rem] font-semibold text-white">
          {item.kind === "Live app" ? (
            <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
          ) : null}
          {item.kind}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-[var(--text)]">
          <Link
            href={item.href}
            aria-label={
              item.kind === "Case study"
                ? `Read the ${item.title} case study`
                : `${item.title}: read more and try it`
            }
            className="hover:text-[var(--accent)]"
          >
            {item.title}
          </Link>
        </h3>

        <div className="mt-3 flex items-start justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Category and date">
            {[item.category, item.date].filter(Boolean).map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]"
              >
                {chip}
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={summaryId}
            aria-label={open ? `Hide summary of ${item.title}` : `Show summary of ${item.title}`}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <ChevronDown
              aria-hidden="true"
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div id={summaryId} hidden={!open} className="mt-4">
          <p className="text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
          <Link
            href={item.href}
            tabIndex={-1}
            aria-hidden="true"
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            {item.kind === "Live app" ? "Read more and try it" : "Read the case study"}
            <span aria-hidden="true" className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
