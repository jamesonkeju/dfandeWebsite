import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, X, ZoomIn, Award, Download, FileText, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useContent } from "@/features/content/hooks/useContent";

type CertItem = {
  code: string;
  label: string;
  description: string;
  documentSlug?: string;
  image?: string;
};

const TRUST_STATS = [
  { value: "3", label: "ISO Standards Certified" },
  { value: "3", label: "NCDMB Category 1 NCECs" },
  { value: "2003", label: "Operating Since" },
  { value: "4", label: "API Standards Aligned" },
];

export function CertificationsPage() {
  const { getText, getList, getJson } = useContent();
  const [lightbox, setLightbox] = useState<{ src: string; caption: string } | null>(null);

  const certItems = getJson<CertItem[]>("certifications.items", [
    {
      code: "ISO 9001:2015",
      label: "Quality Management System",
      description: "Certified standard for quality management systems ensuring consistent high-precision engineering and customer satisfaction.",
      documentSlug: "iso-9001-certificate",
      image: "/images/cert-iso-9001.png",
    },
    {
      code: "ISO 14001:2015",
      label: "Environmental Management System",
      description: "Certified framework for reducing environmental footprint and maintaining sustainable operations across all workshops and sites.",
      documentSlug: "iso-14001-certificate",
      image: "/images/cert-iso-14001.png",
    },
    {
      code: "ISO 45001:2018",
      label: "Occupational Health & Safety",
      description: "Certified occupational health and safety management system ensuring zero-harm operations and personnel wellbeing.",
      documentSlug: "iso-45001-certificate",
      image: "/images/cert-iso-45001.png",
    },
  ]);

  const ncecItems = [
    {
      code: "NCEC - Wellhead & Xmas Tree",
      label: "Fabrication & In-Country Assemblage",
      description: "NCDMB Category 1 Nigerian Content Equipment Certificate for local assemblage, testing, and maintenance of wellhead & Xmas tree equipment.",
      image: "/images/cert-ncec-wellhead.png",
    },
    {
      code: "NCEC - Actuators & Valves",
      label: "Valve Automation & Actuator Services",
      description: "NCDMB Category 1 Nigerian Content Equipment Certificate for choke valve overhauls, pneumatic/hydraulic actuation, and calibration.",
      image: "/images/cert-ncec-actuators.png",
    },
  ];

  const standards = getList("certifications.standards");
  const activeStandards = standards.length > 0 ? standards : [
    "API SPEC Q2 (Quality Management for Service Supply)",
    "API-6A (Wellhead & Tree Equipment)",
    "API-6D (Pipeline & Piping Valves)",
    "API-17D (Subsea Wellhead & Tree Equipment)",
  ];

  const hseHeadline = getText("certifications.hsePolicy.headline", "Health, Safety & Environment Policy");
  const hseBody = getText(
    "certifications.hsePolicy.body",
    "Divine Flame and Energy International Limited is committed to conducting all business operations with utmost respect for human health, safety, and environmental conservation. Our Goal is Zero Accidents, Zero Harm to People, and Zero Damage to the Environment.",
  );
  const hseSlug = getText("certifications.hsePolicy.documentSlug", "hse-policy-statement");

  const qualityHeadline = getText("certifications.qualityPolicy.headline", "Corporate Quality Policy");
  const qualityBody = getText(
    "certifications.qualityPolicy.body",
    "DF&E delivers engineering excellence and procurement precision that consistently meet or exceed international regulatory standards and client specifications through continual improvement of our ISO 9001:2015 quality management system.",
  );
  const qualitySlug = getText("certifications.qualityPolicy.documentSlug", "quality-policy-statement");

  return (
    <>
      <PageHeader
        eyebrow="HSE & Quality Governance"
        title="Certified Engineering Discipline"
        description="Operations run on proven international standards — independently verified under ISO 9001, ISO 14001, and ISO 45001 management systems, NCDMB Category 1 accreditations, and aligned to API-6A, API-6D and API SPEC Q2 specifications."
      />

      {/* ========================================================================= */}
      {/* 1. ISO MANAGEMENT SYSTEM CERTIFICATIONS */}
      {/* ========================================================================= */}
      <Container id="iso" className="scroll-mt-24 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-line pb-8">
          <Reveal>
            <p className="eyebrow text-gold-dark">ISO Certifications</p>
            <h2 className="mt-2 max-w-[36ch] text-2xl font-bold text-ink md:text-3xl">
              Independently Audited, <span className="text-gold-dark">Third-Party Verified</span>
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
          {certItems.map((cert, index) => {
            const certImage =
              cert.image ||
              (index === 0
                ? "/images/cert-iso-9001.png"
                : index === 1
                ? "/images/cert-iso-14001.png"
                : "/images/cert-iso-45001.png");

            return (
              <StaggerItem
                key={cert.code}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover:border-gold-dark transition-all"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: certImage, caption: `${cert.code} — ${cert.label}` })}
                    className="relative block aspect-[3/4] w-full overflow-hidden border-b border-line bg-paper-raised cursor-pointer"
                  >
                    <img
                      src={certImage}
                      alt={`${cert.code} certificate issued to Divine Flame and Energy International Limited`}
                      className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
                      <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <ZoomIn size={14} />
                        View Certificate
                      </span>
                    </div>
                  </button>

                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 flex-none text-gold-dark" size={20} />
                      <div>
                        <div className="text-base font-bold text-ink">{cert.code}</div>
                        <div className="text-xs font-semibold text-steel uppercase tracking-wider">{cert.label}</div>
                      </div>
                    </div>
                    {cert.description && (
                      <p className="mt-3 text-xs text-ink-soft leading-relaxed">{cert.description}</p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-line/60 mt-auto">
                  <a
                    href={`/api/documents/${cert.documentSlug || "iso-9001-certificate"}/download`}
                    className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl border border-line bg-paper-raised px-4 py-2 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark transition-colors"
                  >
                    <Download size={13} />
                    <span>Download Certificate (PDF)</span>
                  </a>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        {/* ========================================================================= */}
        {/* 2. NCDMB CATEGORY 1 NCEC ACCREDITATIONS */}
        {/* ========================================================================= */}
        <div className="mt-16 pt-12 border-t border-line">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
              <Award size={16} />
              <span>Nigerian Content Development &amp; Monitoring Board</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-ink">NCDMB Category 1 NCEC Accreditations</h3>
            <p className="mt-2 text-xs text-ink-soft leading-relaxed">
              Certified under the Nigerian Oil &amp; Gas Industry Content Development (NOGICD) Act for in-country equipment fabrication, local assembly, and valve automation.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {ncecItems.map((ncec) => (
              <div
                key={ncec.code}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover:border-gold-dark transition-all"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setLightbox({ src: ncec.image, caption: `${ncec.code} — ${ncec.label}` })}
                    className="relative block aspect-[16/10] w-full overflow-hidden border-b border-line bg-paper-raised cursor-pointer"
                  >
                    <img
                      src={ncec.image}
                      alt={ncec.code}
                      className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
                      <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                        <ZoomIn size={14} />
                        View Certificate
                      </span>
                    </div>
                  </button>

                  <div className="p-6">
                    <div className="text-base font-bold text-ink">{ncec.code}</div>
                    <div className="text-xs font-semibold text-gold-dark uppercase tracking-wider">{ncec.label}</div>
                    <p className="mt-2.5 text-xs text-ink-soft leading-relaxed">{ncec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API STANDARDS CALLOUT */}
        <div className="mt-14 rounded-2xl border border-line bg-paper-raised p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink">
            <Award size={16} className="text-gold-dark" />
            <span>Aligned API Engineering Specifications:</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeStandards.map((std) => (
              <span
                key={std}
                className="rounded-full bg-white border border-line px-3.5 py-1 text-xs font-medium text-ink-soft"
              >
                {std}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* ========================================================================= */}
      {/* 3. HSE POLICY SECTION */}
      {/* ========================================================================= */}
      <section id="hse-policy" className="scroll-mt-24 bg-paper-raised py-16 md:py-20 border-t border-line">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
              <FileText size={15} />
              <span>Safety Governance</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{hseHeadline}</h2>
            <p className="mt-4 text-ink-soft leading-relaxed text-sm">{hseBody}</p>
            <div className="mt-6">
              <a
                href={`/api/documents/${hseSlug}/download`}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gold-ink shadow-sm hover:bg-gold-light transition-all"
              >
                <Download size={14} />
                <span>Download Signed HSE Policy (PDF)</span>
              </a>
            </div>
          </Reveal>
          <Reveal>
            <button
              type="button"
              onClick={() =>
                setLightbox({ src: "/images/hse-policy.png", caption: "DF&E Signed HSE Policy Statement" })
              }
              className="group relative block w-full overflow-hidden rounded-2xl border border-line shadow-sm bg-white cursor-pointer"
            >
              <img src="/images/hse-policy.png" alt="DF&E HSE Policy Statement" className="w-full" />
              <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
                <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <ZoomIn size={14} />
                  View Full Document
                </span>
              </div>
            </button>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 4. QUALITY POLICY SECTION */}
      {/* ========================================================================= */}
      <section id="quality-policy" className="scroll-mt-24 py-16 md:py-20 border-t border-line bg-white">
        <Container className="grid items-center gap-12 md:grid-cols-2">
          <Reveal className="md:order-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
              <CheckCircle size={15} />
              <span>Quality Assurance</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{qualityHeadline}</h2>
            <p className="mt-4 text-ink-soft leading-relaxed text-sm">{qualityBody}</p>
            <div className="mt-6">
              <a
                href={`/api/documents/${qualitySlug}/download`}
                className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-gold-ink shadow-sm hover:bg-gold-light transition-all"
              >
                <Download size={14} />
                <span>Download Signed Quality Policy (PDF)</span>
              </a>
            </div>
          </Reveal>
          <Reveal className="md:order-1">
            <button
              type="button"
              onClick={() =>
                setLightbox({
                  src: "/images/quality-policy.png",
                  caption: "DF&E Signed Quality Policy Statement",
                })
              }
              className="group relative block w-full overflow-hidden rounded-2xl border border-line shadow-sm bg-white cursor-pointer"
            >
              <img src="/images/quality-policy.png" alt="DF&E Quality Policy Statement" className="w-full" />
              <div className="absolute inset-0 flex items-center justify-center bg-void/0 transition-colors group-hover:bg-void/40">
                <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  <ZoomIn size={14} />
                  View Full Document
                </span>
              </div>
            </button>
          </Reveal>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 5. LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-void/95 p-4 md:p-10 backdrop-blur-xs"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white hover:border-gold hover:text-gold cursor-pointer"
            >
              <X size={20} />
            </button>
            <motion.figure
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full max-w-3xl flex-col items-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.caption}
                className="max-h-[80vh] w-auto rounded-xl object-contain bg-white p-2 shadow-2xl border border-line"
              />
              <figcaption className="mt-4 text-center text-sm font-semibold text-white tracking-wide">
                {lightbox.caption}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
