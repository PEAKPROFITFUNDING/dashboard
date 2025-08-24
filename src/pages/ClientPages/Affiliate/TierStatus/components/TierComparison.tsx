import { Tier } from "../TierStatus";

// Tier Comparison Component
export function TierComparison({
  tiers,
  currentTierIndex,
}: {
  tiers: Tier[];
  currentTierIndex: number;
}) {
  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          All Tier Comparison
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          See what you can unlock at each tier level
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Feature
              </th>
              {tiers.map((tier) => (
                <th
                  key={tier.id}
                  className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider ${
                    tier.id === tiers[currentTierIndex].id
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {tier.icon}
                    {tier.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                Commission Rate
              </td>
              {tiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-6 py-4 text-center text-sm ${
                    tier.id === tiers[currentTierIndex].id
                      ? "bg-blue-50 dark:bg-blue-900/10 font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {tier.commissionRate}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                Payout Frequency
              </td>
              {tiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-6 py-4 text-center text-sm ${
                    tier.id === tiers[currentTierIndex].id
                      ? "bg-blue-50 dark:bg-blue-900/10 font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {tier.payoutFrequency}
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                Minimum Earnings
              </td>
              {tiers.map((tier) => (
                <td
                  key={tier.id}
                  className={`px-6 py-4 text-center text-sm ${
                    tier.id === tiers[currentTierIndex].id
                      ? "bg-blue-50 dark:bg-blue-900/10 font-semibold text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  ${tier.minEarnings.toLocaleString()}
                  {tier.maxEarnings
                    ? ` - $${tier.maxEarnings.toLocaleString()}`
                    : "+"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
