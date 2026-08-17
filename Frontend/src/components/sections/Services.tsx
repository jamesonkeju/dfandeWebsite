import { ArrowUpRight, Flame, Gauge, Settings2, Anchor, Droplet, ShieldCheck, Lock, PackageSearch, type LucideIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useGetPublishedServicesQuery } from "@/features/services/api/servicesApi";

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

export function Services() {
  // CMS-driven — see backend/src/DFANDE.Infrastructure/Persistence/ServiceSeeder.cs
  // for the real DFANDE content this was migrated from. Layout below is
  // unchanged from the approved landing page; only the data source moved
  // from a static mock file to the live API.
  const { data: services, isLoading } = useGetPublishedServicesQuery();

  if (isLoading || !services) {
    return null;
  }

  const featured = services.filter((s) => s.isFeatured);
  const rest = services.filter((s) => !s.isFeatured);

  return (
    <section className="bg-void py-20 md:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[56ch]">
            <p className="eyebrow text-gold">What We Do</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Engineering Solutions For <span className="highlight">Wellhead Reliability</span>
            </h2>
          </div>
          <Button href="/services" variant="primary">
            View All Services
          </Button>
        </div>
        <p className="mt-3 text-sm font-bold uppercase tracking-wide text-void-soft">
          Trusted by Shell &middot; Chevron &middot; ExxonMobil &middot; TotalEnergies &amp; more
        </p>

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((service) => {
            const Icon = ICONS[service.icon] ?? Flame;
            return (
              <StaggerItem key={service.slug}>
                <a
                  href={`/services/${service.slug}`}
                  className="group relative block overflow-hidden rounded-2xl"
                  style={{ aspectRatio: "3/4" }}
                >
                  <img
                    src={service.imageUrl ?? undefined}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(0deg, rgba(20,22,26,0.92) 15%, rgba(20,22,26,0.05) 55%)",
                    }}
                  />

                  <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-gold-ink">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>

                  <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-void transition-colors group-hover:bg-gold group-hover:text-gold-ink">
                    <ArrowUpRight size={20} strokeWidth={2.5} />
                  </span>

                  <div className="absolute inset-x-5 bottom-20">
                    <h3 className="text-lg font-bold text-white">{service.title}</h3>
                    <p className="mt-2 text-sm text-void-soft">{service.summary}</p>
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <StaggerGroup className="mt-4 grid gap-px overflow-hidden rounded-2xl bg-void-line sm:grid-cols-2 lg:grid-cols-5">
          {rest.map((service) => {
            const Icon = ICONS[service.icon] ?? Flame;
            return (
              <StaggerItem key={service.slug}>
                <a
                  href={`/services/${service.slug}`}
                  className="flex h-full flex-col gap-3 bg-void-raised p-6 transition-colors hover:bg-void"
                >
                  <Icon className="text-gold" size={22} strokeWidth={1.75} />
                  <h4 className="text-sm font-bold text-white">{service.title}</h4>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
