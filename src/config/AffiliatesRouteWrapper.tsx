import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AffiliatesProvider } from "../context/AffiliateContext";
import { AffiliatesAdminProvider } from "../context/admin/AdminAffiliatesContext";
import LoadingSpinner from "../components/LoadingSpinner";

// ✅ Lazy-loaded pages
const NewRequests = lazy(
  () => import("../pages/AdminPages/Affiliate/NewRequests/NewRequests")
);
const ManageAffiliates = lazy(
  () =>
    import("../pages/AdminPages/Affiliate/ManageAffiliates/ManageAffiliates")
);
const NewAffiliate = lazy(
  () =>
    import(
      "../pages/AdminPages/Affiliate/ManageAffiliates/NewAffiliate/NewAffiliate"
    )
);
const AffiliateDetails = lazy(
  () =>
    import(
      "../pages/AdminPages/Affiliate/ManageAffiliates/AffiliateDetails/AffiliateDetails"
    )
);
const AdminAffiliatePayoutsPanel = lazy(
  () =>
    import(
      "../pages/AdminPages/Affiliate/PayoutsPanel/AdminAffiliatePayoutsPanel"
    )
);
const AdminCommissions = lazy(
  () => import("../pages/AdminPages/Affiliate/Comissions/AdminComissions")
);

export default function AffiliateRoutesWrapper() {
  return (
    <AffiliatesAdminProvider>
      <AffiliatesProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="new-requests" element={<NewRequests />} />
            <Route path="manage-affiliates" element={<ManageAffiliates />} />
            <Route
              path="manage-affiliates/new-affiliate"
              element={<NewAffiliate />}
            />
            <Route
              path="manage-affiliates/:id"
              element={<AffiliateDetails />}
            />
            <Route
              path="payouts-panel"
              element={<AdminAffiliatePayoutsPanel />}
            />
            <Route
              path="commission-management"
              element={<AdminCommissions />}
            />
          </Routes>
        </Suspense>
      </AffiliatesProvider>
    </AffiliatesAdminProvider>
  );
}
