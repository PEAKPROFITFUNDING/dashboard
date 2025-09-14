import React from "react";
import { Routes, Route } from "react-router-dom";
import { AffiliateProfileProvider } from "../context/user/UserAffiliatesContext";
import Account from "../pages/ClientPages/Affiliate/Account/Account";
import Earnings from "../pages/ClientPages/Affiliate/Earnings/Earnings";
import Withdrawals from "../pages/ClientPages/Affiliate/Withdrawals/Wathdrawals";
import TierStatus from "../pages/ClientPages/Affiliate/TierStatus/TierStatus";
import BecomeAffiliate from "../pages/ClientPages/Affiliate/BecomeAffiliate/BecomeAffiliate";

export default function AffiliateClientRoutesWrapper() {
  return (
    
      <Routes>
        <Route path="account" element={<Account />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="withdrawal" element={<Withdrawals />} />
        <Route path="tier" element={<TierStatus />} />
        <Route path="become-affiliate" element={<BecomeAffiliate />} />
      </Routes>
  );
}
