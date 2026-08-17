import { Mail, FileText, Wrench, Package, Briefcase, Newspaper } from "lucide-react";
import { useGetContactSubmissionsQuery } from "@/features/contact/api/contactApi";
import { useGetAllServicesQuery } from "@/features/services/api/servicesApi";
import { useGetAllProductsQuery } from "@/features/products/api/productsApi";
import { useGetAllProjectsQuery } from "@/features/projects/api/projectsApi";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/admin/auth/authSlice";
import { StatusBadge } from "@/features/admin/components/StatusBadge";

export function DashboardPage() {
  const { displayName } = useSelector(selectAuth);
  const { data: submissions, isLoading, isError } = useGetContactSubmissionsQuery();
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices } = useGetAllServicesQuery();
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useGetAllProductsQuery();
  const { data: projects, isLoading: isLoadingProjects, isError: isErrorProjects } = useGetAllProjectsQuery();

  const newCount = submissions?.filter((s) => s.status === "New").length ?? 0;
  const recent = submissions?.slice(0, 5) ?? [];
  const publishedCount = services?.filter((s) => s.isPublished).length ?? 0;
  const publishedProductsCount = products?.filter((p) => p.isPublished).length ?? 0;
  const publishedProjectsCount = projects?.filter((p) => p.isPublished).length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Welcome back, {displayName}</h1>
      <p className="mt-1 text-sm text-ink-soft">Here's what's happening on the DF&amp;E website.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatCard
          icon={Mail}
          label="Contact Submissions"
          value={isLoading ? "…" : isError ? "—" : String(submissions?.length ?? 0)}
          note={newCount > 0 ? `${newCount} unread` : "All read"}
        />
        <StatCard icon={FileText} label="Published Pages" value="—" note="Not yet built" muted />
        <StatCard
          icon={Wrench}
          label="Services"
          value={isLoadingServices ? "…" : isErrorServices ? "—" : String(services?.length ?? 0)}
          note={`${publishedCount} published`}
        />
        <StatCard
          icon={Package}
          label="Products"
          value={isLoadingProducts ? "…" : isErrorProducts ? "—" : String(products?.length ?? 0)}
          note={`${publishedProductsCount} published`}
        />
        <StatCard
          icon={Briefcase}
          label="Projects"
          value={isLoadingProjects ? "…" : isErrorProjects ? "—" : String(projects?.length ?? 0)}
          note={`${publishedProjectsCount} published`}
        />
        <StatCard icon={Newspaper} label="Blog / Insights" value="—" note="Not yet built" muted />
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-steel">Recent Contact Submissions</h2>

        {isLoading && <p className="mt-4 text-sm text-ink-soft">Loading…</p>}
        {isError && <p className="mt-4 text-sm text-danger">Couldn't load submissions. Is the API running?</p>}
        {!isLoading && !isError && recent.length === 0 && (
          <p className="mt-4 text-sm text-ink-soft">No submissions yet.</p>
        )}

        {recent.length > 0 && (
          <ul className="mt-4 divide-y divide-line">
            {recent.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{s.subject}</p>
                  <p className="truncate text-xs text-steel">
                    {s.name} · {s.email}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  muted,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  note: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <Icon className={muted ? "text-steel" : "text-gold-dark"} size={22} />
      <div className={`mt-3 text-2xl font-bold ${muted ? "text-steel" : "text-ink"}`}>{value}</div>
      <div className="text-xs font-bold uppercase tracking-wide text-steel">{label}</div>
      <div className="mt-1 text-xs text-steel">{note}</div>
    </div>
  );
}
