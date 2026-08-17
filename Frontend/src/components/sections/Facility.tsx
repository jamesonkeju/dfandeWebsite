import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { imageReveal } from "@/lib/motion/variants";
import { company } from "@/data/mock/company";

export function Facility() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow text-gold-dark">Port Harcourt Facility</p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">Field Service Facility</h2>
          <p className="mt-4 text-ink-soft">
            A fully operational field service &amp; warehousing facility, equipped for local
            assemblage, testing and repair.
          </p>

          <StaggerGroup className="mt-8 space-y-3">
            {company.facility.capabilities.map((cap) => (
              <StaggerItem key={cap} className="flex gap-3 text-sm text-ink-soft">
                <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-gold-dark" />
                {cap}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>

        <Reveal variant={imageReveal} className="aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src="/images/facility-valve-work.png"
            alt="DF&E technicians servicing an actuator on the workshop bench"
            className="h-full w-full object-cover"
          />
        </Reveal>
      </Container>
    </section>
  );
}
