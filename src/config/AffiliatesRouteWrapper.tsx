import React from "react";
import { Routes, Route } from "react-router-dom";
import { AffiliatesProvider } from "../context/AffiliateContext";

import NewRequests from "../pages/AdminPages/Affiliate/NewRequests/NewRequests";
import ManageAffiliates from "../pages/AdminPages/Affiliate/ManageAffiliates/ManageAffiliates";
import NewAffiliate from "../pages/AdminPages/Affiliate/ManageAffiliates/NewAffiliate/NewAffiliate";
import AffiliateDetails from "../pages/AdminPages/Affiliate/ManageAffiliates/AffiliateDetails/AffiliateDetails";
import AdminAffiliatePayoutsPanel from "../pages/AdminPages/Affiliate/PayoutsPanel/AdminAffiliatePayoutsPanel";
import AdminCommissions from "../pages/AdminPages/Affiliate/Comissions/AdminComissions";
import { AffiliatesAdminProvider } from "../context/admin/AdminAffiliatesContext";

export default function AffiliateRoutesWrapper() {
  return (
    <AffiliatesAdminProvider>
      <AffiliatesProvider>
        <Routes>
          <Route path="new-requests" element={<NewRequests />} />
          <Route path="manage-affiliates" element={<ManageAffiliates />} />
          <Route
            path="manage-affiliates/new-affiliate"
            element={<NewAffiliate />}
          />
          <Route path="manage-affiliates/:id" element={<AffiliateDetails />} />
          <Route
            path="payouts-panel"
            element={<AdminAffiliatePayoutsPanel />}
          />
          <Route path="commission-management" element={<AdminCommissions />} />
        </Routes>
      </AffiliatesProvider>
    </AffiliatesAdminProvider>
  );
}
