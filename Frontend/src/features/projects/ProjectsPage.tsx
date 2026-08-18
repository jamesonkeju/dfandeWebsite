import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { CtaBand } from "@/components/sections/CtaBand";
import { useGetPublishedProjectsQuery } from "./api/projectsApi";
import { projects as mockProjects, type Project } from "@/data/mock/projects";
import { Search, Layers, FileText, CheckCircle, Shield } from "lucide-react";

const FILTERS = [
  { value: "all", label: "All Experience" },
  { value: "wellhead", label: "Wellhead & Xmas Tree" },
  { value: "choke-valve", label: "Choke Valve Supply & Refurb" },
  { value: "control-panel", label: "Wellhead Control Panels" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  wellhead: "Wellhead & Xmas Tree",
  "choke-valve": "Choke Valve",
  "control-panel": "Control Panel",
};

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [filter, setFilter] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const { data: serverProjects, isLoading } = useGetPublishedProjectsQuery();
  const effectiveProjects: Project[] = (serverProjects && serverProjects.length > 0) ? serverProjects : mockProjects;

  const handleFilterChange = (val: string) => {
    setFilter(val);
    setSearchParams(val === "all" ? {} : { category: val });
  };

  const filtered = useMemo(() => {
    return effectiveProjects.filter((p) => {
      const matchesCategory = filter === "all" || p.category === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.client.toLowerCase().includes(q) ||
        p.scope.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.year.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [effectiveProjects, filter, searchQuery]);

  return (
    <>
      <PageHeader
        eyebrow="Work Experience & Track Record"
        title="Field-Proven Client Work Experience"
        description="Comprehensive contractual experience across Nigeria's energy sector — spanning major IOCs and indigenous operators including Shell, Chevron, ExxonMobil, TotalEnergies, Seplat Energy, NNPC E&P, First E&P, and Addax Petroleum."
      />

      <Container className="py-16 md:py-20">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gold-dark border-t-transparent" />
          </div>
        )}

        {/* Control Bar: Search + Category Filters + View Mode Toggle */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-line">
          {/* Category Pills with counts */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const count =
                f.value === "all"
                  ? effectiveProjects.length
                  : effectiveProjects.filter((p) => p.category === f.value).length;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => handleFilterChange(f.value)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
                    filter === f.value
                      ? "bg-gold text-gold-ink shadow-sm"
                      : "border border-line bg-white text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                  }`}
                >
                  {f.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[240px] flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search client, field or scope…"
                className="w-full rounded-full border border-line bg-white py-2 pl-9 pr-4 text-xs font-medium text-ink placeholder:text-steel focus:border-gold-dark focus:outline-none"
              />
            </div>

            <div className="flex items-center rounded-full border border-line bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                title="Card View"
                className={`rounded-full p-1.5 transition-colors ${
                  viewMode === "cards" ? "bg-gold text-gold-ink" : "text-steel hover:text-ink"
                }`}
              >
                <Layers size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="Table View (Tender Matrix)"
                className={`rounded-full p-1.5 transition-colors ${
                  viewMode === "table" ? "bg-gold text-gold-ink" : "text-steel hover:text-ink"
                }`}
              >
                <FileText size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count & Meta */}
        <div className="mt-4 flex items-center justify-between text-xs text-steel">
          <span>
            Showing <strong className="text-ink">{filtered.length}</strong> verified contractual records
          </span>
          <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-gold-dark">
            <Shield size={13} /> Sourced from Tender Form F &amp; Work Experience History
          </span>
        </div>

        {/* VIEW MODE: CARDS */}
        {viewMode === "cards" && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, idx) => (
              <div
                key={project.id ?? `${project.client}-${idx}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gold-dark hover:shadow-md"
              >
                {project.imageUrl && (
                  <div className="aspect-[16/10] overflow-hidden bg-paper">
                    <img
                      src={project.imageUrl}
                      alt={project.client}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs font-bold text-gold-dark">{project.year}</span>
                    <span className="rounded-full bg-paper-raised border border-line px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-steel">
                      {CATEGORY_LABELS[project.category] ?? project.category}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-ink group-hover:text-gold-dark transition-colors">
                    {project.client}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{project.scope}</p>
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-line/60 text-xs text-steel">
                    <span className="font-semibold uppercase tracking-wider">{project.location}</span>
                    <CheckCircle size={14} className="text-gold-dark" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW MODE: DETAILED TABULAR MATRIX */}
        {viewMode === "table" && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-paper-raised text-xs font-bold uppercase tracking-wider text-ink">
                  <tr>
                    <th className="px-6 py-4">Customer / Operator</th>
                    <th className="px-6 py-4">Contractual Work Scope</th>
                    <th className="px-6 py-4">Asset / Field Location</th>
                    <th className="px-6 py-4">Year / Term</th>
                    <th className="px-6 py-4">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map((p, idx) => (
                    <tr key={p.id ?? `${p.client}-${idx}`} className="hover:bg-paper/60 transition-colors">
                      <td className="px-6 py-4.5 font-bold text-ink whitespace-nowrap">{p.client}</td>
                      <td className="px-6 py-4.5 text-ink-soft leading-relaxed min-w-[280px]">{p.scope}</td>
                      <td className="px-6 py-4.5 text-steel whitespace-nowrap">{p.location}</td>
                      <td className="px-6 py-4.5 font-mono text-xs font-bold text-gold-dark whitespace-nowrap">
                        {p.year}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="rounded-full bg-paper border border-line px-2.5 py-1 text-[11px] font-semibold text-steel">
                          {CATEGORY_LABELS[p.category] ?? p.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-line bg-paper p-12 text-center">
            <p className="font-bold text-ink">No project records match your query.</p>
            <p className="mt-1 text-xs text-steel">Try selecting another category filter or clearing your search keywords.</p>
          </div>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
