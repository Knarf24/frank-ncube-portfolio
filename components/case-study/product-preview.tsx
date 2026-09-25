import Image from "next/image";
import type { ProjectPreview } from "@/lib/portfolio-types";

type ProductPreviewProps = {
  preview?: ProjectPreview;
  // Decorative window dots above the image. Turn off for screenshots that
  // already show a complete application interface.
  showChrome?: boolean;
};

export function ProductPreview({
  preview,
  showChrome = true,
}: ProductPreviewProps) {
  if (!preview) return null;

  return (
    <figure className="mt-8 sm:mt-10">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {showChrome ? (
          <div
            aria-hidden="true"
            className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--border)]" />
          </div>
        ) : null}
        <Image
          src={preview.src}
          alt={preview.alt}
          width={preview.width}
          height={preview.height}
          sizes="(min-width: 1280px) 1180px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
          // Interface screenshots are text-heavy lossless WebP files, so they are
          // served as-is instead of being re-encoded lossy by the image optimizer.
          unoptimized
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {preview.caption}
      </figcaption>
    </figure>
  );
}
