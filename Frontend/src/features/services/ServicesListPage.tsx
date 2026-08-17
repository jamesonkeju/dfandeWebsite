import { useState } from "react";
import {
  Flame,
  Gauge,
  Settings2,
  Anchor,
  Droplet,
  ShieldCheck,
  Lock,
  PackageSearch,
  ArrowRight,
  Check,
  Image,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";
import { useGetPublishedServicesQuery } from "./api/servicesApi";
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

function ServiceCard({ service }: { service: any }) {
  const Icon = ICONS[service.icon] ?? Flame;
  const gallery = SERVICE_GALLERIES[service.slug] ?? [
    { url: service.imageUrl || "/images/service-wellhead.png", caption: service.title, tag: "Operation" },
  ];
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activeImage = gallery[activeImageIdx] || gallery[0];

  return (
    <div className="group flex flex-col justify-between rounded-3xl border border-line bg-white shadow-sm transition-all duration-200 hover:border-gold-dark hover:shadow-md overflow-hidden">
      {/* 1. MULTI-IMAGE VIEWER HEADER */}
      <div className="relative bg-void">
        <div className="aspect-[16/10] overflow-hidden bg-void/80 relative">
          <img
            src={activeImage.url}
            alt={activeImage.caption}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Active Image Tag */}
          <span className="absolute top-3 left-3 rounded-full bg-void/80 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold shadow-sm backdrop-blur-xs">
            {activeImage.tag}
          </span>
          {/* Multiple Pictures Indicator */}
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-void/80 border border-white/20 px-2 py-0.5 text-[10px] font-mono text-white shadow-sm backdrop-blur-xs">
            <Image size={12} className="text-gold" />
            <span>{gallery.length} Photos</span>
          </span>
        </div>

        {/* Thumbnail Selector Strip */}
        {gallery.length > 1 && (
          <div className="flex gap-2 p-2 bg-void/90 border-t border-void-line overflow-x-auto">
            {gallery.map((img, idx) => (
              <button
                key={img.url + idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative h-11 w-14 flex-none rounded-lg overflow-hidden border transition-all ${
                  activeImageIdx === idx
                    ? "border-gold ring-1 ring-gold opacity-100"
                    : "border-void-line opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img.url} alt={img.caption} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. CARD CONTENT & SCOPE */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-gold/15 text-gold-dark border border-gold/30">
              <Icon size={18} strokeWidth={2} />
            </div>
            <h2 className="text-lg font-bold text-ink group-hover:text-gold-dark transition-colors line-clamp-1">
              {service.title}
            </h2>
          </div>

          <p className="mt-3 text-xs text-ink-soft leading-relaxed line-clamp-2">{service.summary}</p>

          {/* Scope Bullets */}
          {service.scope && service.scope.length > 0 && (
            <div className="mt-4 pt-4 border-t border-line space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-steel">
                Key Scope Highlights:
              </span>
              <ul className="space-y-1 text-xs text-ink-soft">
                {service.scope.slice(0, 3).map((item: string) => (
                  <li key={item} className="flex items-center gap-2 line-clamp-1">
                    <Check size={13} className="text-gold-dark flex-none" />
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 3. CARD ACTION LINK */}
        <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-steel">
            ISO 9001 · API Spec
          </span>
          <a
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-dark hover:text-gold-ink hover:underline"
          >
            <span>View Technical Details</span>
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export function ServicesListPage() {
  const { data: services, isLoading, isError } = useGetPublishedServicesQuery();

  return (
    <>
      <PageHeader
        eyebrow="Technical Service Portfolio"
        title="Engineering Solutions for Wellhead Reliability"
        description="Field installation, recertification, high-pressure hydro testing, OEM-backed repairs, and preservation across surface and subsea energy assets."
      />

      <Container className="py-16 md:py-20">
        {isLoading && (
          <div className="py-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gold-dark border-t-transparent" />
            <p className="mt-3 text-sm text-ink-soft">Loading technical service catalog…</p>
          </div>
        )}
        {isError && <p className="text-sm text-danger">Couldn't load services. Please try again shortly.</p>}

        {services && (
          <StaggerGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </Container>
    </>
  );
}
