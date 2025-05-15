
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, isLoading, session } = useAuth();
  const location = useLocation();

  // Show a more user-friendly loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading your session...</span>
      </div>
    );
  }

  // Debug logging to help diagnose auth issues
  console.log("Auth state in ProtectedRoute:", { 
    hasUser: !!user, 
    hasSession: !!session,
    pathname: location.pathname 
  });

  if (!user || !session) {
    // Redirect to login if not authenticated, but preserve the intended destination
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
