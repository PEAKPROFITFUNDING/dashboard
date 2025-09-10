import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import AffiliateRequestsTable from "./components/AffiliateRequestsTable";
import RequestDetailsModal from "./components/RequestDetailsModal";
import ConfirmationModal from "./components/ConfirmationModal";
import { AffiliateRequest, Comment } from "./components/types";
import axiosInstance from "../../../../api/axiosInstance";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import FilterBar from "../../../../components/FilterBar";

// Define the API response interface
interface ApiAffiliateApplication {
  _id: string;
  userId: string;
  name: string;
  email: string;
  strategy: string;
  socialMediaLink: string;
  websiteLink: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  result: {
    data: ApiAffiliateApplication[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message: string;
}

type FilterType = "pending" | "rejected";

// Transform API data to match your existing AffiliateRequest interface
const transformApiData = (
  apiData: ApiAffiliateApplication[]
): AffiliateRequest[] => {
  return apiData.map((item) => ({
    id: parseInt(item._id.slice(-8), 16), // Convert MongoDB ObjectId to number for compatibility
    _id: item._id, // Store original MongoDB _id for API calls
    fullName: item.name,
    email: item.email,
    appliedDate: new Date(item.createdAt).toLocaleDateString(),
    status: item.status,
    strategy: item.strategy,
    socialMediaLink: item.socialMediaLink,
    websiteLink: item.websiteLink,
    userId: item.userId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    comments: [], // Initialize empty comments array
  }));
};

export default function NewRequests() {
  const [requests, setRequests] = useState<AffiliateRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<AffiliateRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("pending");
  const [counts, setCounts] = useState({
    pending: 0,
    rejected: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    confirmVariant: "success" as "success" | "error",
    onConfirm: () => {},
    loading: false,
  });

  // Filter options for FilterBar
  const filterOptions = [
    { key: "pending", label: "Pending", color: "warning" as const },
    { key: "rejected", label: "Rejected", color: "error" as const },
  ];

  const badgeConfig = [
    { key: "pending", color: "warning" as const, label: "Pending" },
    { key: "rejected", color: "error" as const, label: "Rejected" },
  ];

  // Fetch affiliate requests from API
  const fetchAffiliateRequests = async (
    pageNo: number = 1,
    status: FilterType = activeFilter
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<ApiResponse>(
        `/admin/affiliateApplications?status=${status}&pageNo=${pageNo}`
      );

      const transformedData = transformApiData(response.data.result.data);
      setRequests(transformedData);

      setPagination({
        currentPage: response.data.result.pagination.currentPage,
        totalPages: response.data.result.pagination.totalPages,
        totalItems: response.data.result.pagination.totalItems,
        hasNextPage: response.data.result.pagination.hasNextPage,
        hasPreviousPage: response.data.result.pagination.hasPreviousPage,
      });
    } catch (err) {
      console.error("Error fetching affiliate requests:", err);
      setError(
        err.response?.data?.message || "Failed to fetch affiliate requests"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch counts for all statuses
  const fetchCounts = async () => {
    try {
      const [pendingResponse, rejectedResponse] = await Promise.all([
        axiosInstance.get<ApiResponse>(
          `/admin/affiliateApplications?status=pending&pageNo=1`
        ),
        axiosInstance.get<ApiResponse>(
          `/admin/affiliateApplications?status=rejected&pageNo=1`
        ),
      ]);

      setCounts({
        pending: pendingResponse.data.result.pagination.totalItems,
        rejected: rejectedResponse.data.result.pagination.totalItems,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAffiliateRequests();
    fetchCounts();
  }, []);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    const newFilter = filter as FilterType;
    setActiveFilter(newFilter);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
    fetchAffiliateRequests(1, newFilter);
  };

  // API call to update status
  const updateAffiliateStatus = async (
    affiliateId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setConfirmationModal((prev) => ({ ...prev, loading: true }));

      await axiosInstance.put(`/admin/affiliateApplication/${affiliateId}`, {
        status: status,
      });

      // Close confirmation modal first
      setConfirmationModal((prev) => ({
        ...prev,
        isOpen: false,
        loading: false,
      }));

      // Close the details modal if open
      setIsModalOpen(false);
      setSelectedRequest(null);

      // Show success message
      alert(
        `Request ${
          status === "accepted" ? "approved" : "rejected"
        } successfully!`
      );

      // Refresh the current page data and counts
      await Promise.all([
        fetchAffiliateRequests(pagination.currentPage, activeFilter),
        fetchCounts(),
      ]);
    } catch (err) {
      console.error("Error updating status:", err);
      setConfirmationModal((prev) => ({ ...prev, loading: false }));
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  // Handle approve/reject with confirmation modal
  const handleStatusChange = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    // Find the request to get the MongoDB _id
    const request = requests.find((r) => r.id === id);
    if (!request) return;

    const isApprove = status === "approved";
    const apiStatus = isApprove ? "accepted" : "rejected";

    setConfirmationModal({
      isOpen: true,
      title: `${isApprove ? "Approve" : "Reject"} Affiliate Request`,
      message: `Are you sure you want to ${
        isApprove ? "approve" : "reject"
      } the affiliate request from ${request.fullName}?`,
      confirmText: isApprove ? "Approve" : "Reject",
      confirmVariant: isApprove ? "success" : "error",
      onConfirm: () => updateAffiliateStatus(request._id!, apiStatus),
      loading: false,
    });
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

  // Handle page change
  const handlePageChange = (pageNo: number) => {
    fetchAffiliateRequests(pageNo, activeFilter);
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    if (!confirmationModal.loading) {
      setConfirmationModal((prev) => ({ ...prev, isOpen: false }));
    }
  };

  if (loading) {
    return (
      <>
        <PageMeta
          title="Admin PeakProfit"
          description="Peak Profit Admin New Affiliate Requests Page"
        />
        <PageBreadcrumb pageTitle="New Affiliate Requests" />
        <LoadingSpinner />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="Admin PeakProfit"
          description="Peak Profit Admin New Affiliate Requests Page"
        />
        <PageBreadcrumb pageTitle="New Affiliate Requests" />
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600 dark:text-red-400">
            Error: {error}
            <button
              onClick={() => fetchAffiliateRequests()}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Admin PeakProfit"
        description="Peak Profit Admin New Affiliate Requests Page"
      />
      <PageBreadcrumb pageTitle="New Affiliate Requests" />

      <div>
        {/* Filter Bar */}
        <div className="pb-3">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            filterOptions={filterOptions}
            counts={counts}
            badgeConfig={badgeConfig}
          />
        </div>
        {requests.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-gray-400">
              No {activeFilter} affiliate requests found.
            </div>
          </div>
        ) : (
          <>
            {/* Table Component */}
            <AffiliateRequestsTable
              requests={requests}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
              currentFilter={activeFilter}
            />

            {/* API-based Pagination Info */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <div>
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages} ({pagination.totalItems} total items)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Request Details Modal */}
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
          onStatusChange={handleStatusChange}
          onFlagChange={handleFlagChange}
          onCommentAdd={handleAddComment}
          currentFilter={activeFilter}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={closeConfirmationModal}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          confirmVariant={confirmationModal.confirmVariant}
          loading={confirmationModal.loading}
        />
      </div>
    </>
  );
}
