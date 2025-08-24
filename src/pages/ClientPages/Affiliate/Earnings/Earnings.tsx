import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import BarChartOne from "../../../../components/charts/bar/BarChartOne";
import { StatsCard } from "./components/StatsCard";
import { CommissionTable } from "./components/CommissionTable";

// Types for sorting and filtering
export type SortField = "user" | "type" | "amount" | "status" | "date";
export type FilterType = "all" | "pending" | "approved" | "paid";

export interface Commission {
  id: number;
  user: string;
  type: string;
  amount: number;
  status: string;
  date: string;
}
const summaryData = {
  lifetime: 2500,
  thisMonth: 500,
  thisWeek: 120,
  pending: 200,
  approved: 1000,
  paid: 1300,
};

export default function Earnings() {
  return (
    <>
      <PageMeta
        title="Client PeakProfit"
        description="Peak Profit Affiliate Earnings Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Earnings Overview`} />

      <div className="space-y-8">
        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="xl:col-span-2">
            <StatsCard
              title="Lifetime Earnings"
              value={summaryData.lifetime}
              subtitle="Total earned since joining"
            />
          </div>
          <StatsCard
            title="This Month"
            value={summaryData.thisMonth}
            subtitle="Current month earnings"
          />
          <StatsCard
            title="This Week"
            value={summaryData.thisWeek}
            subtitle="Current week earnings"
          />
          <StatsCard
            title="Pending"
            value={summaryData.pending}
            subtitle="Awaiting approval"
          />
          <StatsCard
            title="Paid"
            value={summaryData.paid}
            subtitle="Successfully paid out"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Earnings Overview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly commission earnings for the current year
            </p>
          </div>
          <BarChartOne />
        </div>

        {/* Commission Table Section */}
        <CommissionTable />
      </div>
    </>
  );
}
