// Labels for card images that are not product screenshots or that show local,
// synthetic-data runs. On screens 640px and wider the label overlays the top
// left corner of the image; below that it sits under the image so it never
// covers interface content.
export function ImageLabel({ caption }: { caption?: string }) {
  if (!caption) return null;

  return (
    <span className="absolute left-3 top-3 hidden max-w-[calc(100%-1.5rem)] rounded-full bg-[color:rgba(12,11,9,0.82)] px-2.5 py-1 text-xs text-[var(--text)] sm:block">
      {caption}
    </span>
  );
}

export function ImageCaption({ caption }: { caption?: string }) {
  if (!caption) return null;

  return (
    <p className="mt-2 text-xs leading-5 text-[var(--muted)] sm:hidden">
      {caption}
    </p>
  );
}
