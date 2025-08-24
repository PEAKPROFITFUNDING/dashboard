import React from "react";
import { Routes, Route } from "react-router-dom";
import { AffiliatesProvider } from "../context/AffiliateContext";
import ManageAffiliates from "../pages/AdminPages/Affiliate/ManageAffiliates/ManageAffiliates";
import NewAffiliate from "../pages/AdminPages/Affiliate/ManageAffiliates/NewAffiliate/NewAffiliate";
import AffiliateDetails from "../pages/AdminPages/Affiliate/ManageAffiliates/AffiliateDetails/AffiliateDetails";
import NewRequests from "../pages/AdminPages/Affiliate/NewRequests/NewRequests";

export default function AffiliateRoutesWrapper() {
  return (
    <AffiliatesProvider>
      <Routes>
        <Route path="new-requests" element={<NewRequests />} />
        <Route path="manage-affiliates" element={<ManageAffiliates />} />
        <Route
          path="manage-affiliates/new-affiliate"
          element={<NewAffiliate />}
        />
        <Route path="manage-affiliates/:id" element={<AffiliateDetails />} />
      </Routes>
    </AffiliatesProvider>
  );
}
