import type { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserRoles } from "./auth/authSlice";
import { AlertCircle, ArrowLeft } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRoles = useSelector(selectUserRoles);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = userRoles.some((role) =>
      allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()),
    );

    if (!hasRole) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-ink">Access Restricted</h2>
          <p className="mt-2 max-w-md text-xs text-steel">
            Your current assigned role ({userRoles.join(", ") || "None"}) does not have authorization to view or manage this administrative resource.
          </p>
          <Link
            to="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gold-ink hover:bg-gold-light transition-all"
          >
            <ArrowLeft size={14} />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      );
    }
  }

  return <>{children}</>;
}
