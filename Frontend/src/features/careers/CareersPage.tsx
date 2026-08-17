import { Wrench, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { Reveal } from "@/components/motion/Reveal";
import { company } from "@/data/mock/company";

const values = [
  {
    icon: Wrench,
    title: "Hands-On Engineering",
    body: "Field service personnel work directly on wellhead, Xmas tree and choke valve equipment — local assemblage, not just installation.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-First Culture",
    body: "Every role operates under ISO 9001, ISO 14001 and ISO 45001 management systems — discipline is part of the job, not an afterthought.",
  },
  {
    icon: Users,
    title: "24/7 Field Readiness",
    body: `A team of ${company.personnelCount}+ highly competent personnel, ready for onshore and offshore deployment.`,
  },
];

export function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build Your Career With DF&E"
        description="We're a Nigerian-owned oil & gas servicing company built on local engineering capability — and we're always interested in hearing from people who share that."
      />

      <Container className="py-16 md:py-20">
        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <StaggerItem key={v.title} className="rounded-2xl border border-line p-7">
              <v.icon className="text-gold-dark" size={26} strokeWidth={1.75} />
              <h2 className="mt-4 text-lg font-bold text-ink">{v.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{v.body}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>

      <section className="bg-void py-16 md:py-20">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <p className="eyebrow text-gold">Current Openings</p>
            <h2 className="mt-3 max-w-[36ch] text-2xl font-bold text-white md:text-3xl">
              No open positions listed right now
            </h2>
            <p className="mt-4 max-w-[55ch] text-void-soft">
              We don't have active vacancies posted at the moment, but we're always interested in hearing from
              qualified wellhead engineers, technicians and procurement specialists. Send us your CV and we'll
              keep it on file for when a relevant role opens up.
            </p>
            <Button href="mailto:info@dfande.com" variant="primary" className="mt-6">
              Email Your CV
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
