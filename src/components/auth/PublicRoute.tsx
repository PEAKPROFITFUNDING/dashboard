import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { isFullyAuthenticated } from "../../utils/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { userRole, isUserLoaded } = useUser();

  // Show loading only if we're still fetching user data
  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is fully authenticated, redirect to appropriate dashboard
  if (isFullyAuthenticated(userRole, isUserLoaded)) {
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show the public route
  return <>{children}</>;
}
