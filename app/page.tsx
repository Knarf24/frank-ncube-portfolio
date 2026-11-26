import { Hero } from "@/components/hero/hero";
import { SelectedWork } from "@/components/projects/selected-work";
import { AboutExperience } from "@/components/sections/about-experience";
import { EducationAchievements } from "@/components/sections/education-achievements";
import { TechnicalToolkit } from "@/components/sections/technical-toolkit";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { Reveal } from "@/components/reveal";
import { HubApps } from "@/components/sections/hub-apps";
import { HeroStats } from "@/components/hero/hero-stats";

export default function Home() {
  return (
    <>
      <main id="top" className="flex-1">
        <Hero />
        <HeroStats />
        <Reveal>
          <SelectedWork />
        </Reveal>
        <Reveal>
          <HubApps />
        </Reveal>
        <Reveal>
          <AboutExperience />
        </Reveal>
        <Reveal>
          <EducationAchievements />
        </Reveal>
        <Reveal>
          <TechnicalToolkit />
        </Reveal>
        <Reveal>
          <ContactSection />
        </Reveal>
      </main>

      <SiteFooter />
    </>
  );
}
