import { useState, useEffect, useCallback } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "../../../../api/axiosInstance";
import EarningsChart from "./components/EarningsChart";
import { PayoutStatsCard } from "../../../../components/PayoutStatsCard";
import { Commission } from "../../../../types/Affiliates";
import { CommissionsTable } from "../../../../components/affiliates/ComissionsTable";

// Types for sorting and filtering
export type SortField = "user" | "type" | "amount" | "status" | "date";
export type CommissionFilterType = "all" | "SIGNUP" | "PURCHASE";

interface AffiliateStats {
  dashboard: {
    affiliate: {
      id: string;
      referralCode: string;
      tier: string;
      commissionPercentage: number;
      totalReferrals: number;
      availableBalance: number;
    };
    earnings: {
      lifetime: {
        total: number;
        signups: number;
        purchases: number;
        signupCount: number;
        purchaseCount: number;
      };
      thisMonth: {
        total: number;
        signups: number;
        purchases: number;
        signupCount: number;
        purchaseCount: number;
      };
      thisWeek: {
        total: number;
        signups: number;
        purchases: number;
        purchaseCount: number;
        signupCount: number;
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
    monthlyBreakdown: Array<{
      month: number;
      monthName: string;
      signups: {
        count: number;
        amount: number;
      };
      purchases: {
        count: number;
        amount: number;
      };
      total: {
        count: number;
        amount: number;
      };
    }>;
    yearTotals: {
      signups: {
        count: number;
        amount: number;
      };
      purchases: {
        count: number;
        amount: number;
      };
      total: {
        count: number;
        amount: number;
      };
    };
    insights: {
      bestMonth: string | null;
      worstMonth: string | null;
      activeMonths: number;
      averageMonthlyEarnings: number;
    };
  };
}

interface CommissionsResponse {
  result: {
    commissions;
    totalCommissions: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const dummyData = [
  {
    month: 1,
    monthName: "Jan",
    signups: { count: 12, amount: 120 },
    purchases: { count: 5, amount: 300 },
    total: { count: 17, amount: 420 },
  },
  {
    month: 2,
    monthName: "Feb",
    signups: { count: 8, amount: 80 },
    purchases: { count: 7, amount: 280 },
    total: { count: 15, amount: 360 },
  },
  {
    month: 3,
    monthName: "Mar",
    signups: { count: 15, amount: 150 },
    purchases: { count: 10, amount: 400 },
    total: { count: 25, amount: 550 },
  },
  {
    month: 4,
    monthName: "Apr",
    signups: { count: 10, amount: 100 },
    purchases: { count: 6, amount: 240 },
    total: { count: 16, amount: 340 },
  },
  {
    month: 5,
    monthName: "May",
    signups: { count: 20, amount: 200 },
    purchases: { count: 12, amount: 480 },
    total: { count: 32, amount: 680 },
  },
  {
    month: 6,
    monthName: "Jun",
    signups: { count: 18, amount: 180 },
    purchases: { count: 9, amount: 360 },
    total: { count: 27, amount: 540 },
  },
  {
    month: 7,
    monthName: "Jul",
    signups: { count: 14, amount: 140 },
    purchases: { count: 11, amount: 440 },
    total: { count: 25, amount: 580 },
  },
  {
    month: 8,
    monthName: "Aug",
    signups: { count: 22, amount: 220 },
    purchases: { count: 15, amount: 600 },
    total: { count: 37, amount: 820 },
  },
  {
    month: 9,
    monthName: "Sep",
    signups: { count: 9, amount: 90 },
    purchases: { count: 4, amount: 160 },
    total: { count: 13, amount: 250 },
  },
  {
    month: 10,
    monthName: "Oct",
    signups: { count: 16, amount: 160 },
    purchases: { count: 13, amount: 520 },
    total: { count: 29, amount: 680 },
  },
  {
    month: 11,
    monthName: "Nov",
    signups: { count: 11, amount: 110 },
    purchases: { count: 8, amount: 320 },
    total: { count: 19, amount: 430 },
  },
  {
    month: 12,
    monthName: "Dec",
    signups: { count: 25, amount: 250 },
    purchases: { count: 20, amount: 800 },
    total: { count: 45, amount: 1050 },
  },
];

export default function Earnings() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
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
      const url = `/affiliate/commissionHistory?page=${currentPage}&type=${typeFilter}`;
      const response = await axiosInstance.get<CommissionsResponse>(url);
      const commissionData = response.data.result.commissions;

      setCommissions(commissionData);
      setPagination({
        currentPage: response.data.result.currentPage,
        perPage: 10, // The API doesn't return perPage, so we hardcode it based on the expected behavior.
        totalItems: response.data.result.totalCommissions,
        totalPages: response.data.result.totalPages,
      });

      // Fetch all commissions to calculate counts for the filter bar
      const allCommissionsResponse =
        await axiosInstance.get<CommissionsResponse>(
          `/affiliate/commissionHistory?page=1&type=`
        );
      const allCommissions = allCommissionsResponse.data.result.commissions;
      const countsData = allCommissions.reduce(
        (acc: Record<string, number>, curr) => {
          const type = curr.type.toUpperCase();
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        },
        { all: allCommissionsResponse.data.result.totalCommissions }
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
    const fetchAffiliateStats = async () => {
      try {
        const response = await axiosInstance.get("/affiliate/stats");
        setStats(response.data.result);
      } catch (err) {
        console.error("Error fetching affiliate stats:", err);
        setError("Failed to load affiliate statistics");
      }
    };

    fetchAffiliateStats();
    fetchCommissions();
  }, [fetchCommissions]);

  const handleFilterChange = (filter) => {
    if (filter === "all") {
      setTypeFilter("");
    } else {
      setTypeFilter(filter as CommissionFilterType);
    }

    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearch = () => {
    // The new API endpoint does not support searching. We'll handle this on the client-side for now, but it's not ideal.
    // For a real-world scenario, the API would need to be updated.
    // For this implementation, we will just trigger a fetch and the search input will not affect the API call directly.
    setCurrentPage(1);
    fetchCommissions();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchCommissions();
  };

  const filteredAndSearchedCommissions = commissions.filter((commission) =>
    (commission?.referredUser?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  console.log(
    "filteredAndSearchedCommissions:",
    filteredAndSearchedCommissions
  );

  if (loading && !stats) {
    return (
      <>
        <PageMeta
          title="PeakProfit - Affiliate Earnings"
          description="Peak Profit Affiliate Earnings Page"
        />
        <PageBreadcrumb pageTitle={`Affiliate Earnings Overview`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading affiliate statistics...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageMeta
          title="PeakProfit - Affiliate Earnings"
          description="Peak Profit Affiliate Earnings Page"
        />
        <PageBreadcrumb pageTitle={`Affiliate Earnings Overview`} />
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
        title="PeakProfit - Affiliate Earnings"
        description="Peak Profit Affiliate Earnings Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Earnings Overview`} />

      <div className="space-y-8">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <PayoutStatsCard
            title="Lifetime Earnings"
            value={`$${stats.dashboard.earnings.lifetime.total.toFixed(2)}`}
            subtitle="Total earned since joining"
            icon={<DollarSign className="h-6 w-6" />}
          />

          <PayoutStatsCard
            title="This Month"
            value={`$${stats.dashboard.earnings.thisMonth.total.toFixed(2)}`}
            subtitle="Current month earnings"
            icon={<Calendar className="h-6 w-6" />}
          />
          <PayoutStatsCard
            title="This Week"
            value={`$${stats.dashboard.earnings.thisWeek.total.toFixed(2)}`}
            subtitle="Current week earnings"
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <PayoutStatsCard
            title="Pending"
            value={`$${stats.dashboard.withdrawals.pending.amount.toFixed(2)}`}
            subtitle="Awaiting approval"
            icon={<Clock className="h-6 w-6" />}
          />
          <PayoutStatsCard
            title="Paid"
            value={`$${stats.dashboard.withdrawals.paid.amount.toFixed(2)}`}
            subtitle="Successfully paid out"
            icon={<CheckCircle className="h-6 w-6" />}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
          <div className="p-6 ">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Earnings Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly commission earnings for {stats.yearly.year}
            </p>
          </div>
          <EarningsChart monthlyData={stats.yearly.monthlyBreakdown} />
        </div>

        {/* Commission Table Section */}
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
