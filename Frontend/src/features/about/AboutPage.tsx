import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { CounterUp } from "@/components/motion/CounterUp";
import { imageReveal } from "@/lib/motion/variants";
import { CtaBand } from "@/components/sections/CtaBand";
import { Partners } from "@/components/sections/Partners";
import { company } from "@/data/mock/company";

export function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Engineering Discipline, Local Delivery"
        description="Divine Flame and Energy International Limited — a Nigerian-owned, ISO-certified oil & gas servicing company built around wellhead, Xmas tree and choke valve equipment."
      />

      <section className="py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal variant={imageReveal} className="aspect-[4/3] overflow-hidden rounded-2xl">
            <img
              src="/images/about-crane-lift.png"
              alt="Overhead crane lifting a wellhead assembly at the DF&E Port Harcourt workshop"
              className="h-full w-full object-cover"
            />
          </Reveal>

          <Reveal>
            <p className="eyebrow text-gold-dark">Who We Are</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Local Might, Global Reach</h2>
            <p className="mt-5 text-ink-soft">{company.about}</p>
            <p className="mt-4 text-ink-soft">{company.aboutExtended}</p>
          </Reveal>
        </Container>
      </section>

      <section className="bg-void py-16">
        <Container className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {company.stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <CounterUp
                value={stat.value}
                isYear={stat.isYear}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="block font-mono text-3xl font-bold text-gold md:text-4xl"
              />
              <div className="mt-1 text-sm uppercase tracking-wide text-void-soft">{stat.label}</div>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-paper-raised py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-gold-dark">Port Harcourt Facility</p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Field Service Facility</h2>
            <p className="mt-4 text-ink-soft">
              A fully operational field service &amp; warehousing facility, equipped for local assemblage,
              testing and repair — {company.facility.warehouseArea} of warehouse space including a{" "}
              {company.facility.warehouseNote}.
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

      <Partners />
      <CtaBand />
    </>
  );
}
