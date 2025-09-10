import { useEffect, useState } from "react";
import { SearchBar } from "../../../../components/SearchBar";
import { Calendar, CheckCircle, DollarSign } from "lucide-react";
import { PayoutsTable } from "./components/PayoutsTable";
import { StatsCard } from "./components/StatsCard";
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

export default function AdminAffiliatePayoutsPanel() {
  const [payoutData, setPayoutData] = useState<PayoutResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData: PayoutResponse = {
      data: [
        {
          id: "68c178f90b64a1e3e238462f",
          amount: 2,
          status: "PENDING",
          requestedDate: "2025-09-10T13:11:21.523Z",
          processedDate: null,
          affiliate: {
            id: "68be6ff30aacd6d55af19134",
            name: "Soban Umar",
            email: "sobanumar0@gmail.com",
          },
          paymentMethod: {
            type: "BANK_ACCOUNT",
            accountNumber: "1223",
          },
        },
        {
          id: "68c1784a0b64a1e3e2384606",
          amount: 20,
          status: "PENDING",
          requestedDate: "2025-09-10T13:08:26.585Z",
          processedDate: null,
          affiliate: {
            id: "68be6ff30aacd6d55af19134",
            name: "Soban Umar",
            email: "sobanumar0@gmail.com",
          },
          paymentMethod: {
            type: "PAYPAL",
            accountNumber: "sobanumar0@gmail.com",
          },
        },
        {
          id: "68c177960b64a1e3e23845f7",
          amount: 20,
          status: "APPROVED",
          requestedDate: "2025-09-10T13:05:26.432Z",
          processedDate: null,
          affiliate: {
            id: "68be6ff30aacd6d55af19134",
            name: "Soban Umar",
            email: "sobanumar0@gmail.com",
          },
          paymentMethod: {
            type: "PAYPAL",
            accountNumber: "sobanumar0@gmail.com",
          },
        },
      ],
      counts: {
        pending: 8,
        approved: 1,
        denied: 0,
        paid: 3,
        total: 12,
      },
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalItems: 12,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      },
    };

    setPayoutData(mockData);
    setLoading(false);
  }, []);

  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching for:", searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleApprove = async (id: string) => {
    try {
      // API call to approve
      console.log("Approving payout:", id);
      // Update status in state
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
    } catch (error) {
      console.error("Error approving payout:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      // API call to reject
      console.log("Rejecting payout:", id);
      // Update status in state
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
    } catch (error) {
      console.error("Error rejecting payout:", error);
    }
  };

  const handleMarkPaid = async (id: string, transactionId: string) => {
    try {
      // API call to mark as paid with transaction ID
      console.log("Marking as paid:", id, "Transaction ID:", transactionId);
      // Update status in state
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
    } catch (error) {
      console.error("Error marking payout as paid:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!payoutData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Failed to load payout data
        </p>
      </div>
    );
  }

  const totalPendingAmount = payoutData.data
    .filter((r) => r.status === "PENDING")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalApprovedAmount = payoutData.data
    .filter((r) => r.status === "APPROVED")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalPaidAmount = payoutData.data
    .filter((r) => r.status === "PAID")
    .reduce((sum, r) => sum + r.amount, 0);

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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Pending Requests"
          value={`${
            payoutData.counts.pending
          } (${totalPendingAmount.toLocaleString()})`}
          subtitle={`${payoutData.counts.pending} requests awaiting review`}
          icon={<Calendar className="w-8 h-8" />}
        />
        <StatsCard
          title="Approved (Unpaid)"
          value={`${
            payoutData.counts.approved
          } (${totalApprovedAmount.toLocaleString()})`}
          subtitle={`${payoutData.counts.approved} requests ready for payment`}
          icon={<CheckCircle className="w-8 h-8" />}
        />
        <StatsCard
          title="Paid Requests"
          value={`${
            payoutData.counts.paid
          } (${totalPaidAmount.toLocaleString()})`}
          subtitle="Successfully processed payments"
          icon={<DollarSign className="w-8 h-8" />}
        />
        <StatsCard
          title="Total Requests"
          value={payoutData.counts.total}
          subtitle="All payout requests"
          icon={<DollarSign className="w-8 h-8" />}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search affiliates by name or email..."
        />
      </div>

      {/* Payouts Table */}
      <PayoutsTable
        title="Payout Requests"
        requests={payoutData.data}
        onApprove={handleApprove}
        onReject={handleReject}
        onMarkPaid={handleMarkPaid}
      />
    </div>
  );
}
