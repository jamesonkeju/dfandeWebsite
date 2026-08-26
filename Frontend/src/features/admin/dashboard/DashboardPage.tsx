import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Wrench,
  Package,
  Briefcase,
  Users,
  Activity,
  ArrowRight,
  ShieldCheck,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useGetContactSubmissionsQuery } from "@/features/contact/api/contactApi";
import { useGetAllServicesQuery } from "@/features/services/api/servicesApi";
import { useGetAllProductsQuery } from "@/features/products/api/productsApi";
import { useGetAllProjectsQuery } from "@/features/projects/api/projectsApi";
import { useGetAnalyticsSummaryQuery } from "@/features/analytics/api/analyticsApi";
import { useSelector } from "react-redux";
import { selectAuth, selectUserRoles } from "@/features/admin/auth/authSlice";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { RoleGate } from "@/features/admin/components/RoleGate";

export function DashboardPage() {
  const { displayName, token } = useSelector(selectAuth);
  const userRoles = useSelector(selectUserRoles);
  const primaryRole = userRoles[0] || "Staff";

  const { data: submissions, isLoading: isLoadingSubmissions } = useGetContactSubmissionsQuery();
  const { data: services, isLoading: isLoadingServices } = useGetAllServicesQuery();
  const { data: products, isLoading: isLoadingProducts } = useGetAllProductsQuery();
  const { data: projects, isLoading: isLoadingProjects } = useGetAllProjectsQuery();
  const { data: analytics, isLoading: isLoadingAnalytics } = useGetAnalyticsSummaryQuery(7);

  const [recentAudits, setRecentAudits] = useState<any[]>([]);

  useEffect(() => {
    if (userRoles.some((r) => r.toLowerCase() === "superadmin")) {
      fetch("/api/auditlogs?page=1&pageSize=5", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setRecentAudits(data.data?.items || []))
        .catch(() => {});
    }
  }, [token, userRoles]);

  const newSubmissions = submissions?.filter((s) => s.status === "New").length ?? 0;
  const recentSubmissions = submissions?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      {/* WELCOME HERO BANNER */}
      <div className="rounded-3xl border border-line bg-gradient-to-r from-void via-void-raised to-void text-white p-8 md:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 border border-gold/40 px-3 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider text-gold">
            <ShieldCheck size={13} />
            <span>Authenticated Role: {primaryRole}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, {displayName || "Executive Staff"}
          </h1>
          <p className="text-xs md:text-sm text-void-soft">
            Manage corporate engineering services, product catalogs, customer RFPs, and system governance.
          </p>
        </div>
      </div>

      {/* OPERATIONAL METRIC STATS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={Activity}
          label="Site Visits (7d)"
          value={isLoadingAnalytics ? "…" : String(analytics?.last7DaysViews ?? 0)}
          note={`${analytics?.todayPageViews ?? 0} views today`}
          link="/admin/analytics"
        />
        <StatCard
          icon={Mail}
          label="Contact Inquiries"
          value={isLoadingSubmissions ? "…" : String(submissions?.length ?? 0)}
          note={newSubmissions > 0 ? `${newSubmissions} unread submissions` : "All reviewed"}
          link="/admin/contact"
        />
        <StatCard
          icon={Wrench}
          label="Active Services"
          value={isLoadingServices ? "…" : String(services?.length ?? 0)}
          note={`${services?.filter((s) => s.isPublished).length ?? 0} published`}
          link="/admin/services"
        />
        <StatCard
          icon={Package}
          label="Product Lines"
          value={isLoadingProducts ? "…" : String(products?.length ?? 0)}
          note={`${products?.filter((p) => p.isPublished).length ?? 0} published`}
          link="/admin/products"
        />
        <StatCard
          icon={Briefcase}
          label="Delivered Projects"
          value={isLoadingProjects ? "…" : String(projects?.length ?? 0)}
          note={`${projects?.filter((p) => p.isPublished).length ?? 0} published`}
          link="/admin/projects"
        />
      </div>

      {/* QUICK ACTIONS ROW */}
      <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-steel mb-4">
          Quick Management Shortcuts
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RoleGate allowedRoles={["SuperAdmin", "ContentManager"]}>
            <Link
              to="/admin/services/new"
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised p-4 hover:border-gold-dark hover:bg-white transition-all group"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gold/15 text-gold-dark group-hover:bg-gold group-hover:text-gold-ink transition-colors">
                <Plus size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink">Add Service</div>
                <div className="text-[10px] text-steel">Create engineering scope</div>
              </div>
            </Link>

            <Link
              to="/admin/products/new"
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised p-4 hover:border-gold-dark hover:bg-white transition-all group"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gold/15 text-gold-dark group-hover:bg-gold group-hover:text-gold-ink transition-colors">
                <Plus size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink">Add Product</div>
                <div className="text-[10px] text-steel">Add wellhead/valve gear</div>
              </div>
            </Link>
          </RoleGate>

          <RoleGate allowedRoles={["SuperAdmin"]}>
            <Link
              to="/admin/users"
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised p-4 hover:border-gold-dark hover:bg-white transition-all group"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-purple-100 text-purple-800 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Users size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink">User Directory</div>
                <div className="text-[10px] text-steel">Manage staff &amp; roles</div>
              </div>
            </Link>

            <Link
              to="/admin/audit-logs"
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised p-4 hover:border-gold-dark hover:bg-white transition-all group"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-100 text-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Activity size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink">Audit Trail</div>
                <div className="text-[10px] text-steel">Inspect security logs</div>
              </div>
            </Link>
          </RoleGate>
        </div>
      </div>

      {/* TWO COLUMN STREAM: RECENT INQUIRIES & AUDIT LOGS */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* RECENT INQUIRIES */}
        <div className="rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gold-dark" />
                <h3 className="text-base font-bold text-ink">Recent Inquiries &amp; RFPs</h3>
              </div>
              <Link
                to="/admin/contact"
                className="text-xs font-bold uppercase tracking-wider text-gold-dark hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="mt-4 divide-y divide-line">
              {recentSubmissions.length === 0 ? (
                <div className="py-8 text-center text-xs text-steel">No inquiries received yet.</div>
              ) : (
                recentSubmissions.map((s) => (
                  <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="font-bold text-ink text-xs truncate">{s.subject}</div>
                      <div className="text-[11px] text-steel truncate">{s.name} · {s.email}</div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RECENT AUDIT ACTIVITY (SUPERADMIN ONLY) */}
        <RoleGate
          allowedRoles={["SuperAdmin"]}
          fallback={
            <div className="rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-line">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <h3 className="text-base font-bold text-ink">System Status</h3>
              </div>
              <div className="mt-6 space-y-3 text-xs text-ink-soft leading-relaxed">
                <p>
                  Your current role (<strong>{primaryRole}</strong>) is active with healthy system permissions.
                </p>
                <p className="text-steel">
                  All API endpoints, SMTP notifications, and asset preservation catalogs are fully synchronized.
                </p>
              </div>
            </div>
          }
        >
          <div className="rounded-3xl border border-line bg-white p-6 md:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-gold-dark" />
                  <h3 className="text-base font-bold text-ink">Recent Audit Trail</h3>
                </div>
                <Link
                  to="/admin/audit-logs"
                  className="text-xs font-bold uppercase tracking-wider text-gold-dark hover:underline flex items-center gap-1"
                >
                  <span>Full Trail</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="mt-4 divide-y divide-line">
                {recentAudits.length === 0 ? (
                  <div className="py-8 text-center text-xs text-steel">No recent audit logs recorded.</div>
                ) : (
                  recentAudits.map((log) => (
                    <div key={log.id} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-ink text-xs truncate">
                          {log.action}
                        </div>
                        <div className="text-[11px] text-steel truncate">
                          by {log.userDisplayName} ({log.userEmail})
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-steel whitespace-nowrap flex items-center gap-1">
                        <Clock size={11} />
                        <span>{new Date(log.timestampUtc).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </RoleGate>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  link,
}: {
  icon: any;
  label: string;
  value: string;
  note: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className="group rounded-3xl border border-line bg-white p-6 shadow-sm hover:border-gold-dark transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-raised text-gold-dark group-hover:bg-gold group-hover:text-gold-ink transition-colors">
            <Icon size={20} />
          </div>
          <ArrowRight size={14} className="text-steel opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="mt-4 text-3xl font-extrabold text-ink">{value}</div>
        <div className="text-xs font-bold uppercase tracking-wider text-steel">{label}</div>
      </div>
      <div className="mt-3 text-[11px] font-medium text-gold-dark border-t border-line/60 pt-2">{note}</div>
    </Link>
  );
}
