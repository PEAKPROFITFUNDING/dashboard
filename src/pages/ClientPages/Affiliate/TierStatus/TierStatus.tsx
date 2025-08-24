import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { Link } from "react-router";
import Button from "../../../../components/ui/button/Button";
import { Crown, Star, Award, Trophy } from "lucide-react";
import { TierComparison } from "./components/TierComparison";
import { RequirementsSection } from "./components/RequriementsSection";
import { ProgressSection } from "./components/ProgressSection";
import { CurrentTierSection } from "./components/CurrentTierSection";

// Types
export interface Tier {
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

export interface Requirement {
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
  //   {
  //     id: "active_referrals",
  //     description: "Active referrals",
  //     completed: true,
  //     current: 12,
  //     target: 8,
  //     unit: "",
  //   },
  {
    id: "months_active",
    description: "Months as active affiliate",
    completed: true,
    current: 6,
    target: 3,
    unit: " months",
  },
];

export default function TierStatus() {
  const currentTierIndex = tiers.findIndex(
    (tier) => tier.id === currentUserData.currentTier
  );
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];

  return (
    <>
      <PageMeta
        title="PeakProfit - Affilite Tier Status"
        description="Peak Profit Affiliate Tier Status Page"
      />
      <PageBreadcrumb pageTitle={`Tier Status & Benefits`} />

      <div className="space-y-8">
        {/* Current Tier Section */}
        <CurrentTierSection currentTier={currentTier} />

        {/* Progress and Requirements Grid */}
        <div
          className={`grid ${
            nextTier ? "grid-cols-1 lg:grid-cols-3 gap-8" : "grid-cols-1"
          }  `}
        >
          {/* Progress Section - Takes 2 columns */}
          <div className={"col-span-2"}>
            <ProgressSection
              currentTier={currentTier}
              currentUserData={currentUserData}
              nextTier={nextTier}
            />
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
