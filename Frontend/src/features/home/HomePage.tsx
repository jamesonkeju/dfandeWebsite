import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { WhyDfande } from "@/components/sections/WhyDfande";
import { Facility } from "@/components/sections/Facility";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { CertificationsStrip } from "@/components/sections/CertificationsStrip";
import { Partners } from "@/components/sections/Partners";
import { CtaBand } from "@/components/sections/CtaBand";

import { SEOHead } from "@/components/common/SEOHead";

export function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Divine Flame and Energy International Limited",
    "alternateName": "DFANDE",
    "url": "https://dfande.com",
    "logo": "https://dfande.com/images/logo.png",
    "description": "Indigenous Nigerian oil and gas servicing company specializing in Wellhead & Xmas Tree maintenance, Subsea Choke Valves, Wellhead Control Panels (WHCP), and OCTG procurement.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Port Harcourt",
      "addressRegion": "Rivers State",
      "addressCountry": "NG"
    },
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "name": "ISO 9001:2015 Quality Management System" },
      { "@type": "EducationalOccupationalCredential", "name": "ISO 14001:2015 Environmental Management System" },
      { "@type": "EducationalOccupationalCredential", "name": "ISO 45001:2018 Occupational Health & Safety" }
    ],
    "sameAs": [
      "https://www.linkedin.com/company/divine-flame-and-energy-international-limited"
    ]
  };

  return (
    <>
      <SEOHead
        title="Wellhead & Xmas Tree Maintenance, Choke Valves & WHCP"
        description="Divine Flame and Energy International (DFANDE) is Nigeria's trusted engineering partner for Wellhead & Xmas Tree maintenance, Subsea Choke Valve overhaul, WHCP engineering, and ISO-certified valve testing."
        canonicalUrl="/"
        structuredData={structuredData}
      />
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
