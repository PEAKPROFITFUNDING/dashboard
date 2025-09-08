import { useState, useEffect } from "react";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import PageMeta from "../../../../components/common/PageMeta";
import AffiliateRequestsTable from "./components/AffiliateRequestsTable";
import RequestDetailsModal from "./components/RequestDetailsModal";
import { AffiliateRequest, Comment } from "./components/types";
import axiosInstance from "../../../../api/axiosInstance";
import LoadingSpinner from "../../../../components/LoadingSpinner";

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

// Transform API data to match your existing AffiliateRequest interface
const transformApiData = (
  apiData: ApiAffiliateApplication[]
): AffiliateRequest[] => {
  return apiData.map((item) => ({
    id: parseInt(item._id.slice(-8), 16), // Convert MongoDB ObjectId to number for compatibility
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Fetch affiliate requests from API
  const fetchAffiliateRequests = async (pageNo: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get<ApiResponse>(
        `/admin/affiliateApplications?status=pending&pageNo=${pageNo}`
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

  // Load data on component mount
  useEffect(() => {
    fetchAffiliateRequests();
  }, []);

  // Handle approve/reject with API call
  const handleStatusChange = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      // Find the request to get the MongoDB _id
      const request = requests.find((r) => r.id === id);
      if (!request) return;

      // Convert back to MongoDB ObjectId format (you'll need to store the original _id)
      // For now, we'll update locally and you can implement the API call

      // TODO: Implement API call to update status
      // await axiosInstance.put(`/admin/affiliateApplications/${originalId}`, { status });

      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );

      // Optionally refetch data to ensure consistency
      // fetchAffiliateRequests(pagination.currentPage);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
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
    fetchAffiliateRequests(pageNo);
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
        {requests.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600 dark:text-gray-400">
              No pending affiliate requests found.
            </div>
          </div>
        ) : (
          <>
            {/* Table Component */}
            <AffiliateRequestsTable
              requests={requests}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
            />

            {/* API-based Pagination Info */}
            {pagination.totalPages > 1 && (
              <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <div>
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages}({pagination.totalItems} total items)
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
