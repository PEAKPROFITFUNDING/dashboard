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
import { useEffect, useState } from "react";
import axiosInstance from "../../../../api/axiosInstance";

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

interface TierDetails {
  minReferrals: number;
  commissionPercentage: number;
  nextTier: string | null;
  minEarning: number;
  maxEarning?: number;
}

interface TierDetailsResponse {
  BRONZE: TierDetails;
  SILVER: TierDetails;
  GOLD: TierDetails;
  PLATINUM: TierDetails;
}

const defaultTiers: Tier[] = [
  {
    id: "bronze",
    name: "Bronze",
    icon: <Star className="w-6 h-6" />,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    commissionRate: 5,
    payoutFrequency: "Weekly",
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
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-300",
    commissionRate: 7,
    payoutFrequency: "Weekly",
    minEarnings: 500,
    maxEarnings: 1999,
    benefits: [
      "7% commission rate",
      "Weekly payouts",
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
    borderColor: "border-yellow-300",
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
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
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
  const [tiers, setTiers] = useState<Tier[]>(defaultTiers);
  const [tierDetailsLoading, setTierDetailsLoading] = useState(false);

  // Fetch tier details from API
  const fetchTierDetails = async () => {
    try {
      setTierDetailsLoading(true);
      const response = await axiosInstance.get<{
        result: TierDetailsResponse;
        message: string;
      }>("/affiliate/tierDetails");
      const tierDetails = response.data.result;

      // Update tiers with API data
      const updatedTiers: Tier[] = [
        {
          ...defaultTiers[0],
          commissionRate: tierDetails.BRONZE.commissionPercentage,
          minEarnings: tierDetails.BRONZE.minEarning,
          maxEarnings: tierDetails.BRONZE.maxEarning,
          benefits: [
            `${tierDetails.BRONZE.commissionPercentage}% commission rate`,
            "Weekly payouts",
            "Basic support",
            "Access to marketing materials",
          ],
        },
        {
          ...defaultTiers[1],
          commissionRate: tierDetails.SILVER.commissionPercentage,
          minEarnings: tierDetails.SILVER.minEarning,
          maxEarnings: tierDetails.SILVER.maxEarning,
          benefits: [
            `${tierDetails.SILVER.commissionPercentage}% commission rate`,
            "Weekly payouts",
            "Priority support",
            "Advanced marketing materials",
            "Performance analytics",
          ],
        },
        {
          ...defaultTiers[2],
          commissionRate: tierDetails.GOLD.commissionPercentage,
          minEarnings: tierDetails.GOLD.minEarning,
          maxEarnings: tierDetails.GOLD.maxEarning,
          benefits: [
            `${tierDetails.GOLD.commissionPercentage}% commission rate`,
            "Weekly payouts",
            "Dedicated support",
            "Custom marketing materials",
            "Advanced analytics dashboard",
            "Early access to new features",
          ],
        },
        {
          ...defaultTiers[3],
          commissionRate: tierDetails.PLATINUM.commissionPercentage,
          minEarnings: tierDetails.PLATINUM.minEarning,
          benefits: [
            `${tierDetails.PLATINUM.commissionPercentage}% commission rate`,
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

      setTiers(updatedTiers);
    } catch (error) {
      console.error("Failed to fetch tier details:", error);
      // Keep default tiers if API call fails
    } finally {
      setTierDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (!affiliate) {
      fetchAffiliateProfile();
    }
    fetchTierDetails();
  }, [affiliate, fetchAffiliateProfile]);

  if (loading || !affiliate || tierDetailsLoading) {
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

  return (
    <>
      <PageMeta
        title="Affilite Tier Status"
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
