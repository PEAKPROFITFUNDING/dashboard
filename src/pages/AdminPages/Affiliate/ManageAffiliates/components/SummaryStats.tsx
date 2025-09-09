import { Affiliate } from "./types";

interface SummaryStatsProps {
  affiliates: Affiliate[];
}

export default function SummaryStats({ affiliates }: SummaryStatsProps) {
  const totalReferrals = affiliates?.reduce((sum, a) => sum + a.signups, 0);
  const avgCommissionPercentage =
    affiliates?.length > 0
      ? (
          affiliates?.reduce((sum, a) => sum + a.commissionsEarned, 0) /
          affiliates?.length
        ).toFixed(1)
      : "0";

  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg shadow-lg border border-gray-200 overflow-hidden p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Affiliates
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {affiliates?.length}
        </div>
      </div>
      <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg shadow-lg border border-gray-200 overflow-hidden p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Referrals
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {totalReferrals?.toLocaleString()}
        </div>
      </div>
      <div className="bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-lg shadow-lg border border-gray-200 overflow-hidden p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Avg Commission %
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {avgCommissionPercentage}%
        </div>
      </div>
    </div>
  );
}
