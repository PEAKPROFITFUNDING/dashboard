import { Crown } from "lucide-react";
import { Tier } from "../TierStatus";

// Progress Section Component
export function ProgressSection({
  currentTier,
  nextTier,
  currentUserData,
}: {
  currentTier: Tier;
  nextTier?: Tier;
  currentUserData;
}) {
  if (!nextTier) {
    return (
      <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-8">
        <div className="text-center">
          <div className="mb-4">
            <Crown className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Congratulations! 🎉
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You've reached the highest tier available!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentEarnings = currentUserData.lifetimeEarnings;
  const targetEarnings = nextTier.minEarnings;
  const progress = Math.min((currentEarnings / targetEarnings) * 100, 100);
  const remaining = Math.max(targetEarnings - currentEarnings, 0);

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Progress to {nextTier.name} Tier
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          ${remaining.toLocaleString()} more to unlock {nextTier.name} benefits
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ${currentEarnings.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ${targetEarnings.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background:
                nextTier.id === "gold"
                  ? "linear-gradient(to right, #fbbf24, #f59e0b)"
                  : nextTier.id === "platinum"
                  ? "linear-gradient(to right, #a855f7, #7c3aed)"
                  : "linear-gradient(to right, #3b82f6, #2563eb)",
            }}
          ></div>
        </div>
        <div className="text-center mt-2">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {progress.toFixed(1)}% Complete
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentTier.commissionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current Rate
          </div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {nextTier.commissionRate}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Next Tier Rate
          </div>
        </div>
      </div>
    </div>
  );
}
