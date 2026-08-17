import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Flame,
  Gauge,
  Settings2,
  Anchor,
  Droplet,
  ShieldCheck,
  Lock,
  PackageSearch,
  Image,
  Shield,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useGetServiceBySlugQuery } from "./api/servicesApi";
import { useContent } from "@/features/content/hooks/useContent";
import { SERVICE_GALLERIES } from "./data/serviceMedia";

const ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  gauge: Gauge,
  settings: Settings2,
  anchor: Anchor,
  droplet: Droplet,
  shield: ShieldCheck,
  lock: Lock,
  package: PackageSearch,
};

type CaseStudyItem = {
  client: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  scope: string;
};

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useGetServiceBySlugQuery(slug ?? "", { skip: !slug });
  const { getJson } = useContent();

  const gallery = slug && SERVICE_GALLERIES[slug] ? SERVICE_GALLERIES[slug] : [];

  const caseStudies = getJson<CaseStudyItem[]>("services.preservation.caseStudies", [
    {
      client: "ExxonMobil Nigeria",
      title: "Preservation of Outdoor & Sheltered Stored Equipment (Onne Shorebase & USAN)",
      beforeImage: "/images/preservation-exxon-before.jpg",
      afterImage: "/images/preservation-exxon-after.jpg",
      scope: "Visual inspection, de-rusting, buffing, greasing, and application of Guardian protective barrier solution.",
    },
    {
      client: "ExxonMobil Malaysia",
      title: "Preservation of Xmas Tree Equipment & Halliburton Screens",
      beforeImage: "/images/preservation-xmas-before.jpg",
      afterImage: "/images/preservation-xmas-after.jpg",
      scope: "Full strip-down buffing and climate barrier preservation of complex completion screens.",
    },
    {
      client: "EOG Resources",
      title: "Preservation of Wellhead Running Tools & High-Pressure Assemblies",
      beforeImage: "/images/preservation-tools-before.jpg",
      afterImage: "/images/preservation-tools-after.jpg",
      scope: "Application of heavy-duty 22oz vinyl custom straps and jackets for 10+ year atmospheric protection.",
    },
  ]);

  if (isLoading) {
    return (
      <Container className="py-24 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gold-dark border-t-transparent" />
        <p className="mt-3 text-sm text-ink-soft">Loading technical service details…</p>
      </Container>
    );
  }

  if (isError || !service) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <p className="eyebrow text-gold-dark">Service Not Found</p>
        <h1 className="mt-3 text-2xl font-bold text-ink">We couldn't find that service</h1>
        <p className="mt-3 max-w-[46ch] text-ink-soft">
          The requested service capability may have been updated. See the full list of services below.
        </p>
        <Link to="/services" className="mt-6 text-xs font-bold uppercase tracking-wide text-gold-dark hover:underline">
          ← Back to All Services
        </Link>
      </Container>
    );
  }

  const Icon = ICONS[service.icon] ?? Flame;
  const isPreservation = slug === "equipment-preservation";

  return (
    <>
      {/* SERVICE HERO BANNER */}
      <section className="border-b border-void-line bg-void py-16 md:py-20">
        <Container>
          <Reveal>
            <Link
              to="/services"
              className="text-xs font-bold uppercase tracking-wide text-void-soft hover:text-gold transition-colors"
            >
              ← All Services
            </Link>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gold text-gold-ink shadow-md">
                <Icon size={26} strokeWidth={1.75} />
              </span>
              <div>
                <h1 className="text-3xl font-bold text-white md:text-4xl">{service.title}</h1>
                <span className="text-xs uppercase tracking-widest text-gold-dark font-semibold">
                  ISO 9001 · API Aligned Delivery
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-[65ch] text-void-soft leading-relaxed text-base">{service.summary}</p>
          </Reveal>
        </Container>
      </section>

      {/* SCOPE & CALLOUT CONTENT */}
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark">
            <Layers size={15} />
            <span>Operational Capabilities</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-ink">Comprehensive Scope of Work</h2>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            All operations are planned, risk-assessed, and executed in accordance with OEM specifications and international safety management procedures.
          </p>

          <StaggerGroup className="mt-8 space-y-3.5">
            {service.scope.map((item) => (
              <StaggerItem
                key={item}
                className="flex items-start gap-3 rounded-xl border border-line bg-paper-raised p-4 text-ink-soft transition-colors hover:border-gold-dark hover:text-ink"
              >
                <CheckCircle2 className="mt-0.5 flex-none text-gold-dark" size={18} />
                <span className="text-sm font-medium">{item}</span>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div className="h-fit space-y-6">
          {service.imageUrl && (
            <div className="overflow-hidden rounded-2xl border border-line shadow-sm" style={{ aspectRatio: "4/3" }}>
              <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="rounded-2xl border border-line bg-white p-7 shadow-sm">
            <h3 className="text-lg font-bold text-ink">Deploy DF&amp;E for Your Next Campaign</h3>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              Contact our technical team for custom work scopes, tooling availability, and mobilization timelines.
            </p>
            <Button href="/contact" variant="primary" className="mt-5 w-full justify-center">
              Request Technical Proposal
            </Button>
          </div>
        </div>
      </Container>

      {/* OPERATIONAL FIELD & WORKSHOP PHOTO GALLERY */}
      {gallery.length > 0 && (
        <section className="bg-paper py-16 md:py-20 border-t border-line">
          <Container>
            <div className="max-w-3xl mb-10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
                <Image size={16} />
                <span>Operational Visuals</span>
              </div>
              <h2 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">
                Workshop &amp; Field Execution Gallery
              </h2>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">
                Photographic records of in-country assemblage, inspection, hydrostatic testing, and field deployment for {service.title}.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {gallery.map((photo, idx) => (
                <div
                  key={photo.url + idx}
                  className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover:border-gold-dark hover:shadow-md transition-all"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-void/80 relative">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-void/80 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold shadow-sm backdrop-blur-xs">
                      {photo.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="text-xs font-bold text-ink group-hover:text-gold-dark transition-colors line-clamp-2">
                      {photo.caption}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* PRESERVATION CASE STUDIES COMPARATIVE SECTION (FROM PPTX) */}
      {isPreservation && (
        <section className="bg-paper-raised py-16 md:py-20 border-t border-line">
          <Container>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark">
                <Shield size={16} />
                <span>Field Case Studies</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">
                Before &amp; After Field Preservation Results
              </h2>
              <p className="mt-3 text-ink-soft leading-relaxed">
                Proven results protecting high-value wellheads, Xmas trees, and riser equipment across Nigerian and international shorebases with 10+ year barrier longevity.
              </p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {caseStudies.map((study, idx) => (
                <div
                  key={study.client + idx}
                  className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm hover:border-gold-dark transition-all"
                >
                  <div className="grid grid-cols-2 gap-1 bg-paper p-1">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-steel/10">
                      <img
                        src={study.beforeImage}
                        alt={`Before preservation - ${study.title}`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 rounded bg-danger px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow">
                        Before
                      </span>
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-steel/10">
                      <img
                        src={study.afterImage}
                        alt={`After preservation - ${study.title}`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 rounded bg-verify px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow">
                        After
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gold-dark">{study.client}</span>
                    <h3 className="mt-1 text-base font-bold text-ink">{study.title}</h3>
                    <p className="mt-2 text-xs text-ink-soft leading-relaxed">{study.scope}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Benefits Grid */}
            <div className="mt-12 rounded-2xl border border-line bg-white p-8 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-4">Key Benefits of DF&amp;E Preservation Solutions:</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs text-ink-soft">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold-dark flex-none" />
                  <span>Extended storage period (10+ years permanent barrier)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold-dark flex-none" />
                  <span>Safe on elastomers, plastics, and rubber seals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold-dark flex-none" />
                  <span>Removes moisture, humidity &amp; atmospheric salt</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold-dark flex-none" />
                  <span>Substantial cost savings vs replacement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold-dark flex-none" />
                  <span>Re-usable custom-tailored jackets &amp; straps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold-dark flex-none" />
                  <span>Proven with ExxonMobil, EOG, and Chevron</span>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
