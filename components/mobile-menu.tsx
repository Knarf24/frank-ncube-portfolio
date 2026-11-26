"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { sectionLinks } from "@/components/section-nav";


export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="mobile-navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[color:rgba(30,27,75,0.88)] text-white shadow-lg shadow-black/10 backdrop-blur-xl transition-colors hover:bg-[color:rgba(49,46,129,0.95)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
      >
        {open ? (
          <X aria-hidden="true" size={18} strokeWidth={1.75} />
        ) : (
          <Menu aria-hidden="true" size={18} strokeWidth={1.75} />
        )}
      </button>

      {open ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute left-4 right-4 top-20 z-50 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 shadow-2xl shadow-black/30"
        >
          <ul className="space-y-1">
            {sectionLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 py-2 text-base text-[var(--text)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:var(--accent)]"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.projectHub}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-3 py-2 text-base font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
              >
                Project Hub <span aria-hidden="true" className="ml-1">↗</span>
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
