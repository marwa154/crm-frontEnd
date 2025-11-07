import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PublicPaths } from "../navigation/paths";

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  return user?.role === "admin" ? children : <Navigate to={PublicPaths.accessDenied} replace />;
}
