import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { certifications, standards } from "@/data/mock/certifications";

export function CertificationsStrip() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="max-w-[60ch]">
          <p className="eyebrow text-gold-dark">HSE &amp; Quality</p>
          <h2 className="mt-3 text-3xl font-bold text-ink md:text-4xl">Certified Discipline</h2>
          <p className="mt-4 text-ink-soft">
            Operations run on proven industry practice, aligned to ISO management systems and API
            engineering standards.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-12 items-center">
          <StaggerGroup className="grid gap-4 sm:grid-cols-3 md:col-span-8">
            {certifications.map((cert) => (
              <StaggerItem key={cert.code} className="flex items-start gap-3 rounded-xl border border-line p-6 bg-white shadow-xs">
                <ShieldCheck className="mt-0.5 flex-none text-verify" size={22} />
                <div>
                  <div className="text-sm font-bold text-ink">{cert.code}</div>
                  <div className="text-sm text-steel">{cert.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* Official ISO Accreditation Badges from Documents */}
          <div className="flex flex-row md:flex-col items-center justify-center gap-4 rounded-xl border border-line bg-paper-raised p-4 md:col-span-4 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-steel font-mono">Official Accreditations</span>
            <div className="flex items-center gap-3">
              <img
                src="/images/iso1.png"
                alt="ISO 9001:2015 Certified - IGS ASCB UK"
                className="h-11 w-auto rounded border border-line bg-white p-1 shadow-xs"
              />
              <img
                src="/images/iso2.png"
                alt="ISO 14001:2015 Certified - IGS ASCB UK"
                className="h-11 w-auto rounded border border-line bg-white p-1 shadow-xs"
              />
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs uppercase tracking-wide text-steel">
          Also aligned to {standards.join(" · ")}
        </p>
      </Container>
    </section>
  );
}
