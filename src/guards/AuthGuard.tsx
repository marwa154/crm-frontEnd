import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { PublicPaths } from "../navigation/paths";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isRestoring } = useAuth();

  if (isRestoring) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to={PublicPaths.login} replace />;
}
