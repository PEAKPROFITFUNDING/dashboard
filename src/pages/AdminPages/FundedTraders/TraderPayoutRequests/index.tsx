import { useState } from "react";
import {
  AdminPayoutRequest,
  dummyPayoutRequests,
} from "../../../../services/payoutService";
import PayoutRequestsTable from "./components/PayoutRequestsTable";
import PayoutRequestDetailsModal from "./components/PayoutRequestDetailsModal";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";

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

      <PayoutRequestsTable
        requests={requests}
        onViewDetails={handleViewDetails}
      />

      <PayoutRequestDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
