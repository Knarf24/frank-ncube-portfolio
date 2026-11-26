import { Hero } from "@/components/hero/hero";
import { HeroStats } from "@/components/hero/hero-stats";
import { SelectedWork } from "@/components/projects/selected-work";
import { AboutSection } from "@/components/sections/about-section";
import { EducationAchievements } from "@/components/sections/education-achievements";
import { ExperienceSection } from "@/components/sections/experience-section";
import { TechnicalToolkit } from "@/components/sections/technical-toolkit";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { Reveal } from "@/components/reveal";

// Order follows the menu: Home, About, Education, Experience, Projects, Contact.
export default function Home() {
  return (
    <>
      <main id="top" className="flex-1">
        <Hero />
        <HeroStats />
        <Reveal>
          <AboutSection />
        </Reveal>
        <Reveal>
          <EducationAchievements />
        </Reveal>
        <Reveal>
          <ExperienceSection />
        </Reveal>
        <Reveal>
          <SelectedWork />
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
