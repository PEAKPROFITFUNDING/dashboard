import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { KYCAdminProvider } from "../context/admin/KYCAdminContext";
const UsersKYC = lazy(() => import("../pages/AdminPages/KYC/UsersKYC"));
const KYCDetailsPage = lazy(
  () => import("../pages/AdminPages/KYC/KYCDetailsPage/KYCDetailsPage")
);

export default function AdminKYCWrapper() {
  return (
    <KYCAdminProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="applications" element={<UsersKYC />} />
          <Route path=":id" element={<KYCDetailsPage />} />
        </Routes>
      </Suspense>
    </KYCAdminProvider>
  );
}
