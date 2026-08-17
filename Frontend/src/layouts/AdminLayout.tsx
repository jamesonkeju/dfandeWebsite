import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LayoutDashboard, Mail, Wrench, Package, Briefcase, FileText, LogOut } from "lucide-react";
import { Logo } from "@/components/media/Logo";
import { cn } from "@/lib/utils";
import { logout, selectAuth } from "@/features/admin/auth/authSlice";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/contact", label: "Contact Submissions", icon: Mail, end: false },
  { to: "/admin/services", label: "Services", icon: Wrench, end: false },
  { to: "/admin/products", label: "Products", icon: Package, end: false },
  { to: "/admin/projects", label: "Projects", icon: Briefcase, end: false },
  { to: "/admin/content", label: "Site Content", icon: FileText, end: false },
];

export function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { displayName, roles } = useSelector(selectAuth);

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-64 flex-none flex-col border-r border-line bg-white">
        <div className="border-b border-line px-6 py-5">
          <Logo height={32} />
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gold-dark">CMS</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
                  isActive ? "bg-gold text-gold-ink" : "text-ink-soft hover:bg-paper",
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-4">
          <p className="text-sm font-bold text-ink">{displayName}</p>
          <p className="text-xs text-steel">{roles.join(", ")}</p>
          <button
            type="button"
            onClick={() => {
              dispatch(logout());
              navigate("/admin/login", { replace: true });
            }}
            className="mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-steel hover:text-danger"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
