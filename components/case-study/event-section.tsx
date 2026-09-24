import Image from "next/image";
import type { ProjectEvent } from "@/lib/portfolio-types";

type EventSectionProps = {
  event?: ProjectEvent;
};

export function EventSection({ event }: EventSectionProps) {
  if (!event) return null;

  const { banner, team } = event;

  return (
    <section aria-labelledby="event-heading">
      <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="relative aspect-[5/4] sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src={banner.src}
            alt={banner.alt}
            fill
            sizes="(min-width: 1280px) 1180px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
            className="object-cover"
            style={{ objectPosition: banner.objectPosition }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,11,10,0.94)_0%,rgba(9,11,10,0.62)_28%,rgba(9,11,10,0.1)_62%,transparent_100%)]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <h2
              id="event-heading"
              className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl lg:text-3xl"
            >
              {event.title}
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent)]">
              {event.subtitle}
            </p>
          </figcaption>
        </div>
      </figure>

      <figure className="mx-auto mt-6 max-w-[16rem] md:mt-8 md:max-w-[18rem]">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <Image
            src={team.src}
            alt={team.alt}
            width={team.width}
            height={team.height}
            sizes="(min-width: 768px) 288px, 256px"
            className="h-auto w-full"
          />
        </div>
        <figcaption className="mt-3 text-balance text-center text-sm leading-6 text-[var(--muted)]">
          {team.caption}
        </figcaption>
      </figure>
    </section>
  );
}
