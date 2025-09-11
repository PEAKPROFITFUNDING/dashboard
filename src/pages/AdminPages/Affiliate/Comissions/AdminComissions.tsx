import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import {
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  UserCheck,
  ShoppingCart,
} from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";
import { CommissionsTable } from "../../../../components/affiliates/ComissionsTable";
import CommissionsChart from "../../../../components/affiliates/CommissionsChart";
import { PayoutStatsCard } from "../../../../components/PayoutStatsCard";
import { Commission } from "../../../../types/Affiliates";

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

interface MonthlyData {
  month: number;
  monthName: string;
  signups: {
    count: number;
    amount: number;
    uniqueAffiliates: number;
  };
  purchases: {
    count: number;
    amount: number;
    uniqueAffiliates: number;
  };
  total: {
    count: number;
    amount: number;
    uniqueAffiliates: number;
  };
}

interface AdminStats {
  dashboard: {
    overview: {
      totalAffiliates: number;
      activeAffiliates: number;
      totalBalance: number;
      totalReferrals: number;
      tierBreakdown: {
        BRONZE: number;
        SILVER: number;
        GOLD: number;
        PLATINUM: number;
      };
    };
    earnings: {
      lifetime: {
        totalCommissions: number;
        totalEntries: number;
        signupCommissions: number;
        purchaseCommissions: number;
        signupCount: number;
        purchaseCount: number;
        uniqueAffiliates: number;
      };
      thisMonth: {
        totalCommissions: number;
        totalEntries: number;
        signupCommissions: number;
        purchaseCommissions: number;
        signupCount: number;
        purchaseCount: number;
        uniqueAffiliates: number;
      };
      thisWeek: {
        totalCommissions: number;
        totalEntries: number;
        signupCommissions: number;
        purchaseCommissions: number;
        signupCount: number;
        purchaseCount: number;
        uniqueAffiliates: number;
      };
    };
    withdrawals: {
      paid: {
        count: number;
        amount: number;
      };
      pending: {
        count: number;
        amount: number;
      };
      total: {
        count: number;
        amount: number;
      };
    };
  };
  yearly: {
    year: number;
    monthlyBreakdown: MonthlyData[];
    yearTotals: {
      signups: {
        count: number;
        amount: number;
        uniqueAffiliates: number;
      };
      purchases: {
        count: number;
        amount: number;
        uniqueAffiliates: number;
      };
      total: {
        count: number;
        amount: number;
        uniqueAffiliates: number;
      };
    };
    insights: {
      bestMonth: {
        month: string;
        amount: number;
        count: number;
        uniqueAffiliates: number;
      } | null;
      worstMonth;
      activeMonths: number;
      averageMonthlyEarnings: number;
      topPerformingAffiliates: Array<{
        _id: string;
        totalAmount: number;
        totalCount: number;
        signupCount: number;
        purchaseCount: number;
        affiliateId: string;
        referralCode: string;
        tier: string;
      }>;
    };
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
        const response = await axiosInstance.get("/admin/commissionStats");
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

  if (error && !stats) {
    return (
      <>
        <PageMeta
          title="Admin - Commission Management"
          description="Admin dashboard for managing affiliate commissions"
        />
        <PageBreadcrumb pageTitle={`Commission Management`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!stats) return null;

  return (
    <>
      <PageMeta
        title="Admin - Commission Management"
        description="Admin dashboard for managing affiliate commissions"
      />
      <PageBreadcrumb pageTitle={`Commission Management`} />

      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <PayoutStatsCard
            title="Total Lifetime"
            value={`$${stats.dashboard.earnings.lifetime.totalCommissions.toFixed(
              2
            )}`}
            subtitle="All-time commissions earned"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <PayoutStatsCard
            title="This Month"
            value={`$${stats.dashboard.earnings.thisMonth.totalCommissions.toFixed(
              2
            )}`}
            subtitle="Commissions earned this month"
            icon={<DollarSign className="w-6 h-6" />}
          />
          <PayoutStatsCard
            title="This Week"
            value={stats.dashboard.earnings.thisWeek.totalCommissions.toFixed(
              2
            )}
            subtitle={"Commissions earned this week"}
            icon={<Users className="w-6 h-6" />}
          />

          <PayoutStatsCard
            title="Pending Payouts"
            value={`$${stats.dashboard.withdrawals.pending.amount.toFixed(2)}`}
            subtitle={`${stats.dashboard.withdrawals.pending.count} pending requests`}
            icon={<Clock className="w-6 h-6" />}
          />
          <PayoutStatsCard
            title="Paid Out"
            value={`$${stats.dashboard.withdrawals.paid.amount.toFixed(2)}`}
            subtitle={`${stats.dashboard.withdrawals.paid.count} completed payments`}
            icon={<UserCheck className="w-6 h-6" />}
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PayoutStatsCard
            title="Signup Commissions"
            value={`$${stats.dashboard.earnings.lifetime.signupCommissions.toFixed(
              2
            )}`}
            subtitle={`${stats.dashboard.earnings.lifetime.signupCount} total signups`}
            icon={<UserCheck className="w-5 h-5" />}
          />
          <PayoutStatsCard
            title="Purchase Commissions"
            value={`$${stats.dashboard.earnings.lifetime.purchaseCommissions.toFixed(
              2
            )}`}
            subtitle={`${stats.dashboard.earnings.lifetime.purchaseCount} total purchases`}
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <PayoutStatsCard
            title="Total Affiliates"
            value={stats.dashboard.overview.totalAffiliates.toString()}
            subtitle={`${stats.dashboard.overview.totalReferrals.toString()} total referrals`}
            icon={<Users className="w-6 h-6" />}
          />
        </div>

        {/* Earnings Chart */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
          <div className="p-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Monthly Earnings Overview
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Signup vs Purchase commissions for {stats.yearly.year}
              </p>
            </div>
          </div>
          <CommissionsChart monthlyData={stats.yearly.monthlyBreakdown} />
        </div>

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
