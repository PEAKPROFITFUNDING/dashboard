import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { Link } from "react-router";
import Button from "../../../../components/ui/button/Button";
import Badge from "../../../../components/ui/badge/Badge";
import { CheckCircle, XCircle, Crown, Star, Award, Trophy } from "lucide-react";

// Types
interface Tier {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  commissionRate: number;
  payoutFrequency: string;
  minEarnings: number;
  maxEarnings?: number;
  benefits: string[];
}

interface Requirement {
  id: string;
  description: string;
  completed: boolean;
  current: number;
  target: number;
  unit: string;
}

// Dummy data
const currentUserData = {
  currentTier: "silver",
  lifetimeEarnings: 800,
  totalReferrals: 15,
  activeReferrals: 12,
  monthsActive: 6,
};

const tiers: Tier[] = [
  {
    id: "basic",
    name: "Basic",
    icon: <Star className="w-6 h-6" />,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    commissionRate: 3,
    payoutFrequency: "Monthly",
    minEarnings: 0,
    maxEarnings: 499,
    benefits: [
      "3% commission rate",
      "Monthly payouts",
      "Basic support",
      "Access to marketing materials",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    icon: <Award className="w-6 h-6" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    commissionRate: 5,
    payoutFrequency: "Bi-weekly",
    minEarnings: 500,
    maxEarnings: 1999,
    benefits: [
      "5% commission rate",
      "Bi-weekly payouts",
      "Priority support",
      "Advanced marketing materials",
      "Performance analytics",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    icon: <Trophy className="w-6 h-6" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    commissionRate: 8,
    payoutFrequency: "Weekly",
    minEarnings: 2000,
    maxEarnings: 4999,
    benefits: [
      "8% commission rate",
      "Weekly payouts",
      "Dedicated support",
      "Custom marketing materials",
      "Advanced analytics dashboard",
      "Early access to new features",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: <Crown className="w-6 h-6" />,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    commissionRate: 12,
    payoutFrequency: "Weekly",
    minEarnings: 5000,
    benefits: [
      "12% commission rate",
      "Weekly payouts",
      "VIP support line",
      "Personalized marketing strategy",
      "Real-time analytics",
      "Beta feature access",
      "Quarterly bonus rewards",
      "Direct account manager",
    ],
  },
];

const requirements: Requirement[] = [
  {
    id: "earnings",
    description: "Lifetime earnings",
    completed: false,
    current: 800,
    target: 2000,
    unit: "$",
  },
  {
    id: "referrals",
    description: "Total successful referrals",
    completed: true,
    current: 15,
    target: 10,
    unit: "",
  },
  {
    id: "active_referrals",
    description: "Active referrals",
    completed: true,
    current: 12,
    target: 8,
    unit: "",
  },
  {
    id: "months_active",
    description: "Months as active affiliate",
    completed: true,
    current: 6,
    target: 3,
    unit: " months",
  },
];

// Current Tier Section Component
function CurrentTierSection({ currentTier }: { currentTier: Tier }) {
  return (
    <div className="text-center space-y-6">
      <div className="inline-flex items-center gap-3">
        <div
          className={`p-4 rounded-full ${currentTier.bgColor} ${currentTier.color}`}
        >
          {currentTier.icon}
        </div>
        <div>
          <Badge size="lg" color="primary" className="text-base px-4 py-2">
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

// Progress Section Component
function ProgressSection({
  currentTier,
  nextTier,
}: {
  currentTier: Tier;
  nextTier?: Tier;
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

// Requirements Section Component
function RequirementsSection({
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
                <span className="font-medium text-gray-900 dark:text-white">
                  {req.description}
                </span>
                <span
                  className={`text-sm font-semibold ${
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

// Tier Comparison Component
function TierComparison({
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

export default function TierStatus() {
  const currentTierIndex = tiers.findIndex(
    (tier) => tier.id === currentUserData.currentTier
  );
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];

  return (
    <>
      <PageMeta
        title="Client PeakProfit - Tier Status"
        description="Peak Profit Affiliate Tier Status Page"
      />
      <PageBreadcrumb pageTitle={`Tier Status & Benefits`} />

      <div className="space-y-8">
        {/* Current Tier Section */}
        <CurrentTierSection currentTier={currentTier} />

        {/* Progress and Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ProgressSection currentTier={currentTier} nextTier={nextTier} />
          </div>

          {/* Requirements Section - Takes 1 column */}
          <div>
            <RequirementsSection
              requirements={requirements}
              nextTier={nextTier}
            />
          </div>
        </div>

        {/* Tier Comparison Section */}
        <TierComparison tiers={tiers} currentTierIndex={currentTierIndex} />

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-white/[0.05] p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Want to Learn More About Our Tier System?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Discover all the exclusive benefits, requirements, and strategies to
            advance through our tier system and maximize your affiliate
            earnings.
          </p>
          <Link to="">
            <Button variant="primary" size="md" className="px-8">
              Learn More About Tiers
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
