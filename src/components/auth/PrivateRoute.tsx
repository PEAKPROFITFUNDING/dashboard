import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { isFullyAuthenticated } from "../../utils/auth";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { userRole, isUserLoaded } = useUser();

  // Show loading only if we're still fetching user data
  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Check if user is fully authenticated (has token, user data, and role)
  if (isFullyAuthenticated(userRole, isUserLoaded)) {
    return <>{children}</>;
  }

  // User is not authenticated, redirect to login
  return <Navigate to="/login" replace />;
}
