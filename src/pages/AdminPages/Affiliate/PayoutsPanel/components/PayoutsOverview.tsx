import { useState, useEffect } from "react";
import { Calendar, CheckCircle, DollarSign, TrendingUp } from "lucide-react";
import { StatsCard } from "./StatsCard";
import axiosInstance from "../../../../../api/axiosInstance";
import { PayoutStatsCard } from "../../../../../components/PayoutStatsCard";

// Define types for the API response
interface PayoutStatsResult {
  pending: {
    count: number;
    totalAmount: number;
    formattedAmount: string;
    description: string;
  };
  approvedUnpaid: {
    count: number;
    totalAmount: number;
    formattedAmount: string;
    description: string;
  };
  paidThisMonth: {
    totalAmount: number;
    formattedAmount: string;
    description: string;
  };
  lifetimePaid: {
    totalAmount: number;
    formattedAmount: string;
    description: string;
  };
}

interface PayoutStatsResponse {
  result: PayoutStatsResult;
  message: string;
}

const PayoutsOverview = () => {
  const [statsData, setStatsData] = useState<PayoutStatsResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch payout stats on component mount
  useEffect(() => {
    const fetchPayoutStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get<PayoutStatsResponse>(
          "/admin/payoutStats"
        );

        setStatsData(response.data.result);
      } catch (error) {
        console.error("Error fetching payout stats:", error);
        setError(
          error.response?.data?.message || "Failed to load payout statistics"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayoutStats();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error || !statsData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            {error || "Unable to load payout statistics"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <PayoutStatsCard
        title="Pending Requests"
        value={`${statsData.pending.count} (${statsData.pending.formattedAmount})`}
        subtitle={statsData.pending.description}
        icon={<Calendar className="w-8 h-8" />}
      />
      <PayoutStatsCard
        title="Approved (Unpaid)"
        value={`${statsData.approvedUnpaid.count} (${statsData.approvedUnpaid.formattedAmount})`}
        subtitle={statsData.approvedUnpaid.description}
        icon={<CheckCircle className="w-8 h-8" />}
      />
      <PayoutStatsCard
        title="Paid This Month"
        value={statsData.paidThisMonth.formattedAmount}
        subtitle={statsData.paidThisMonth.description}
        icon={<DollarSign className="w-8 h-8" />}
      />
      <PayoutStatsCard
        title="Lifetime Paid"
        value={statsData.lifetimePaid.formattedAmount}
        subtitle={statsData.lifetimePaid.description}
        icon={<TrendingUp className="w-8 h-8" />}
      />
    </div>
  );
};

export default PayoutsOverview;
