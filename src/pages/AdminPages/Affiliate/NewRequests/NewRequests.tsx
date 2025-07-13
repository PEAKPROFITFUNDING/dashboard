import { useState } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import AffiliateRequestsTable from "./components/AffiliateRequestsTable";
import RequestDetailsModal from "./components/RequestDetailsModal";
import { AffiliateRequest, Comment, dummyRequests } from "./components/types";

export default function NewRequests() {
  const [requests, setRequests] = useState<AffiliateRequest[]>(dummyRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<AffiliateRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle approve/reject
  const handleStatusChange = (id: number, status: "approved" | "rejected") => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  };

  // Handle modal open
  const handleViewDetails = (request: AffiliateRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Handle comment submission
  const handleAddComment = (id: number, comment: Comment) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              comments: [...(request.comments || []), comment],
            }
          : request
      )
    );

    setSelectedRequest((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            comments: [...(prev.comments || []), comment],
          }
        : prev
    );
  };

  // Handle flag change
  const handleFlagChange = (id: number, flag: string) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, flag: flag || undefined } : request
      )
    );
    setSelectedRequest((prev) =>
      prev && prev.id === id ? { ...prev, flag: flag || undefined } : prev
    );
  };

  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Admin New Affiliate Requests Page"
      />
      <PageBreadcrumb pageTitle="New Affiliate Requests" />

      <div>
        {/* Table Component */}
        <AffiliateRequestsTable
          requests={requests}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
        />

        {/* Modal Component */}
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
          onStatusChange={handleStatusChange}
          onFlagChange={handleFlagChange}
          onCommentAdd={handleAddComment}
        />
      </div>
    </>
  );
}
