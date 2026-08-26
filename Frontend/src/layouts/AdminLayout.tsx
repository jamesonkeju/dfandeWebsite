import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Mail,
  Wrench,
  Package,
  Briefcase,
  FileText,
  Users,
  Activity,
  LogOut,
  Lock,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/media/Logo";
import { cn } from "@/lib/utils";
import { logout, selectAuth, selectUserRoles } from "@/features/admin/auth/authSlice";
import { ChangePasswordModal } from "@/features/admin/profile/ChangePasswordModal";

interface NavItemConfig {
  to: string;
  label: string;
  icon: any;
  end?: boolean;
  allowedRoles: string[];
}

const ALL_NAV_ITEMS: NavItemConfig[] = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
    allowedRoles: ["SuperAdmin", "ContentManager", "InquiryViewer", "Administrator", "Editor"],
  },
  {
    to: "/admin/contact",
    label: "Contact Inquiries",
    icon: Mail,
    allowedRoles: ["SuperAdmin", "ContentManager", "InquiryViewer", "Administrator", "Editor"],
  },
  {
    to: "/admin/services",
    label: "Services Catalog",
    icon: Wrench,
    allowedRoles: ["SuperAdmin", "ContentManager", "Administrator", "Editor"],
  },
  {
    to: "/admin/products",
    label: "Products Catalog",
    icon: Package,
    allowedRoles: ["SuperAdmin", "ContentManager", "Administrator", "Editor"],
  },
  {
    to: "/admin/projects",
    label: "Projects & Track Record",
    icon: Briefcase,
    allowedRoles: ["SuperAdmin", "ContentManager", "Administrator", "Editor"],
  },
  {
    to: "/admin/content",
    label: "Site Copy & Content",
    icon: FileText,
    allowedRoles: ["SuperAdmin", "ContentManager", "Administrator", "Editor"],
  },
  {
    to: "/admin/analytics",
    label: "Site Analytics & Traffic",
    icon: Activity,
    allowedRoles: ["SuperAdmin", "ContentManager", "Administrator", "Editor"],
  },
  {
    to: "/admin/users",
    label: "User Management",
    icon: Users,
    allowedRoles: ["SuperAdmin"],
  },
  {
    to: "/admin/audit-logs",
    label: "System Audit Trail",
    icon: ShieldCheck,
    allowedRoles: ["SuperAdmin"],
  },
];

export function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { displayName, email } = useSelector(selectAuth);
  const userRoles = useSelector(selectUserRoles);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Admin Portal | Divine Flame and Energy International Limited";
  }, [location.pathname]);

  const isSuperAdmin = userRoles.some((r) => r.toLowerCase() === "superadmin");
  const isContentMgr = userRoles.some((r) => ["contentmanager", "editor"].includes(r.toLowerCase()));
  const primaryRole = userRoles[0] || "User";

  const roleBadgeClass = isSuperAdmin
    ? "bg-purple-100 text-purple-800 border-purple-200"
    : isContentMgr
    ? "bg-gold/15 text-gold-dark border-gold/30"
    : "bg-blue-100 text-blue-800 border-blue-200";

  const visibleNavItems = ALL_NAV_ITEMS.filter((item) =>
    item.allowedRoles.some((allowed) =>
      userRoles.some((uRole) => uRole.toLowerCase() === allowed.toLowerCase()),
    ),
  );

  const currentNav = ALL_NAV_ITEMS.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  );

  return (
    <div className="flex min-h-screen bg-paper font-sans">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 flex-none flex-col border-r border-line bg-void text-white shadow-xl">
        {/* LOGO AREA */}
        <div className="border-b border-void-line px-6 py-6 flex items-center justify-between">
          <Link to="/admin" className="flex flex-col">
            <Logo height={32} />
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
              <ShieldCheck size={12} />
              <span>Admin Management Hub</span>
            </div>
          </Link>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-bold font-mono uppercase tracking-widest text-void-soft mb-2">
              Core Operations
            </p>
            <nav className="space-y-1">
              {visibleNavItems
                .filter((i) => !["User Management", "System Audit Trail"].includes(i.label))
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
                        isActive
                          ? "bg-gold text-gold-ink shadow-sm"
                          : "text-void-soft hover:bg-void-raised hover:text-white",
                      )
                    }
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
            </nav>
          </div>

          {/* GOVERNANCE SECTION (SUPERADMIN) */}
          {visibleNavItems.some((i) => ["User Management", "System Audit Trail"].includes(i.label)) && (
            <div>
              <p className="px-3 text-[10px] font-bold font-mono uppercase tracking-widest text-void-soft mb-2">
                Governance &amp; Security
              </p>
              <nav className="space-y-1">
                {visibleNavItems
                  .filter((i) => ["User Management", "System Audit Trail"].includes(i.label))
                  .map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
                          isActive
                            ? "bg-gold text-gold-ink shadow-sm"
                            : "text-void-soft hover:bg-void-raised hover:text-white",
                        )
                      }
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
              </nav>
            </div>
          )}
        </div>

        {/* USER PROFILE & LOGOUT FOOTER */}
        <div className="border-t border-void-line p-5 bg-void-raised/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gold text-gold-ink font-bold text-sm shadow-xs">
              {(displayName || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{displayName || "Administrator"}</p>
              <p className="truncate text-[10px] font-mono text-void-soft">{email || "admin@dfande.local"}</p>
              <div className="mt-1">
                <span className="inline-block rounded-full bg-gold/20 border border-gold/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold">
                  {primaryRole}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-void-line/60">
            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-void-line bg-void px-2.5 py-2 text-[11px] font-bold text-void-soft hover:border-gold hover:text-white transition-colors cursor-pointer"
            >
              <Lock size={12} />
              <span>Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                dispatch(logout());
                navigate("/admin/login", { replace: true });
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-void-line bg-void px-2.5 py-2 text-[11px] font-bold text-void-soft hover:border-danger hover:text-danger transition-colors cursor-pointer"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* TOP EXECUTIVE HEADER BAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-6 backdrop-blur-md">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs">
            <Link to="/admin" className="font-bold text-steel hover:text-ink">
              Admin Portal
            </Link>
            {currentNav && currentNav.label !== "Dashboard" && (
              <>
                <ChevronRight size={14} className="text-steel" />
                <span className="font-bold text-ink">{currentNav.label}</span>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper-raised px-3.5 py-1.5 text-xs font-bold text-ink hover:border-gold-dark hover:text-gold-dark transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink size={12} />
            </a>

            <span
              className={`rounded-full border px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider ${roleBadgeClass}`}
            >
              Role: {primaryRole}
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
}
