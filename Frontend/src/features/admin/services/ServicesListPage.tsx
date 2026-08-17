import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  useGetAllServicesQuery,
  useDeleteServiceMutation,
  useSetServicePublishedMutation,
} from "@/features/services/api/servicesApi";

export function ServicesListPage() {
  const { data: services, isLoading, isError } = useGetAllServicesQuery();
  const [deleteService] = useDeleteServiceMutation();
  const [setPublished] = useSetServicePublishedMutation();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Services</h1>
          <p className="mt-1 text-sm text-ink-soft">What DF&amp;E offers — shown on the homepage and public site.</p>
        </div>
        <Link
          to="/admin/services/new"
          className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-gold-ink hover:bg-gold-dark"
        >
          <Plus size={16} />
          New Service
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {isLoading && <p className="p-6 text-sm text-ink-soft">Loading…</p>}
        {isError && <p className="p-6 text-sm text-danger">Couldn't load services. Is the API running?</p>}

        {services?.map((service) => (
          <div key={service.id} className="flex items-center gap-4 border-b border-line p-4 last:border-b-0">
            <span className="w-10 flex-none text-xs font-bold text-steel">#{service.displayOrder}</span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-ink">{service.title}</p>
                {service.isFeatured && <Star size={14} className="flex-none fill-gold text-gold" />}
              </div>
              <p className="truncate text-xs text-steel">/{service.slug}</p>
            </div>

            <button
              type="button"
              onClick={() => setPublished({ id: service.id, isPublished: !service.isPublished })}
              className={`flex-none rounded-full px-2.5 py-1 text-xs font-bold ${
                service.isPublished ? "bg-verify/15 text-verify" : "bg-line text-steel"
              }`}
            >
              {service.isPublished ? "Published" : "Draft"}
            </button>

            <Link
              to={`/admin/services/${service.id}/edit`}
              className="flex-none rounded-full border border-line p-2 text-ink-soft hover:border-gold-dark hover:text-gold-dark"
              aria-label={`Edit ${service.title}`}
            >
              <Pencil size={15} />
            </Link>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete "${service.title}"? This can't be undone.`)) {
                  deleteService(service.id);
                }
              }}
              className="flex-none rounded-full border border-line p-2 text-ink-soft hover:border-danger hover:text-danger"
              aria-label={`Delete ${service.title}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
