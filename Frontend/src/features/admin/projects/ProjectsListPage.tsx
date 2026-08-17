import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
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

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink-soft">The field record shown on the public /projects page.</p>
        </div>
        <Link
          to="/admin/projects/new"
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-ink hover:bg-gold-dark"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {isLoading && <p className="p-6 text-sm text-ink-soft">Loading…</p>}
        {isError && <p className="p-6 text-sm text-danger">Couldn't load projects. Is the API running?</p>}

        {projects?.map((project) => (
          <div key={project.id} className="flex items-center gap-4 border-b border-line p-4 last:border-b-0">
            <span className="w-10 flex-none text-xs font-bold text-steel">#{project.displayOrder}</span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-ink">{project.client}</p>
                {project.isFeatured && <Star size={14} className="flex-none fill-gold text-gold" />}
              </div>
              <p className="truncate text-xs text-steel">
                {CATEGORY_LABELS[project.category] ?? project.category} · {project.year}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setPublished({ id: project.id, isPublished: !project.isPublished })}
              className={`flex-none rounded-full px-2.5 py-1 text-xs font-bold ${
                project.isPublished ? "bg-verify/15 text-verify" : "bg-line text-steel"
              }`}
            >
              {project.isPublished ? "Published" : "Draft"}
            </button>

            <Link
              to={`/admin/projects/${project.id}/edit`}
              className="flex-none rounded-full border border-line p-2 text-ink-soft hover:border-gold-dark hover:text-gold-dark"
              aria-label={`Edit ${project.client}`}
            >
              <Pencil size={15} />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete this "${project.client}" project entry? This can't be undone.`)) {
                  deleteProject(project.id);
                }
              }}
              className="flex-none rounded-full border border-line p-2 text-ink-soft hover:border-danger hover:text-danger"
              aria-label={`Delete ${project.client}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
