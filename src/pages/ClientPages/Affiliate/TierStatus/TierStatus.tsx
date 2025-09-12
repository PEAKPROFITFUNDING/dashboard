import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import { Link } from "react-router";
import Button from "../../../../components/ui/button/Button";
import { Crown, Star, Award, Trophy } from "lucide-react";
import { TierComparison } from "./components/TierComparison";
import { RequirementsSection } from "./components/RequriementsSection";
import { ProgressSection } from "./components/ProgressSection";
import { CurrentTierSection } from "./components/CurrentTierSection";
import { useAffiliateProfile } from "../../../../context/user/UserAffiliatesContext";
import { useEffect } from "react";

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

const tiers: Tier[] = [
  {
    id: "bronze",
    name: "Bronze",
    icon: <Star className="w-6 h-6" />,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    commissionRate: 5,
    payoutFrequency: "Monthly",
    minEarnings: 0,
    maxEarnings: 499,
    benefits: [
      "5% commission rate",
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
    commissionRate: 7,
    payoutFrequency: "Bi-weekly",
    minEarnings: 500,
    maxEarnings: 1999,
    benefits: [
      "7% commission rate",
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
    commissionRate: 10,
    payoutFrequency: "Weekly",
    minEarnings: 2000,
    maxEarnings: 4999,
    benefits: [
      "10% commission rate",
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
    commissionRate: 15,
    payoutFrequency: "Weekly",
    minEarnings: 5000,
    benefits: [
      "15% commission rate",
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

export default function TierStatus() {
  const { affiliate, fetchAffiliateProfile, loading } = useAffiliateProfile();

  useEffect(() => {
    if (!affiliate) {
      fetchAffiliateProfile();
    }
  }, [affiliate, fetchAffiliateProfile]);

  if (loading || !affiliate) {
    return (
      <>
        <PageMeta
          title="PeakProfit - Affilite Tier Status"
          description="Peak Profit Affiliate Tier Status Page"
        />
        <PageBreadcrumb pageTitle={`Tier Status & Benefits`} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading affiliate data...
            </p>
          </div>
        </div>
      </>
    );
  }

  // Calculate months active (from creation date to now)
  const createdAt = new Date(affiliate.createdAt);
  const now = new Date();
  const monthsActive = Math.floor(
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  const currentUserData = {
    currentTier: affiliate.tier.toLowerCase(),
    lifetimeEarnings: affiliate.totalEarnings,
    totalReferrals: affiliate.totalReferrals,
    activeReferrals: affiliate.referrals.length,
    monthsActive: Math.max(monthsActive, 1), // At least 1 month
  };

  const currentTierIndex = tiers.findIndex(
    (tier) => tier.id === currentUserData.currentTier
  );
  const currentTier = tiers[currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];

  // Calculate requirements for next tier
  const requirements: Requirement[] = nextTier
    ? [
        {
          id: "earnings",
          description: "Lifetime earnings",
          completed: currentUserData.lifetimeEarnings >= nextTier.minEarnings,
          current: currentUserData.lifetimeEarnings,
          target: nextTier.minEarnings,
          unit: "$",
        },
        {
          id: "referrals",
          description: "Total successful referrals",
          completed: currentUserData.totalReferrals >= 10,
          current: currentUserData.totalReferrals,
          target: 10,
          unit: "",
        },
        {
          id: "months_active",
          description: "Months as active affiliate",
          completed: currentUserData.monthsActive >= 3,
          current: currentUserData.monthsActive,
          target: 3,
          unit: "",
        },
      ]
    : [];

  // Rest of the component remains the same...
  return (
    <>
      <PageMeta
        title="PeakProfit - Affilite Tier Status"
        description="Peak Profit Affiliate Tier Status Page"
      />
      <PageBreadcrumb pageTitle={`Tier Status & Benefits`} />

      <div className="space-y-6">
        {/* Current Tier Section */}
        <CurrentTierSection currentTier={currentTier} />

        {/* Progress and Requirements Grid */}
        <div
          className={`grid ${
            nextTier ? "grid-cols-1 lg:grid-cols-3 gap-6" : "grid-cols-1"
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
