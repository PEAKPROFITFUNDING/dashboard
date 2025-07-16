import { AffiliateDetails } from "./types";

interface PerformanceMetricsProps {
  affiliate: AffiliateDetails;
}

export default function PerformanceMetrics({
  affiliate,
}: PerformanceMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Chart data for performance metrics
  const performanceChartData = [
    { name: "Clicks", value: affiliate.performance.totalClicks },
    { name: "Signups", value: affiliate.performance.totalSignups },
    {
      name: "Funded Accounts",
      value: affiliate.performance.totalFundedAccounts,
    },
  ];

  const referralChartData = [
    { name: "Total Referrals", value: affiliate.referralStats.totalReferrals },
    { name: "Signed Up", value: affiliate.referralStats.signedUp },
    { name: "Deposited", value: affiliate.referralStats.deposited },
    {
      name: "Passed Challenge",
      value: affiliate.referralStats.passedChallenge,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Performance Metrics
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <div className="space-y-4">
            {performanceChartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Referral Statistics
          </h3>
          <div className="space-y-4">
            {referralChartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <span className="text-gray-600 dark:text-gray-400">
                  {item.name}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Clicks
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {affiliate.performance.totalClicks.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Signups
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {affiliate.performance.totalSignups.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Funded Accounts
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {affiliate.performance.totalFundedAccounts.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total Commissions
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(affiliate.performance.totalCommissionEarned)}
          </div>
        </div>
      </div>
    </div>
  );
}
