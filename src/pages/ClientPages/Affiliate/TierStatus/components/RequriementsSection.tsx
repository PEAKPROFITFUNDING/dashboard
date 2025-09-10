import { CheckCircle, XCircle } from "lucide-react";
import { Requirement, Tier } from "../TierStatus";

// Requirements Section Component
export function RequirementsSection({
  requirements,
  nextTier,
}: {
  requirements: Requirement[];
  nextTier?: Tier;
}) {
  if (!nextTier) return null;

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05] p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Requirements for {nextTier.name} Tier
      </h3>

      <div className="space-y-4">
        {requirements.map((req) => (
          <div
            key={req.id}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
          >
            <div className="flex-shrink-0">
              {req.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-gray-900 dark:text-white">
                  {req.description}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    req.completed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {req.unit}
                  {req.current.toLocaleString()} / {req.unit}
                  {req.target.toLocaleString()}
                  {req.unit === "" ? req.unit : ""}
                </span>
              </div>
              {!req.completed && (
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        (req.current / req.target) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
