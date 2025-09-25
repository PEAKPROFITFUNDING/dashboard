import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { TicketsAdminProvider } from "../context/admin/TicketsAdminContext";
import NotFound from "../pages/OtherPage/NotFound";
import TicketDetails from "../pages/AdminPages/TicketSupport/components/TicketDetails";
const TicketSupport = lazy(() => import("../pages/AdminPages/TicketSupport"));

export default function AdminTicketSupportWrapper() {
  return (
    <TicketsAdminProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="" element={<TicketSupport />} />
          <Route path=":ticketId" element={<TicketDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TicketsAdminProvider>
  );
}
