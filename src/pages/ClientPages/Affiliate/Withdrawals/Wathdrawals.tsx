import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { useState } from "react";
import { AvailableBalanceCard } from "./components/AvailableBalanceCard";
import { RequestPayoutModal } from "./components/RequestPayoutModal";
import { WithdrawalHistoryTable } from "./components/WithdrawalHistoryTable";

// Types for sorting and filtering
export type SortField = "date" | "method" | "amount" | "status";
export type FilterType = "all" | "pending" | "approved" | "paid" | "rejected";

export interface Withdrawal {
  id: number;
  date: string;
  method: string;
  amount: number;
  status: string;
}

// Dummy data
const availableBalance = 1200;

export default function Withdrawals() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <WithdrawalHistoryTable />

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
