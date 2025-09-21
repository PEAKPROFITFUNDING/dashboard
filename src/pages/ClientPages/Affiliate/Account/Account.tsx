import { useEffect } from "react";
import PageMeta from "../../../../components/common/PageMeta";
import PageBreadcrumb from "../../../../components/common/PageBreadCrumb";
import AffiliateReferralList from "../../../../components/affiliates/AffiliateReferralList";
import AffiliateProfileCard from "../../../../components/affiliates/AffiliateProfileCard";
import AffiliateProfileStats from "../../../../components/affiliates/AffiliateProfileStats";
import { useAffiliateProfile } from "../../../../context/user/UserAffiliatesContext";

export default function Account() {
  const { affiliate, loading, error, fetchAffiliateProfile, hasData } =
    useAffiliateProfile();

  useEffect(() => {
    if (!affiliate) {
      fetchAffiliateProfile();
    }
  }, [affiliate, fetchAffiliateProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!hasData || !affiliate) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            No Data Found
          </h2>
          <p className="text-gray-600">Unable to load affiliate profile</p>
        </div>
      </div>
    );
  }

  // Transform API data to match component structure
  const transformedAffiliate = {
    fullName: affiliate.userId.name,
    email: affiliate.userId.email,
    joinedDate: affiliate.createdAt,
    referralCode: affiliate.referralCode,
    referralLink: affiliate.referralLink,
    tier: affiliate.tier,
    totalEarnings: affiliate.totalEarnings,
    balance: affiliate.balance,
    commissionPercentage: affiliate.commissionPercentage,
    totalReferrals: affiliate.totalReferrals,
    totalWithdrawn: affiliate.totalWithdrawn,
  };

  // Transform referrals data
  const transformedReferrals = affiliate.referrals.map((referral) => ({
    id: referral._id,
    fullName: referral.referredUser.name,
    email: referral.referredUser.email,
    phone: "N/A", // Not provided in API response
    signUpDate: referral.signupDate,
    totalCommission: referral.totalEarnings,
    currentStatus:
      referral.purchases.length > 0 ? "active_trader" : "signed_up",
    steps: [
      {
        id: `signup-${referral._id}`,
        type: "signup",
        title: "Account Registration",
        date: referral.signupDate,
        status: "completed",
        details: {
          commissionEarned: referral.signupCommission,
        },
      },
      ...referral.purchases.map((purchase, purchaseIndex) => ({
        id: `challenge-${purchase._id}`,
        type: "challenge",
        title: "Challenge Purchase",
        date: purchase.purchaseDate,
        status: "completed",
        details: {
          challenge: {
            name: `Challenge ${purchaseIndex + 1}`,
            price: purchase.challengeCost,
            status: "completed",
            commissionEarned: purchase.commissionEarned,
            completedDate: purchase.purchaseDate,
          },
        },
      })),
    ],
  }));

  return (
    <>
      <PageMeta
        title="Affiliate Account"
        description="Peak Profit Affiliate Account Page"
      />
      <PageBreadcrumb pageTitle={`Affiliate Account`} />

      <div className="space-y-6">
        {/* Profile Card */}
        <AffiliateProfileCard affiliate={transformedAffiliate} />

        {/* Performance Stats */}
        <AffiliateProfileStats affiliateData={affiliate} />

        {/* Referrals List */}
        <AffiliateReferralList referrals={transformedReferrals} />
      </div>
    </>
  );
}
