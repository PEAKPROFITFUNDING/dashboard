import { useEffect, useState } from "react";
import { SearchBar } from "../../../../components/SearchBar";
import { PayoutsTable } from "./components/PayoutsTable";
import axiosInstance from "../../../../api/axiosInstance";
import PayoutsOverview from "./components/PayoutsOverview";
export interface PayoutResponse {
  data: PayoutRequest[];
  counts: PayoutCounts;
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PayoutRequest {
  id: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "DENIED" | "PAID";
  requestedDate: string;
  processedDate: string | null;
  affiliate: {
    id: string;
    name: string;
    email: string;
  };
  paymentMethod: {
    type: "BANK_ACCOUNT" | "PAYPAL";
    accountNumber: string;
  };
  transactionRef?: string;
}

export interface PayoutCounts {
  pending: number;
  approved: number;
  denied: number;
  paid: number;
  total: number;
}

export type SortField =
  | "affiliate"
  | "amount"
  | "requestedDate"
  | "status"
  | "type";
export type FilterType = "all" | "PENDING" | "APPROVED" | "DENIED" | "PAID";

// Filter Options
export type FilterOption = {
  key: string;
  label: string;
  color?: "success" | "warning" | "error" | "info";
};

export interface PayoutData {
  data: PayoutRequest[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function AdminAffiliatePayoutsPanel() {
  const [payoutData, setPayoutData] = useState<PayoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get("/admin/affiliateWithdraws", {
          params: {
            pageNo: "0",
            // You can add other default params here if needed
            // status: 'PENDING', // if you want to show only pending by default
          },
        });

        setPayoutData(response.data.result);
        // console.log("Initial payout data loaded:", response.data);
      } catch (error) {
        console.error("Error fetching initial payout data:", error);
        setError(error.response?.data?.message || "Failed to load payout data");

        // Optional: Set empty data structure to prevent rendering issues
        setPayoutData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []); // Empty dependency array - runs once on component mount

  // Optional: Effect to refetch data when filters change
  useEffect(() => {
    if (statusFilter !== "all") {
      handleSearch(); // This will trigger the search with current filters
    }
  }, [statusFilter]); // Runs when statusFilter changes

  // Optional: Debounced search effect (runs search after user stops typing)
  // useEffect(() => {
  //   if (searchQuery.trim() === "") {
  //     return; // Don't search for empty queries
  //   }

  //   const debounceTimer = setTimeout(() => {
  //     handleSearch();
  //   }, 500); // 2000ms delay

  //   return () => clearTimeout(debounceTimer); // Cleanup
  // }, [searchQuery]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params: Record<string, string> = {};

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Add status filter if not "all"
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await axiosInstance.get("/admin/affiliateWithdraws", {
        params,
      });

      setPayoutData(response.data.result);
      // console.log("Search results:", response.data.result);
    } catch (error) {
      console.error("Error searching payouts:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery("");
    setStatusFilter("all");

    // Reload data without filters
    try {
      setIsLoading(true);

      const response = await axiosInstance.get("/admin/affiliateWithdraws", {
        params: { pageNo: "0" },
      });

      setPayoutData(response.data.result);
    } catch (error) {
      console.error("Error clearing search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setIsLoading(true);

      // API call to approve payout
      await axiosInstance.put(`/admin/updateWithdrawStatus/${id}`, {
        status: "APPROVED",
      });

      console.log("Payout approved:", id);

      // Update status in local state
      if (payoutData) {
        const updatedData = {
          ...payoutData,
          data: payoutData.data.map((request) =>
            request.id === id
              ? { ...request, status: "APPROVED" as const }
              : request
          ),
        };
        setPayoutData(updatedData);
      }

      // Show success message
      // toast.success("Payout approved successfully");
    } catch (error) {
      console.error("Error approving payout:", error);
      // toast.error("Failed to approve payout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsLoading(true);

      // API call to reject payout
      await axiosInstance.put(`/admin/updateWithdrawStatus/${id}`, {
        status: "DENIED",
      });

      console.log("Payout rejected:", id);

      // Update status in local state
      if (payoutData) {
        const updatedData = {
          ...payoutData,
          data: payoutData.data.map((request) =>
            request.id === id
              ? { ...request, status: "DENIED" as const }
              : request
          ),
        };
        setPayoutData(updatedData);
      }

      // Show success message
      // toast.success("Payout rejected successfully");
    } catch (error) {
      console.error("Error rejecting payout:", error);
      // toast.error("Failed to reject payout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPaid = async (id: string, transactionId: string) => {
    try {
      setIsLoading(true);

      // API call to mark payout as paid with transaction ID
      await axiosInstance.put(`/admin/updateWithdrawStatus/${id}`, {
        status: "PAID",
        transactionRef: transactionId,
      });

      console.log(
        "Payout marked as paid:",
        id,
        "Transaction ID:",
        transactionId
      );

      // Update status in local state
      if (payoutData) {
        const updatedData = {
          ...payoutData,
          data: payoutData.data.map((request) =>
            request.id === id
              ? {
                  ...request,
                  status: "PAID" as const,
                  transactionRef: transactionId,
                  processedDate: new Date().toISOString(),
                }
              : request
          ),
        };
        setPayoutData(updatedData);
      }

      // Show success message
      // toast.success("Payout marked as paid successfully");
    } catch (error) {
      console.error("Error marking payout as paid:", error);
      // toast.error("Failed to mark payout as paid");
    } finally {
      setIsLoading(false);
    }
  };

  if (!payoutData && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payout Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage affiliate payout requests and process payments
        </p>
      </div>
      {/* Payouts Overview */}
      <PayoutsOverview />

      {!payoutData && !isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Failed to load payout data
          </p>
        </div>
      ) : (
        <div>
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearch={handleSearch}
              onSearchChange={setSearchQuery}
              onClear={handleClearSearch}
              placeholder="Search affiliates by name or email..."
            />
          </div>

          <PayoutsTable
            title="Payout Requests"
            requests={payoutData?.data}
            onApprove={handleApprove}
            onReject={handleReject}
            onMarkPaid={handleMarkPaid}
            loading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
