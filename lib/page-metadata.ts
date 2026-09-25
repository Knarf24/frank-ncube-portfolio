import type { Metadata, ResolvingMetadata } from "next";
import { siteConfig } from "@/lib/site-config";

// Per-page metadata. Relative paths resolve against metadataBase in the root layout.
// A page-level openGraph replaces the layout's, so it is rebuilt in full here. The
// generated Open Graph image (app/opengraph-image.tsx) is carried over from the
// parent so its existing URL is unchanged.
export async function pageMetadata(
  {
    title,
    description,
    path,
  }: {
    title: string;
    description: string;
    path: string;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const images = (await parent).openGraph?.images;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      ...(images ? { images } : {}),
    },
  };
}
