import { Wrench, Clock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { CounterUp } from "@/components/motion/CounterUp";
import { company } from "@/data/mock/company";

const features = [
  {
    icon: Wrench,
    title: "Local Assemblage Capability",
    body: "100% local assemblage of wellhead and Xmas tree equipment at our Port Harcourt facility.",
  },
  {
    icon: Clock,
    title: "24/7 Field-Ready Support",
    body: "Dedicated aftermarket support services, available around the clock for onshore and offshore deployment.",
  },
  {
    icon: ShieldCheck,
    title: "ISO-Certified Discipline",
    body: "Operations run on ISO 9001, ISO 14001 and ISO 45001 management systems, aligned to API-6A and API-6D.",
  },
];

export function WhyDfande() {
  return (
    <section className="bg-paper-raised py-20 md:py-28">
      <Container>
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-gold-dark">Why DF&amp;E</p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">
            Reliable Engineering. <span className="highlight">Proven Delivery.</span>
          </h2>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title} className="rounded-2xl border border-line p-7">
              <f.icon className="text-gold-dark" size={28} strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{f.body}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>

      <div className="mt-16 bg-void py-12">
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
      </div>
    </section>
  );
}
