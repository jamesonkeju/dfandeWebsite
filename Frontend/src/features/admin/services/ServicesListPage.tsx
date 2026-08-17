import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Search,
  ExternalLink,
  Wrench,
  Image as ImageIcon,
  Flame,
  Gauge,
  Settings2,
  Anchor,
  Droplet,
  ShieldCheck,
  Lock,
  PackageSearch,
  type LucideIcon,
} from "lucide-react";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
  useSetServicePublishedMutation,
} from "@/features/services/api/servicesApi";

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
  const { data: services, isLoading, isError } = useGetAllServicesQuery();
  const [deleteService] = useDeleteServiceMutation();
  const [setPublished] = useSetServicePublishedMutation();
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState<"all" | "published" | "draft" | "featured">("all");

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((s) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterState === "published") return s.isPublished;
      if (filterState === "draft") return !s.isPublished;
      if (filterState === "featured") return s.isFeatured;
      return true;
    });
  }, [services, search, filterState]);

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Wrench size={15} />
            <span>Service Capabilities Catalog</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-ink">Services Management</h1>
          <p className="text-xs text-steel">
            Manage engineering capabilities, workshop scope, media banners, and public catalog visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/services/new"
            className="flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all cursor-pointer shadow-sm"
          >
            <Plus size={15} />
            <span>New Service</span>
          </Link>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title, slug, or summary…"
            className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 pl-9 text-xs font-medium text-ink placeholder:text-steel focus:border-gold-dark focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "published", "draft", "featured"] as const).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setFilterState(filter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                filterState === filter
                  ? "bg-gold text-gold-ink shadow-xs"
                  : "bg-paper text-ink-soft hover:text-ink hover:bg-paper-raised"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SERVICES LIST / GRID */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
        {isLoading && (
          <div className="p-12 text-center text-sm text-steel">
            <p>Loading services catalog…</p>
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-sm text-danger">
            <p className="font-bold">Couldn't load services from the backend API.</p>
          </div>
        )}

        {!isLoading && !isError && filteredServices.length === 0 && (
          <div className="p-12 text-center text-sm text-steel">
            <p className="font-bold text-ink">No services match your search criteria.</p>
            <p className="mt-1 text-xs">Try searching for something else or create a new service.</p>
          </div>
        )}

        {!isLoading && !isError && filteredServices.length > 0 && (
          <div className="divide-y divide-line">
            {filteredServices.map((service) => {
              const IconComponent = ICONS[service.icon] || Wrench;

              return (
                <div
                  key={service.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-paper/30 transition-colors"
                >
                  {/* Left: Thumbnail Preview & Title */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                    {/* Visual Media Thumbnail */}
                    <div className="relative h-16 w-24 flex-none overflow-hidden rounded-xl border border-line bg-paper-raised">
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback on broken image
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-steel bg-paper">
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 rounded-md bg-void/80 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                        #{service.displayOrder}
                      </span>
                    </div>

                    {/* Meta Details */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold/15 text-gold-dark">
                          <IconComponent size={13} />
                        </div>
                        <h3 className="font-bold text-ink text-sm truncate">{service.title}</h3>
                        {service.isFeatured && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            <Star size={10} className="fill-amber-500 text-amber-500" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steel">
                        <span className="font-mono text-gold-dark">/services/{service.slug}</span>
                        <span>·</span>
                        <span>{service.scope?.length || 0} Scope items</span>
                        {service.imageUrl && (
                          <>
                            <span>·</span>
                            <span className="text-[11px] text-steel font-mono truncate max-w-[200px]">
                              {service.imageUrl}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Toggle & Action Buttons */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Live Preview Button */}
                    <Link
                      to={`/services/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-steel hover:text-gold-dark hover:border-gold-dark transition-colors"
                      title="View live service page on public site"
                    >
                      <ExternalLink size={12} />
                      <span>Live Page</span>
                    </Link>

                    {/* Publish Status Toggle */}
                    <button
                      type="button"
                      onClick={() => setPublished({ id: service.id, isPublished: !service.isPublished })}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        service.isPublished
                          ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 hover:bg-emerald-500/25"
                          : "bg-line text-steel hover:bg-line/80"
                      }`}
                    >
                      {service.isPublished ? "Published" : "Draft"}
                    </button>

                    {/* Edit Button */}
                    <Link
                      to={`/admin/services/${service.id}/edit`}
                      className="rounded-xl border border-line bg-white p-2 text-ink-soft hover:border-gold-dark hover:text-gold-dark transition-colors"
                      title={`Edit ${service.title}`}
                    >
                      <Pencil size={14} />
                    </Link>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${service.title}"? This cannot be undone.`)) {
                          deleteService(service.id);
                        }
                      }}
                      className="rounded-xl border border-line bg-white p-2 text-ink-soft hover:border-danger hover:text-danger transition-colors cursor-pointer"
                      title={`Delete ${service.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

