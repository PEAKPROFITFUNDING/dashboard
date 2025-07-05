import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useMemo } from "react";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PublicRoute from "./components/auth/PublicRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import { useUser } from "./context/UserContext";
import useFetchUser from "./hooks/useFetchUser";
import { LazyRoute } from "./components/common/LazyRoute";
import { RouteDebugger } from "./components/common/RouteDebugger";
import {
  publicRoutes,
  getRoutesForRole,
  getIndexRoute,
  fallbackRoute,
} from "./config/routes";

// Initialize user data fetching
const AppInitializer = () => {
  useFetchUser();
  return null;
};

// Create a separate component for the routes
const AppRoutes = () => {
  const { userRole, isUserLoaded } = useUser();

  // Memoize route calculations to prevent unnecessary re-renders
  const { indexRoute, roleBasedRoutes } = useMemo(() => {
    if (!isUserLoaded) {
      return { indexRoute: null, roleBasedRoutes: [] };
    }

    const indexRoute = getIndexRoute(userRole);
    const roleBasedRoutes = getRoutesForRole(userRole);

    return { indexRoute, roleBasedRoutes };
  }, [userRole, isUserLoaded]);

  // Don't render routes until user data is loaded
  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicRoute>
                <LazyRoute>
                  <route.element />
                </LazyRoute>
              </PublicRoute>
            }
          />
        ))}

        {/* Private Routes */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Index Route */}
          {indexRoute && (
            <Route
              index
              element={
                <LazyRoute>
                  <indexRoute.element />
                </LazyRoute>
              }
            />
          )}

          {/* Role-based Routes */}
          {roleBasedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <LazyRoute>
                  <route.element />
                </LazyRoute>
              }
            />
          ))}
        </Route>

        {/* Fallback Route */}
        <Route
          path={fallbackRoute.path}
          element={
            <LazyRoute>
              <fallbackRoute.element />
            </LazyRoute>
          }
        />
      </Routes>
      {/* {import.meta.env.DEV && <RouteDebugger />} */}
    </Router>
  );
};

// Main App component
export default function App() {
  return (
    <>
      <AppInitializer />
      <AppRoutes />
    </>
  );
}
