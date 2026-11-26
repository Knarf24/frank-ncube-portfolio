import { Download, FileText, Mail, MapPin, Trophy } from "lucide-react";
import { GithubIcon as Github, LinkedinIcon as Linkedin } from "@/components/brand-icons";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/lib/site-config";

const focusAreas = [
  "Software engineering",
  "AI systems",
  "Cloud",
  "Product development",
];

const RESUME_PDF = "/resume/Frank_Dumoluhle_Ncube_Resume.pdf";

const connect = [
  { icon: Mail, label: siteConfig.email, href: `mailto:${siteConfig.email}`, name: "Email" },
  { icon: Linkedin, label: "Frank Ncube", href: siteConfig.linkedin, name: "LinkedIn" },
  { icon: Github, label: "Knarf24", href: siteConfig.github, name: "GitHub" },
  { icon: Trophy, label: "Knarf24", href: siteConfig.devpost, name: "Devpost" },
];

// Two cards side by side: who I am (with the résumé), and how to reach me.
export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 px-5 py-16 sm:py-24 md:px-8">
      <div className="mx-auto grid w-full max-w-[var(--max-width)] gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-10">
          <SectionHeading eyebrow="About me" title="I build technology around real problems." />

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            I build software, AI systems, and digital products end to end —
            from client-facing projects to my own ventures. I care about
            practical problem solving over theory, and I like taking an idea
            from a rough concept to something people can actually use.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Areas of focus">
            {focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1.5 text-xs text-[var(--muted)]"
              >
                {area}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={RESUME_PDF}
              download="Frank_Dumoluhle_Ncube_Resume.pdf"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--on-accent)] hover:brightness-110"
            >
              <Download aria-hidden="true" size={16} /> Download résumé
            </a>
            <a
              href="/resume"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] px-5 text-sm font-semibold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <FileText aria-hidden="true" size={16} /> Open résumé
            </a>
          </div>
        </div>

        <aside
          aria-labelledby="connect-heading"
          className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)] sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
            Contact details
          </p>
          <h3 id="connect-heading" className="mt-2 text-2xl font-bold tracking-tight text-[var(--text)]">
            Let’s connect
          </h3>
          <ul className="mt-5 divide-y divide-[var(--border)]">
            {connect.map(({ icon: Icon, label, href, name }) => (
              <li key={name}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
                  aria-label={`${name}: ${label}`}
                  className="flex min-h-12 items-center gap-3 py-2 text-sm text-[var(--text)] hover:text-[var(--accent)]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <Icon aria-hidden="true" size={16} />
                  </span>
                  <span className="min-w-0 break-words">{label}</span>
                </a>
              </li>
            ))}
            <li className="flex min-h-12 items-center gap-3 py-2 text-sm text-[var(--muted)]">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <MapPin aria-hidden="true" size={16} />
              </span>
              {siteConfig.location}
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
