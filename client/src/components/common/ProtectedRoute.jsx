import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, needsUsername } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Redirect to username setup if profile is not complete
  if (needsUsername) {
    return <Navigate to="/setup-username" />;
  }

  return <div className="pb-20 md:pb-0">{children}</div>;
};

export default ProtectedRoute;
