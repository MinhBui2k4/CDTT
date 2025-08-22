import { Navigate, Outlet } from "react-router-dom";
import type { JSX } from "react";

export default function ProtectedRoute(): JSX.Element {
  const token = localStorage.getItem("authToken");
  const roles = localStorage.getItem("userRoles");
  const parsedRoles = roles ? JSON.parse(roles) : [];

  if (!token || !parsedRoles.includes("ADMIN")) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}