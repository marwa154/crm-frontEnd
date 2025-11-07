import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PrivatePaths } from "../navigation/paths"; 

export default function GuestGuard({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isRestoring } = useAuth();
  if (isRestoring) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={PrivatePaths.dashboard} replace />;
  }
  return children;
}
