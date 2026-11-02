import Image from "next/image";
import { Play } from "lucide-react";
import type { ProjectVideo } from "@/lib/portfolio-types";

// A poster that links out to YouTube. No iframe, no autoplay and no
// third-party request until the visitor chooses to follow the link.
export function VideoLink({ video }: { video?: ProjectVideo }) {
  if (!video) return null;

  return (
    <figure className="mt-8 sm:mt-10">
      <a
        href={video.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${video.label} (opens in a new tab)`}
        className="group relative block overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <Image
          src={video.poster.src}
          alt=""
          width={video.poster.width}
          height={video.poster.height}
          sizes="(min-width: 1280px) 1180px, 92vw"
          className="aspect-[16/8] h-auto w-full object-cover object-top opacity-70 transition-opacity duration-300 group-hover:opacity-90"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--background)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] transition-transform duration-300 motion-safe:group-hover:scale-105">
            <Play aria-hidden="true" className="h-4 w-4 fill-current" />
            {video.label}
          </span>
        </span>
      </a>
      <figcaption className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {video.poster.caption}
      </figcaption>
    </figure>
  );
}
