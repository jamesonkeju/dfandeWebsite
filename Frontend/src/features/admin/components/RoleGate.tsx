import React from "react";
import { useSelector } from "react-redux";
import { selectUserRoles } from "@/features/admin/auth/authSlice";

interface RoleGateProps {
  allowedRoles: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGate({ allowedRoles, fallback = null, children }: RoleGateProps) {
  const userRoles = useSelector(selectUserRoles);

  const hasAccess = userRoles.some((role) =>
    allowedRoles.map((r) => r.toLowerCase()).includes(role.toLowerCase()),
  );

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
