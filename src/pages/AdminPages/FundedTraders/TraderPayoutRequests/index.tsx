import { useState, lazy, Suspense } from "react";
import {
  AdminPayoutRequest,
  dummyPayoutRequests,
} from "../../../../services/payoutService";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";

// ✅ Lazy imports
const PayoutRequestsTable = lazy(
  () => import("./components/PayoutRequestsTable")
);
const PayoutRequestDetailsModal = lazy(
  () => import("./components/PayoutRequestDetailsModal")
);

export default function TraderPayoutRequests() {
  const [requests, setRequests] =
    useState<AdminPayoutRequest[]>(dummyPayoutRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<AdminPayoutRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusChange = (id: string, status: "approved" | "declined") => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    setIsModalOpen(false);
  };

  const handleViewDetails = (req: AdminPayoutRequest) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  return (
    <>
      <PageMeta
        title="Admin - Payout Requests"
        description="Check and manage payout requests"
      />
      <PageBreadcrumb pageTitle="Payout Requests" />

      {/* Suspense fallback while loading */}
      <Suspense fallback={<div>Loading table...</div>}>
        <PayoutRequestsTable
          requests={requests}
          onViewDetails={handleViewDetails}
        />
      </Suspense>

      {isModalOpen && (
        <Suspense fallback={<div>Loading details...</div>}>
          <PayoutRequestDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            request={selectedRequest}
            onStatusChange={handleStatusChange}
          />
        </Suspense>
      )}
    </>
  );
}
