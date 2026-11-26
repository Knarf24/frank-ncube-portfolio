import { education } from "@/data/education";
import { getFeaturedProjects } from "@/lib/project-utils";
import { getHubProjects } from "@/lib/hub-projects";

// Every number here comes from data the site already shows: the live apps on
// the Project Hub, the featured case studies, education.ts and experience.ts.
export async function HeroStats() {
  const liveApps = (await getHubProjects()).length;
  const stats = [
    ...(liveApps > 0
      ? [{ value: String(liveApps), label: "live apps on my Project Hub", href: "#work" }]
      : []),
    { value: String(getFeaturedProjects().length), label: "in-depth case studies", href: "#work" },
    { value: education.gpa.split(" ")[0], label: "GPA, B.S. Computer Information Sciences" },
    { value: "~30", label: "people coordinated in my hotspot business", href: "#experience" },
  ];

  return (
    <div className="relative z-10 -mt-12 px-5 md:px-8">
      <ul className="mx-auto grid w-full max-w-[var(--max-width)] grid-cols-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)] lg:grid-cols-4">
        {stats.map((stat) => (
          <li
            key={stat.label}
            className="border-[var(--border)] px-5 py-5 [&:not(:last-child)]:border-b sm:px-7 lg:border-b-0 lg:[&:not(:last-child)]:border-r"
          >
            <p className="text-3xl font-bold tracking-tight text-[var(--text)]">
              {stat.href ? <a href={stat.href} className="hover:text-[var(--accent)]">{stat.value}</a> : stat.value}
            </p>
            <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{stat.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
