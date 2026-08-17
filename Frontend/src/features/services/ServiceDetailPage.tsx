import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Flame, Gauge, Settings2, Anchor, Droplet, ShieldCheck, Lock, PackageSearch, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useGetServiceBySlugQuery } from "./api/servicesApi";

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

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useGetServiceBySlugQuery(slug ?? "", { skip: !slug });

  if (isLoading) {
    return (
      <Container className="py-24">
        <p className="text-sm text-ink-soft">Loading…</p>
      </Container>
    );
  }

  if (isError || !service) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <p className="eyebrow text-gold-dark">Not Found</p>
        <h1 className="mt-3 text-2xl font-bold text-ink">We couldn't find that service</h1>
        <p className="mt-3 max-w-[46ch] text-ink-soft">
          It may have been renamed or is no longer offered. See the full list of services below.
        </p>
        <Link to="/services" className="mt-6 text-xs font-bold uppercase tracking-wide text-gold-dark">
          ← All Services
        </Link>
      </Container>
    );
  }

  const Icon = ICONS[service.icon] ?? Flame;

  return (
    <>
      <section className="border-b border-void-line bg-void py-16 md:py-20">
        <Container>
          <Reveal>
            <Link to="/services" className="text-xs font-bold uppercase tracking-wide text-void-soft hover:text-gold">
              ← All Services
            </Link>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-gold text-gold-ink">
                <Icon size={26} strokeWidth={1.75} />
              </span>
              <h1 className="text-3xl font-bold text-white md:text-4xl">{service.title}</h1>
            </div>
            <p className="mt-5 max-w-[65ch] text-void-soft">{service.summary}</p>
          </Reveal>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div>
          <p className="eyebrow text-gold-dark">Scope of Work</p>
          <StaggerGroup className="mt-6 space-y-3">
            {service.scope.map((item) => (
              <StaggerItem key={item} className="flex items-start gap-3 text-ink-soft">
                <CheckCircle2 className="mt-0.5 flex-none text-gold-dark" size={18} />
                {item}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>

        <div className="h-fit space-y-6">
          {service.imageUrl && (
            <div className="overflow-hidden rounded-2xl" style={{ aspectRatio: "4/3" }}>
              <img src={service.imageUrl} alt={service.title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="rounded-2xl border border-line bg-paper-raised p-7">
            <h2 className="text-lg font-bold text-ink">Need this for your operation?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Tell us about your requirement and our team will follow up with scope, lead time and pricing.
            </p>
            <Button href="/contact" variant="primary" className="mt-5">
              Contact Us
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
