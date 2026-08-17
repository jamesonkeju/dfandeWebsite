import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { CounterUp } from "@/components/motion/CounterUp";
import { imageReveal } from "@/lib/motion/variants";
import { company } from "@/data/mock/company";

const points = [
  "ISO 9001:2015 & ISO 14001:2015 certified",
  "Local assemblage of wellhead & Xmas tree equipment",
  "24/7 field-ready technical support",
  "Port Harcourt field service & warehousing facility",
];

export function About() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <Reveal variant={imageReveal} className="aspect-[3/4] overflow-hidden rounded-2xl">
          <img
            src="/images/about-crane-lift.png"
            alt="Overhead crane lifting a wellhead assembly at the DF&E Port Harcourt workshop"
            className="h-full w-full object-cover"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow text-gold-dark">Who We Are</p>
            <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
              Engineering Discipline, <span className="highlight">Local Delivery</span>
            </h2>
            <p className="mt-5 text-ink-soft">{company.about}</p>
          </Reveal>

          <StaggerGroup className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <StaggerItem key={point} className="flex items-start gap-2.5 text-sm text-ink-soft">
                <CheckCircle2 className="mt-0.5 flex-none text-gold-dark" size={18} />
                {point}
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-8 flex flex-wrap items-center gap-8" delay={0.2}>
            <div>
              <CounterUp value={company.founded} isYear className="block text-3xl font-bold text-gold-dark" />
              <span className="text-xs font-bold uppercase tracking-wide text-steel">Founded</span>
            </div>
            <Button href="/services" variant="secondary">
              Discover Our Services
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
