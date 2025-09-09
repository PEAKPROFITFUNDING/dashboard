import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useState, useEffect } from "react";
import { AvailableBalanceCard } from "./components/AvailableBalanceCard";
import { RequestPayoutModal } from "./components/RequestPayoutModal";
import { WithdrawalHistoryTable } from "./components/WithdrawalHistoryTable";
import { useAffiliateProfile } from "../../../../context/user/UserAffiliatesContext";

export type SortField = "date" | "method" | "amount" | "status";
export type FilterType = "all" | "PENDING" | "APPROVED" | "DENIED" | "PAID";

export interface Withdrawal {
  _id: string;
  userId: string;
  affiliateId: string;
  amount: number;
  status: string;
  paymentMethod: {
    type: string;
    accountNumber: string;
  };
  challengeId: string | null;
  requestedDate: string;
  processedDate: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Withdrawals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { affiliate, loading, error, fetchAffiliateProfile } =
    useAffiliateProfile();

  useEffect(() => {
    if (!affiliate) {
      fetchAffiliateProfile();
    }
  }, [affiliate, fetchAffiliateProfile]);

  // Show loading state
  if (loading) {
    return (
      <>
        <PageMeta
          title="PeakProfit - Affiliate Withdrawals"
          description="Peak Profit Affiliate Withdrawals Page"
        />
        <PageBreadcrumb pageTitle={`Withdrawal Management`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading withdrawal data...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <PageMeta
          title="PeakProfit - Affiliate Withdrawals"
          description="Peak Profit Affiliate Withdrawals Page"
        />
        <PageBreadcrumb pageTitle={`Withdrawal Management`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400">
              Error loading withdrawal data
            </p>
            <button
              onClick={fetchAffiliateProfile}
              className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  const availableBalance = affiliate?.balance || 0;
  const withdrawals = affiliate?.withdraws || [];

  return (
    <>
      <PageMeta
        title="PeakProfit - Affiliate Withdrawals"
        description="Peak Profit Affiliate Withdrawals Page"
      />
      <PageBreadcrumb pageTitle={`Withdrawal Management`} />

      <div className="space-y-8">
        {/* Available Balance Section */}
        <div className="max-w-md mx-auto">
          <AvailableBalanceCard
            balance={availableBalance}
            onRequestPayout={() => setIsModalOpen(true)}
          />
        </div>

        {/* Withdrawal History Section */}
        <WithdrawalHistoryTable withdrawals={withdrawals} />

        {/* Request Payout Modal */}
        <RequestPayoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          availableBalance={availableBalance}
        />
      </div>
    </>
  );
}
