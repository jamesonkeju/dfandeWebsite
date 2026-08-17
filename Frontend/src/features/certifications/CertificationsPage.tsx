import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, X, ZoomIn, Award } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { certifications, standards } from "@/data/mock/certifications";

const TRUST_STATS = [
  { value: "3", label: "ISO Standards" },
  { value: "2019", label: "Certified Since" },
  { value: "4", label: "API Standards Aligned" },
];

export function CertificationsPage() {
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);

  return (
    <>
      <PageHeader
        eyebrow="HSE & Quality"
        title="Certified Discipline"
        description="Operations run on proven industry practice, aligned to ISO management systems and API engineering standards."
      />

      <Container id="iso" className="scroll-mt-24 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-line pb-8">
          <Reveal>
            <p className="eyebrow text-gold-dark">ISO Certifications</p>
            <h2 className="mt-3 max-w-[36ch] text-2xl font-bold text-ink md:text-3xl">
              Independently Audited, <span className="highlight">Third-Party Verified</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-8">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-2xl font-bold text-gold-dark">{stat.value}</div>
                <div className="text-xs font-bold uppercase tracking-wide text-steel">{stat.label}</div>
              </div>
            ))}
          </Reveal>
        </div>

        <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
          {certifications.map((cert) => (
            <StaggerItem key={cert.code} className="group overflow-hidden rounded-2xl border border-line bg-white">
              {cert.image ? (
                <button
                  type="button"
                  onClick={() => setLightbox({ src: cert.image!, caption: `${cert.code} — ${cert.label}` })}
                  className="relative block aspect-[3/4] w-full overflow-hidden border-b border-line bg-paper"
                >
                  <img
                    src={cert.image}
                    alt={`${cert.code} certificate issued to Divine Flame and Energy International Limited`}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
                    <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      <ZoomIn size={14} />
                      View Certificate
                    </span>
                  </div>
                </button>
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center border-b border-line bg-paper">
                  <Award className="text-line" size={56} strokeWidth={1} />
                </div>
              )}
              <div className="flex items-start gap-3 p-6">
                <ShieldCheck className="mt-0.5 flex-none text-verify" size={20} />
                <div>
                  <div className="text-sm font-bold text-ink">{cert.code}</div>
                  <div className="text-sm text-steel">{cert.label}</div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <p className="mt-8 text-xs font-bold uppercase tracking-wide text-steel">
          Also aligned to {standards.join(" · ")}
        </p>
      </Container>

      <section className="bg-paper-raised py-16 md:py-20">
        <Container id="hse-policy" className="scroll-mt-24 grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow text-gold-dark">Policy Document</p>
            <h2 className="mt-3 text-2xl font-bold text-ink">HSE Policy</h2>
            <p className="mt-4 text-ink-soft">
              DF&amp;E&rsquo;s Health, Safety &amp; Environment Policy Statement — signed and in effect across all
              field service and workshop operations.
            </p>
          </Reveal>
          <Reveal>
            <button
              type="button"
              onClick={() => setLightbox({ src: "/images/hse-policy.png", caption: "HSE Policy Statement" })}
              className="group relative block w-full overflow-hidden rounded-2xl border border-line"
            >
              <img src="/images/hse-policy.png" alt="DF&E HSE Policy Statement" className="w-full" />
              <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
                <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <ZoomIn size={14} />
                  View Full Size
                </span>
              </div>
            </button>
          </Reveal>
        </Container>
      </section>

      <Container id="quality-policy" className="scroll-mt-24 grid items-center gap-12 py-16 md:grid-cols-2 md:py-20">
        <Reveal className="md:order-2">
          <p className="eyebrow text-gold-dark">Policy Document</p>
          <h2 className="mt-3 text-2xl font-bold text-ink">Quality Policy</h2>
          <p className="mt-4 text-ink-soft">
            DF&amp;E&rsquo;s Quality Policy Statement — the basis for our ISO 9001:2015 quality management system.
          </p>
        </Reveal>
        <Reveal className="md:order-1">
          <button
            type="button"
            onClick={() => setLightbox({ src: "/images/quality-policy.png", caption: "Quality Policy Statement" })}
            className="group relative block w-full overflow-hidden rounded-2xl border border-line"
          >
            <img src="/images/quality-policy.png" alt="DF&E Quality Policy Statement" className="w-full" />
            <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                <ZoomIn size={14} />
                View Full Size
              </span>
            </div>
          </button>
        </Reveal>
      </Container>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/95 p-4 md:p-10"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white hover:border-gold hover:text-gold"
            >
              <X size={20} />
            </button>
            <motion.figure
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full max-w-2xl flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.src} alt={lightbox.caption} className="max-h-[80vh] rounded-lg object-contain" />
              <figcaption className="mt-4 text-center text-sm text-void-soft">{lightbox.caption}</figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
