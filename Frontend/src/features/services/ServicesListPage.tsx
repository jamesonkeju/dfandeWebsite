import { Flame, Gauge, Settings2, Anchor, Droplet, ShieldCheck, Lock, PackageSearch, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useGetPublishedServicesQuery } from "./api/servicesApi";

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

export function ServicesListPage() {
  const { data: services, isLoading, isError } = useGetPublishedServicesQuery();

  return (
    <>
      <PageHeader
        eyebrow="What We Do"
        title="Engineering Solutions For Wellhead Reliability"
        description="Procurement, installation, inspection, testing, repairs and maintenance of wellhead, Xmas tree, choke and control panel equipment — delivered to ISO 9001, ISO 14001 and ISO 45001 standards."
      />

      <Container className="py-16 md:py-20">
        {isLoading && <p className="text-sm text-ink-soft">Loading services…</p>}
        {isError && <p className="text-sm text-danger">Couldn't load services. Please try again shortly.</p>}

        {/* Only mounted once data exists — StaggerGroup's whileInView observer
            fires once (once: true) and disconnects; if it mounts empty while
            still loading, children that arrive afterward never get told to
            animate in. Confirmed via computed-style inspection: opacity
            stayed 0 forever without this guard. */}
        {services && (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = ICONS[service.icon] ?? Flame;
              return (
                <StaggerItem key={service.slug}>
                  <a
                    href={`/services/${service.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-2xl border border-line p-7 transition-colors hover:border-gold-dark"
                  >
                    <Icon className="text-gold-dark" size={28} strokeWidth={1.75} />
                    <h2 className="text-lg font-bold text-ink">{service.title}</h2>
                    <p className="text-sm text-ink-soft">{service.summary}</p>
                    <span className="mt-auto text-xs font-bold uppercase tracking-wide text-gold-dark">
                      Learn more →
                    </span>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        )}
      </Container>
    </>
  );
}
