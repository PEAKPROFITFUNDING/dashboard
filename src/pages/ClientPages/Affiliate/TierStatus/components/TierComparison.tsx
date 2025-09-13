import { Tier } from "../TierStatus";

// Tier color mappings (no more "current tier" overrides here)
const getTierColors = (tierId: string) => {
  const colorMap = {
    bronze: {
      headerBg:
        "bg-gradient-to-r from-amber-600 to-amber-600/90 dark:from-amber-700/90 dark:to-amber-700/80",
      headerText: "text-amber-100 dark:text-amber-200",
      cellBg:
        "bg-gradient-to-b from-amber-50 to-amber-50/90 dark:from-amber-900/20 dark:to-amber-900/10",
      cellText: "text-amber-900 dark:text-amber-100",
    },
    silver: {
      headerBg:
        "bg-gradient-to-r from-gray-300 to-gray-300/90 dark:from-gray-600/90 dark:to-gray-600/80",
      headerText: "text-gray-900 dark:text-gray-100",
      cellBg:
        "bg-gradient-to-b from-gray-100 to-gray-100/90 dark:from-gray-800/20 dark:to-gray-800/10",
      cellText: "text-gray-900 dark:text-gray-100",
    },
    gold: {
      headerBg:
        "bg-gradient-to-r from-yellow-500 to-yellow-500/90 dark:from-yellow-600/90 dark:to-yellow-600/80",
      headerText: "text-yellow-50 dark:text-yellow-100",
      cellBg:
        "bg-gradient-to-b from-yellow-50 to-yellow-50/90 dark:from-yellow-900/20 dark:to-yellow-900/10",
      cellText: "text-yellow-900 dark:text-yellow-100",
    },
    platinum: {
      headerBg:
        "bg-gradient-to-r from-purple-700 to-purple-700/90 dark:from-purple-800/90 dark:to-purple-800/80",
      headerText: "text-purple-50 dark:text-purple-100",
      cellBg:
        "bg-gradient-to-b from-purple-50 to-purple-50/90 dark:from-purple-900/20 dark:to-purple-900/10",
      cellText: "text-purple-900 dark:text-purple-100",
    },
  };

  return colorMap[tierId as keyof typeof colorMap] || colorMap.bronze;
};

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
              {tiers.map((tier) => {
                const colors = getTierColors(tier.id);
                const isCurrentTier = tier.id === tiers[currentTierIndex].id;

                return (
                  <th
                    key={tier.id}
                    className={`px-6 py-4 text-center text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                      isCurrentTier
                        ? `ring-2 ring-blue-500 relative z-10 ${colors.headerBg} ${colors.headerText} shadow-sm`
                        : `${colors.headerBg} ${colors.headerText} hover:bg-gray-100 dark:hover:bg-gray-700/30`
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="white">{tier.icon}</span>
                      <span className="font-semibold">{tier.name}</span>
                      {isCurrentTier && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          Current
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
            {/* Commission Rate */}
            <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                Commission Rate
              </td>
              {tiers.map((tier) => {
                const colors = getTierColors(tier.id);
                const isCurrentTier = tier.id === tiers[currentTierIndex].id;

                return (
                  <td
                    key={tier.id}
                    className={`px-6 py-4 text-center text-sm font-semibold transition-all duration-200 ${
                      isCurrentTier
                        ? `ring-2 ring-blue-500 relative z-10 ${colors.cellBg} ${colors.cellText} shadow-sm`
                        : `${colors.cellBg} ${colors.cellText} hover:bg-gray-50 dark:hover:bg-white/[0.02]`
                    }`}
                  >
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold">
                      {tier.commissionRate}%
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Payout Frequency */}
            <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                Payout Frequency
              </td>
              {tiers.map((tier) => {
                const colors = getTierColors(tier.id);
                const isCurrentTier = tier.id === tiers[currentTierIndex].id;

                return (
                  <td
                    key={tier.id}
                    className={`px-6 py-4 text-center text-sm transition-all duration-200 ${
                      isCurrentTier
                        ? `ring-2 ring-blue-500 relative z-10 ${colors.cellBg} ${colors.cellText} font-semibold shadow-sm`
                        : `${colors.cellBg} ${colors.cellText} hover:bg-gray-50 dark:hover:bg-white/[0.02]`
                    }`}
                  >
                    {tier.payoutFrequency}
                  </td>
                );
              })}
            </tr>

            {/* Earnings Range */}
            <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                Earnings Range
              </td>
              {tiers.map((tier) => {
                const colors = getTierColors(tier.id);
                const isCurrentTier = tier.id === tiers[currentTierIndex].id;

                return (
                  <td
                    key={tier.id}
                    className={`px-6 py-4 text-center text-sm transition-all duration-200 ${
                      isCurrentTier
                        ? `ring-2 ring-blue-500 relative z-10 ${colors.cellBg} ${colors.cellText} font-semibold shadow-sm`
                        : `${colors.cellBg} ${colors.cellText} hover:bg-gray-50 dark:hover:bg-white/[0.02]`
                    }`}
                  >
                    <span className="inline-flex items-center">
                      ${tier.minEarnings.toLocaleString()}
                      {tier.maxEarnings
                        ? ` - $${tier.maxEarnings.toLocaleString()}`
                        : "+"}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Benefits Preview */}
      <div className="p-6 bg-gray-50 dark:bg-gray-800/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const colors = getTierColors(tier.id);
            const isCurrentTier = tier.id === tiers[currentTierIndex].id;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  isCurrentTier
                    ? `ring-2 ring-blue-500 relative z-10 ${colors.cellBg} ${colors.cellText} border-current/20 shadow-sm`
                    : `bg-white dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.05] hover:shadow-md ${colors.cellText}`
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={tier.color}>{tier.icon}</span>
                  <h4
                    className={`font-semibold text-sm ${
                      isCurrentTier
                        ? colors.cellText
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tier.name}
                  </h4>
                  {isCurrentTier && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Active
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {tier.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className={`text-xs `}>
                      • {benefit}
                    </li>
                  ))}
                  {tier.benefits.length > 3 && (
                    <li
                      className={`text-xs font-medium ${
                        isCurrentTier
                          ? colors.cellText
                          : "text-gray-500 dark:text-gray-500"
                      }`}
                    >
                      +{tier.benefits.length - 3} more benefits
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
