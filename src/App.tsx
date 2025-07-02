import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import PublicRoute from "./components/auth/PublicRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";
import ChangePassword from "./pages/AuthPages/ChangePassword";
import { useUser } from "./context/UserContext";
import useFetchUser from "./hooks/useFetchUser";
import UsersList from "./pages/AdminPages/UsersList/UsersList";
import ContactMessages from "./pages/AdminPages/ContactMessages/ContactMessages";
import MessageDetails from "./pages/AdminPages/ContactMessages/MessageDetails";

// Create a separate component for the routes
const AppRoutes = () => {
  const { loading } = useFetchUser();
  const { userRole } = useUser();

  if (loading) {
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
        <Route
          path="/login"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Private Routes */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Common Routes */}
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />

          {/* Role-based Routes */}
          {userRole === "Admin" ? (
            <>
              <Route index element={<Navigate to="/users-list" replace />} />
              <Route path="/users-list" element={<UsersList />} />
              <Route path="/contact-messages" element={<ContactMessages />} />
              <Route
                path="/contact-messages/:id"
                element={<MessageDetails />}
              />
            </>
          ) : (
            <>
              <Route index element={<Home />} />
              <Route path="/challenges" element={<Home />} />
            </>
          )}

          {/* UI Elements Routes */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts Routes */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />

          {/* Forms Routes */}
          <Route path="/form-elements" element={<FormElements />} />

          {/* Tables Routes */}
          <Route path="/basic-tables" element={<BasicTables />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

// Main App component
export default function App() {
  return <AppRoutes />;
}
