"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const sectionLinks = [
  ["Home", "/#top", "top"],
  ["About", "/#about", "about"],
  ["Education", "/#education", "education"],
  ["Experience", "/#experience", "experience"],
  ["Projects", "/#work", "work"],
  ["Contact", "/#contact", "contact"],
] as const;

// The floating pill menu. On the homepage it highlights the section in view.
export function SectionNav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = sectionLinks
      .map(([, , id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const update = () => {
      const line = window.innerHeight * 0.35;
      let current = "top";
      for (const section of sections) {
        if (section.id === "top") continue;
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <nav
      aria-label="Primary navigation"
      className="pointer-events-auto hidden rounded-full border border-white/10 bg-[color:rgba(30,27,75,0.88)] p-1.5 shadow-lg shadow-black/10 backdrop-blur-xl md:block"
    >
      <ul className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.08em] text-white/75">
        {sectionLinks.map(([label, href, id]) => {
          const isActive = pathname === "/" && active === id;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex min-h-9 items-center rounded-full px-3 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:[outline-color:#67e8f9] lg:px-4 ${
                  isActive ? "bg-white/15 text-white ring-1 ring-white/20" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
