import { ProductPreview } from "@/components/case-study/product-preview";
import type { ProjectWalkthrough } from "@/lib/portfolio-types";

type ProductWalkthroughProps = {
  walkthrough?: ProjectWalkthrough;
};

export function ProductWalkthrough({ walkthrough }: ProductWalkthroughProps) {
  if (!walkthrough || walkthrough.items.length === 0) return null;

  return (
    <section aria-labelledby="walkthrough-heading">
      <div className="max-w-2xl">
        <h2
          id="walkthrough-heading"
          className="text-xl font-medium tracking-tight text-[var(--text)] sm:text-2xl"
        >
          {walkthrough.heading}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          {walkthrough.intro}
        </p>
      </div>
      {walkthrough.items.map((item) => (
        <ProductPreview key={item.src} preview={item} showChrome={false} />
      ))}
    </section>
  );
}
