import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  Search,
  CheckCircle2,
  Circle,
  ExternalLink,
  Layers,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  useGetAllProjectsQuery,
  useDeleteProjectMutation,
  useSetProjectPublishedMutation,
} from "@/features/projects/api/projectsApi";

const CATEGORY_LABELS: Record<string, string> = {
  wellhead: "Wellhead & Xmas Tree",
  "control-panel": "Control Panel",
  "choke-valve": "Choke Valve",
};

export function ProjectsListPage() {
  const { data: projects, isLoading, isError } = useGetAllProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const [setPublished] = useSetProjectPublishedMutation();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const filteredProjects = useMemo(() => {
    return (projects ?? []).filter((p) => {
      const matchQuery =
        p.client.toLowerCase().includes(search.toLowerCase()) ||
        p.scope.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase()) ||
        p.year.toLowerCase().includes(search.toLowerCase());

      if (!matchQuery) return false;
      if (categoryFilter !== "ALL" && p.category !== categoryFilter) return false;
      if (statusFilter === "PUBLISHED") return p.isPublished;
      if (statusFilter === "DRAFT") return !p.isPublished;
      return true;
    });
  }, [projects, search, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
            <Layers size={15} />
            <span>Field Proven Track Record</span>
          </div>
          <h1 className="text-2xl font-bold text-ink">Projects & Case Studies</h1>
          <p className="mt-0.5 text-xs text-steel">
            Manage completed and ongoing major oil & gas client projects displayed on `/projects`.
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink shadow-xs transition-all hover:bg-gold-light cursor-pointer"
        >
          <Plus size={15} />
          <span>New Project</span>
        </Link>
      </div>

      {/* Toolbar: Search, Category & Status Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by client name, scope of work, field location, or year…"
              className="w-full rounded-xl border border-line bg-paper-raised py-2 pl-10 pr-4 text-xs font-medium text-ink focus:border-gold-dark focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-line bg-paper-raised px-3 py-2 text-xs font-bold text-ink focus:border-gold-dark focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="wellhead">Wellhead & Xmas Tree</option>
              <option value="control-panel">Control Panel</option>
              <option value="choke-valve">Choke Valve</option>
            </select>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-gold text-gold-ink shadow-2xs"
                    : "text-steel hover:bg-paper hover:text-ink"
                }`}
              >
                All ({(projects ?? []).length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PUBLISHED")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === "PUBLISHED"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-steel hover:bg-paper hover:text-ink"
                }`}
              >
                Published ({(projects ?? []).filter((p) => p.isPublished).length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("DRAFT")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === "DRAFT"
                    ? "bg-steel text-white shadow-2xs"
                    : "text-steel hover:bg-paper hover:text-ink"
                }`}
              >
                Draft ({(projects ?? []).filter((p) => !p.isPublished).length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-2xs">
        {isLoading && (
          <div className="p-12 text-center text-xs text-steel">Loading track record projects…</div>
        )}
        {isError && (
          <div className="p-12 text-center text-xs text-danger">
            Could not load projects. Please ensure the backend is running.
          </div>
        )}

        {!isLoading && !isError && filteredProjects.length === 0 && (
          <div className="p-12 text-center text-xs text-steel">
            No projects found matching your search criteria.
          </div>
        )}

        {!isLoading && !isError && filteredProjects.length > 0 && (
          <div className="divide-y divide-line">
            {filteredProjects.map((project) => {
              const previewImg =
                project.imageUrl ||
                (project.category === "wellhead"
                  ? "/images/project-wellhead.jpg"
                  : project.category === "control-panel"
                  ? "/images/project-control-panel.jpg"
                  : "/images/project-choke-valve.jpg");

              return (
                <div
                  key={project.id}
                  className="flex flex-col gap-4 p-4 transition-colors hover:bg-paper-raised/50 sm:flex-row sm:items-center sm:gap-6"
                >
                  {/* Thumbnail */}
                  <div className="relative h-18 w-26 flex-none overflow-hidden rounded-xl border border-line bg-paper-raised shadow-2xs">
                    <img
                      src={previewImg}
                      alt={project.client}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/project-wellhead.jpg";
                      }}
                    />
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                      #{project.displayOrder}
                    </span>
                  </div>

                  {/* Main Details */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-bold text-ink">{project.client}</h2>
                      {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-dark">
                          <Star size={10} className="fill-gold text-gold" />
                          <span>Featured</span>
                        </span>
                      )}
                      <span className="rounded bg-paper-raised px-2 py-0.5 text-[10px] font-bold text-steel">
                        {CATEGORY_LABELS[project.category] ?? project.category}
                      </span>
                    </div>

                    <p className="line-clamp-2 text-xs text-ink-soft leading-relaxed">{project.scope}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] text-steel">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MapPin size={12} className="text-steel" />
                        <span>{project.location}</span>
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Calendar size={12} className="text-steel" />
                        <span>{project.year}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                    {/* Live Page Link */}
                    <a
                      href="/projects"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-2.5 py-1.5 text-[11px] font-bold text-steel hover:border-gold-dark hover:text-gold-dark cursor-pointer transition-colors"
                      title="View public projects page"
                    >
                      <ExternalLink size={12} />
                      <span className="hidden md:inline">Live Page</span>
                    </a>

                    {/* Publish Status Toggle */}
                    <button
                      type="button"
                      onClick={() =>
                        setPublished({
                          id: project.id,
                          isPublished: !project.isPublished,
                        })
                      }
                      className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        project.isPublished
                          ? "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border border-line bg-paper-raised text-steel hover:bg-paper"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {project.isPublished ? (
                        <>
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Circle size={13} className="text-steel" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <Link
                      to={`/admin/projects/${project.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark cursor-pointer transition-colors shadow-2xs"
                      aria-label={`Edit ${project.client}`}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </Link>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            `Delete project record for "${project.client}"? This cannot be undone.`
                          )
                        ) {
                          deleteProject(project.id);
                        }
                      }}
                      className="inline-flex items-center rounded-xl border border-line bg-white p-2 text-steel hover:border-danger hover:text-danger cursor-pointer transition-colors shadow-2xs"
                      aria-label={`Delete ${project.client}`}
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
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
