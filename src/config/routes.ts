import { lazy } from "react";
import AdminRedirect from "../components/common/AdminRedirect";
import AffiliateRoutesWrapper from "./AffiliatesRouteWrapper";
import TraderPayoutRequests from "../pages/AdminPages/FundedTraders/TraderPayoutRequests";
import AffiliateClientRoutesWrapper from "./AffiliateClientRoutesWrapper";

// Lazy load components for better performance
const SignIn = lazy(() => import("../pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("../pages/AuthPages/SignUp"));
const ForgotPassword = lazy(() => import("../pages/AuthPages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/AuthPages/ResetPassword"));
const ChangePassword = lazy(() => import("../pages/AuthPages/ChangePassword"));
const Home = lazy(() => import("../pages/Dashboard/Home"));
const UserProfiles = lazy(() => import("../pages/UserProfiles"));
const Calendar = lazy(() => import("../pages/Calendar"));
const Blank = lazy(() => import("../pages/Blank"));
const UsersList = lazy(() => import("../pages/AdminPages/UsersList/UsersList"));
const ContactMessages = lazy(
  () => import("../pages/AdminPages/ContactMessages/ContactMessages")
);
const MessageDetails = lazy(
  () => import("../pages/AdminPages/ContactMessages/MessageDetails")
);
const NotFound = lazy(() => import("../pages/OtherPage/NotFound"));
const PayoutsPage = lazy(
  () => import("../pages/ClientPages/Payouts/PayoutsPage")
);
const FundedTradersPage = lazy(
  () => import("../pages/AdminPages/FundedTraders/FundedTradersPage")
);

// UI Elements
const Alerts = lazy(() => import("../pages/UiElements/Alerts"));
const Avatars = lazy(() => import("../pages/UiElements/Avatars"));
const Badges = lazy(() => import("../pages/UiElements/Badges"));
const Buttons = lazy(() => import("../pages/UiElements/Buttons"));
const Images = lazy(() => import("../pages/UiElements/Images"));
const Videos = lazy(() => import("../pages/UiElements/Videos"));

// Charts
const LineChart = lazy(() => import("../pages/Charts/LineChart"));
const BarChart = lazy(() => import("../pages/Charts/BarChart"));

// Forms & Tables
const FormElements = lazy(() => import("../pages/Forms/FormElements"));
const BasicTables = lazy(() => import("../pages/Tables/BasicTables"));

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  isPublic?: boolean;
  isIndex?: boolean;
  roles?: string[];
}

// Public Routes
export const publicRoutes: RouteConfig[] = [
  { path: "/login", element: SignIn, isPublic: true },
  { path: "/signup", element: SignUp, isPublic: true },
  { path: "/forgot-password", element: ForgotPassword, isPublic: true },
  { path: "/reset-password", element: ResetPassword, isPublic: true },
  { path: "/change-password", element: ChangePassword, isPublic: true },
];

// Common Routes (accessible by both Admin & User after login)
export const commonRoutes: RouteConfig[] = [
  { path: "/profile", element: UserProfiles },
  { path: "/calendar", element: Calendar },
  { path: "/blank", element: Blank },
];

// Admin-only Routes
export const adminRoutes: RouteConfig[] = [
  { path: "/users-list", element: UsersList },
  { path: "/contact-messages", element: ContactMessages },
  { path: "/contact-messages/:id", element: MessageDetails },
  { path: "/affiliate/*", element: AffiliateRoutesWrapper },
  { path: "/funded-traders", element: FundedTradersPage, roles: ["Admin"] },
  { path: "/trader-payout-requests", element: TraderPayoutRequests },
];
// User-only Routes
export const userRoutes: RouteConfig[] = [
  { path: "/challenges", element: Home, roles: ["User"] },
  { path: "/payouts", element: PayoutsPage, roles: ["User"] },
  { path: "/affiliate/*", element: AffiliateClientRoutesWrapper },
];

// UI Routes
export const uiRoutes: RouteConfig[] = [
  { path: "/alerts", element: Alerts },
  { path: "/avatars", element: Avatars },
  { path: "/badge", element: Badges },
  { path: "/buttons", element: Buttons },
  { path: "/images", element: Images },
  { path: "/videos", element: Videos },
];

// Chart Routes
export const chartRoutes: RouteConfig[] = [
  { path: "/line-chart", element: LineChart },
  { path: "/bar-chart", element: BarChart },
];

// Form Routes
export const formRoutes: RouteConfig[] = [
  { path: "/form-elements", element: FormElements },
];

// Table Routes
export const tableRoutes: RouteConfig[] = [
  { path: "/basic-tables", element: BasicTables },
];

// Fallback Route
export const fallbackRoute: RouteConfig = {
  path: "*",
  element: NotFound,
};

// Helper function to get routes based on user role
export const getRoutesForRole = (userRole: string | null): RouteConfig[] => {
  const allRoutes = [
    ...commonRoutes,
    ...uiRoutes,
    ...chartRoutes,
    ...formRoutes,
    ...tableRoutes,
  ];

  if (userRole === "Admin") {
    allRoutes.push(...adminRoutes);
  } else if (userRole === "User") {
    allRoutes.push(...userRoutes);
  }

  return allRoutes;
};

// Helper function to get index route based on user role
export const getIndexRoute = (userRole: string | null): RouteConfig => {
  if (userRole === "Admin") {
    return {
      path: "/",
      element: AdminRedirect,
      isIndex: true,
    };
  } else {
    return { path: "/", element: Home, isIndex: true };
  }
};
