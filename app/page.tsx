import { Hero } from "@/components/hero/hero";
import { SelectedWork } from "@/components/projects/selected-work";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <main id="top" className="flex-1">
      <Hero />
      <Reveal>
        <SelectedWork />
      </Reveal>
    </main>
  );
}
