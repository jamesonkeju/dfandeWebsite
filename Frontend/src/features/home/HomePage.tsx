import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { WhyDfande } from "@/components/sections/WhyDfande";
import { Facility } from "@/components/sections/Facility";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { CertificationsStrip } from "@/components/sections/CertificationsStrip";
import { Partners } from "@/components/sections/Partners";
import { CtaBand } from "@/components/sections/CtaBand";

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <WhyDfande />
      <Facility />
      <FeaturedProjects />
      <CertificationsStrip />
      <Partners />
      <CtaBand />
    </>
  );
}
