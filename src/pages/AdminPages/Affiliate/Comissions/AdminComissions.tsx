import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import {
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";
import { StatsCard } from "./components/StatsCard";
import { CommissionsTable } from "../../../../components/affiliates/ComissionsTable";

// Types
export type SortField =
  | "affiliate"
  | "customer"
  | "amount"
  | "date"
  | "status"
  | "type"
  | "orderId";
export type FilterType = "all" | "SIGNUP" | "PURCHASE";
export type CommissionType = "SIGNUP" | "PURCHASE";

export interface Commission {
  id: string;
  type: CommissionType;
  amount: number;
  commissionPercentage: number;
  affiliateTier: string;
  earnedAt: string;
  referralCode: string;
  affiliate: {
    id: string;
    name: string;
    email: string;
  };
  referredUser: {
    id: string;
    name: string;
    email: string;
  };
  challenge?: {
    id: string;
    name: string;
    price: number;
  };
  originalAmount?: number;
  formattedOriginalAmount?: string;
  purchaseDate?: string;
}

interface AdminStats {
  totalLifetimeCommissions: number;
  thisMonthCommissions: number;
  pendingCommissions: {
    count: number;
    amount: number;
  };
  approvedCommissions: {
    count: number;
    amount: number;
  };
  paidCommissions: {
    count: number;
    amount: number;
  };
}

interface CommissionsResponse {
  result: {
    data: Commission[];
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

export default function AdminCommissions() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const fetchCommissions = useCallback(async () => {
    try {
      setLoading(true);
      const url = `/admin/commissions?page=${currentPage}&type=${typeFilter}`;
      const response = await axiosInstance.get<CommissionsResponse>(url);
      const commissionData = response.data.result.data;

      setCommissions(commissionData);
      setPagination(response.data.result.pagination);

      // Fetch all commissions to calculate counts for the filter bar
      const allCommissionsResponse =
        await axiosInstance.get<CommissionsResponse>(
          `/admin/commissions?page=1&type=`
        );
      const allCommissions = allCommissionsResponse.data.result.data;
      const countsData = allCommissions.reduce(
        (acc: Record<string, number>, curr) => {
          const type = curr.type.toUpperCase();
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        { all: allCommissionsResponse.data.result.pagination.totalItems }
      );
      setCounts(countsData);
    } catch (err) {
      console.error("Error fetching commissions:", err);
      setError("Failed to load commission history.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, typeFilter]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const response = await axiosInstance.get("/admin/stats");
        setStats(response.data.result);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Failed to load admin statistics");
      }
    };

    fetchAdminStats();
    fetchCommissions();
  }, [fetchCommissions]);

  const handleFilterChange = (filter: string) => {
    if (filter === "all") {
      setTypeFilter("");
    } else {
      setTypeFilter(filter);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCommissions();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchCommissions();
  };

  const filteredAndSearchedCommissions = commissions.filter((commission) =>
    (commission?.affiliate?.name || commission?.referredUser?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <>
        <PageMeta
          title="Admin - Commission Management"
          description="Admin dashboard for managing affiliate commissions"
        />
        <PageBreadcrumb pageTitle={`Commission Management`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading commission statistics...
            </p>
          </div>
        </div>
      </>
    );
  }

  // if (error) {
  //   return (
  //     <>
  //       <PageMeta
  //         title="Admin - Commission Management"
  //         description="Admin dashboard for managing affiliate commissions"
  //       />
  //       <PageBreadcrumb pageTitle={`Commission Management`} />
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-center">
  //           <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
  //           <button
  //             onClick={() => window.location.reload()}
  //             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  //           >
  //             Retry
  //           </button>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  // if (!stats) return null;

  return (
    <>
      <PageMeta
        title="Admin - Commission Management"
        description="Admin dashboard for managing affiliate commissions"
      />
      <PageBreadcrumb pageTitle={`Commission Management`} />

      <div className="space-y-8">
        {/* Overview Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Lifetime"
            value={`$${stats.totalLifetimeCommissions.toFixed(2)}`}
            subtitle="All-time commissions earned"
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="This Month"
            value={`$${stats.thisMonthCommissions.toFixed(2)}`}
            subtitle="Commissions earned this month"
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Pending"
            value={`$${stats.pendingCommissions.amount.toFixed(2)}`}
            subtitle={`${stats.pendingCommissions.count} awaiting approval`}
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
          />
          <StatsCard
            title="Approved"
            value={`$${stats.approvedCommissions.amount.toFixed(2)}`}
            subtitle={`${stats.approvedCommissions.count} ready for payout`}
            icon={<CheckCircle className="w-6 h-6" />}
            color="purple"
          />
          <StatsCard
            title="Paid"
            value={`$${stats.paidCommissions.amount.toFixed(2)}`}
            subtitle={`${stats.paidCommissions.count} completed payments`}
            icon={<Users className="w-6 h-6" />}
            color="gray"
          />
        </div> */}

        {/* Commissions Table */}
        <CommissionsTable
          commissions={filteredAndSearchedCommissions}
          pagination={pagination}
          onPageChange={setCurrentPage}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          activeFilter={typeFilter}
          searchQuery={searchQuery}
          counts={counts}
        />
      </div>
    </>
  );
}
