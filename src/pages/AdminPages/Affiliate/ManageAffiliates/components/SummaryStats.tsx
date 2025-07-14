import { Affiliate } from "./types";

interface SummaryStatsProps {
  affiliates: Affiliate[];
}

export default function SummaryStats({ affiliates }: SummaryStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const totalClicks = affiliates.reduce((sum, a) => sum + a.clicks, 0);
  const totalSignups = affiliates.reduce((sum, a) => sum + a.signups, 0);
  const totalCommissions = affiliates.reduce(
    (sum, a) => sum + a.commissionsEarned,
    0
  );

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Affiliates
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {affiliates.length}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Clicks
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {totalClicks.toLocaleString()}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Signups
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {totalSignups.toLocaleString()}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total Commissions
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(totalCommissions)}
        </div>
      </div>
    </div>
  );
}
