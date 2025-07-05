import { useUser } from "../../context/UserContext";
import { isAuthenticated, isFullyAuthenticated } from "../../utils/auth";

export const RouteDebugger = () => {
  const { userName, userEmail, userRole, isUserLoaded } = useUser();
  const hasToken = isAuthenticated();
  const isFullyAuth = isFullyAuthenticated(userRole, isUserLoaded);

  if (import.meta.env.DEV) {
    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs z-50">
        <h3 className="font-bold mb-2">Route Debug Info</h3>
        <div className="space-y-1">
          <div>Has Token: {hasToken ? "Yes" : "No"}</div>
          <div>User Loaded: {isUserLoaded ? "Yes" : "No"}</div>
          <div>Fully Auth: {isFullyAuth ? "Yes" : "No"}</div>
          <div>User Name: {userName || "None"}</div>
          <div>User Role: {userRole || "None"}</div>
          <div>User Email: {userEmail || "None"}</div>
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div className="text-yellow-300">
              Status:{" "}
              {!hasToken
                ? "No Token"
                : !isUserLoaded
                ? "Loading User"
                : !userRole
                ? "No Role"
                : "Authenticated"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
