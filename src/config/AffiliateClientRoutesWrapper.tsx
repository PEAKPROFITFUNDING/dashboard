import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Lazy load pages
const Account = lazy(
  () => import("../pages/ClientPages/Affiliate/Account/Account")
);
const Earnings = lazy(
  () => import("../pages/ClientPages/Affiliate/Earnings/Earnings")
);
const Withdrawals = lazy(
  () => import("../pages/ClientPages/Affiliate/Withdrawals/Wathdrawals")
);
const TierStatus = lazy(
  () => import("../pages/ClientPages/Affiliate/TierStatus/TierStatus")
);
const BecomeAffiliate = lazy(
  () => import("../pages/ClientPages/Affiliate/BecomeAffiliate/BecomeAffiliate")
);

export default function AffiliateClientRoutesWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="account" element={<Account />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="withdrawal" element={<Withdrawals />} />
        <Route path="tier" element={<TierStatus />} />
        <Route path="become-affiliate" element={<BecomeAffiliate />} />
      </Routes>
    </Suspense>
  );
}
