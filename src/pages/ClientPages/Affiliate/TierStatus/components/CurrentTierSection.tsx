import { CheckCircle } from "lucide-react";
import Badge from "../../../../../components/ui/badge/Badge";
import { Tier } from "../TierStatus";

// Current Tier Section Component
export function CurrentTierSection({ currentTier }: { currentTier: Tier }) {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center gap-3">
        <div
          className={`p-4 rounded-full ${currentTier.bgColor} ${currentTier.color}`}
        >
          {currentTier.icon}
        </div>
        <div>
          <Badge size="md" color="info">
            {currentTier.name} Tier
          </Badge>
        </div>
      </div>

      <p className="text-lg text-gray-600 dark:text-gray-400">
        You are currently on{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentTier.name} Tier
        </span>
      </p>

      {/* Current Benefits Card */}
      <div className="max-w-md mx-auto bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Current Benefits
        </h3>
        <div className="space-y-3">
          {currentTier.benefits.slice(0, 3).map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
