import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";
import { Carousel, CarouselItem } from "@/components/ui/Carousel";
import { CtaBand } from "@/components/sections/CtaBand";
import { useGetPublishedProjectsQuery } from "./api/projectsApi";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "wellhead", label: "Wellhead & Xmas Tree" },
  { value: "choke-valve", label: "Choke Valve" },
  { value: "control-panel", label: "Control Panel" },
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  wellhead: "Wellhead & Xmas Tree",
  "choke-valve": "Choke Valve",
  "control-panel": "Control Panel",
};

export function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");
  const { data: projects, isLoading, isError } = useGetPublishedProjectsQuery();
  const filtered = !projects ? [] : filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageHeader
        eyebrow="Field Record"
        title="Featured Projects"
        description="A field record spanning Nigeria's major oil producing companies — real contracts, real JV assets, current through 2025."
      />

      <Container className="py-16 md:py-20">
        {isLoading && <p className="text-sm text-ink-soft">Loading projects…</p>}
        {isError && <p className="text-sm text-danger">Couldn't load projects. Please try again shortly.</p>}

        {projects && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFilter(f.value)}
                    className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${
                      filter === f.value
                        ? "border-gold-dark bg-gold text-gold-ink"
                        : "border-line text-ink-soft hover:border-gold-dark hover:text-gold-dark"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-steel">
                {filtered.length} {filtered.length === 1 ? "Project" : "Projects"}
              </p>
            </div>

            {/* key={filter} forces a full remount (and scroll-position reset)
                on every filter change. */}
            <Carousel key={filter} className="mt-8">
              {filtered.map((project) => (
                <CarouselItem key={project.id} className="w-[82%] sm:w-[46%] lg:w-[31%]">
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-colors hover:border-gold-dark">
                    {project.imageUrl && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={CATEGORY_LABELS[project.category] ?? project.category}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-gold-dark">
                          {project.year}
                        </span>
                        <span className="rounded-full bg-paper-raised px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-steel">
                          {CATEGORY_LABELS[project.category] ?? project.category}
                        </span>
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-ink">{project.client}</h2>
                      <p className="mt-2 text-sm text-ink-soft">{project.scope}</p>
                      <p className="mt-auto pt-4 text-xs uppercase tracking-wide text-steel">{project.location}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
